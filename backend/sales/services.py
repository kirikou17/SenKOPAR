from django.db import transaction
from django.core.exceptions import ValidationError
from .models import Vente, LigneVente, Versement
from products.models import MouvementStock, Produit
from django.utils import timezone
from core.choices import StatutPaiement,TypeMouvement,TypeVente


class VenteService:
    
    @transaction.atomic
    def creer_vente_avec_lignes(boutique_id, type_de_vente, montant_paye, lignes_data, mode_de_paiement=None, client_id=None, description_vente=None):
       
        #0 --- SÉCURITÉ : SÉPARATION VENTE LIBRE / VENTE CLIENT ---
        if type_de_vente == TypeVente.DETTE and not client_id:
            raise ValidationError(
                "Opération refusée : Impossible d'enregistrer une dette pour une vente libre. "
                "Un client identifié est obligatoire."
            )
       
        # 1. Validation de sécurité sur le mode de paiement
        montant_paye = float(montant_paye or 0)
        if montant_paye > 0 and not mode_de_paiement:
            raise ValidationError("Un montant a été payé, vous devez spécifier le mode de paiement (ESPECE, OM, WAVE, FREE).")

        # 2. On initialise la vente
        vente = Vente.objects.create(
            boutique_id=boutique_id,
            client_id=client_id,
            type_de_vente=type_de_vente,
            montant_paye=montant_paye,
            description_vente=description_vente,
            montant_total=0.0,
            reste_a_payer=0.0,
            statut_paiement=StatutPaiement.EN_ATTENTE
        )
        
        montant_total_calcule = 0.0
        
        # 3. On traite chaque ligne de vente
        for item in lignes_data:
            produit_id = item.get('produit')
            designation_libre = item.get('designation')
            quantite = int(item.get('quantite', 1))
            prix_unitaire = float(item.get('prix_unitaire', 0))
            
            if not produit_id and not designation_libre:
                raise ValidationError("Chaque ligne doit cibler un produit ou contenir une désignation manuelle.")
            
            total_ligne = quantite * prix_unitaire
            montant_total_calcule += total_ligne
            
            produit = None
            if produit_id:
                produit = Produit.objects.get(id=produit_id)
                
                if produit.boutique_id != int(boutique_id):
                    raise ValidationError(f"Le produit '{produit.nom_produit}' n'appartient pas à cette boutique.")
                
                if produit.stock_quantite < quantite:
                    raise ValidationError(f"Stock insuffisant pour '{produit.nom_produit}' ({produit.stock_quantite} disponibles).")
                
                # Déduction unique et contrôlée du stock (Bug du double-stock résolu)
                produit.stock_quantite -= quantite
                produit.save(update_fields=['stock_quantite'])
                
                MouvementStock.objects.create(
                    produit=produit,
                    quantite=quantite,
                    type_mouvement=TypeMouvement.VENTE,
                    motif=f"Déduction automatique - Vente #{vente.id}",
                    nouveau_prix_vente=prix_unitaire
                )
            
            LigneVente.objects.create(
                vente=vente,
                produit=produit,
                designation=designation_libre if not produit else produit.nom_produit,
                quantite=quantite,
                prix_unitaire=prix_unitaire,
                total=total_ligne
            )
            
        # 4. Finalisation des calculs financiers de la vente
        vente.montant_total = montant_total_calcule
        vente.reste_a_payer = max(0.0, montant_total_calcule - montant_paye)
        
        if vente.reste_a_payer <= 0:
            vente.statut_paiement = StatutPaiement.PAYE
        elif montant_paye > 0:
            vente.statut_paiement = StatutPaiement.PARTIEL
        else:
            vente.statut_paiement = StatutPaiement.EN_ATTENTE
            
        vente.save(update_fields=['montant_total', 'reste_a_payer', 'statut_paiement'])
        
        # 5. AJOUT CRUCIAL : Génération du premier versement comptable
        if montant_paye > 0:
            Versement.objects.create(
                vente=vente,
                montant_verse=montant_paye,
                mode_de_paiement=mode_de_paiement,
                date_de_versement=timezone.now()
                
            )
        
        return vente