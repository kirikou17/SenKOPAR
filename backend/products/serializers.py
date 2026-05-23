from rest_framework import serializers
from .models import Produit, Fournisseur, MouvementStock

class FournisseurSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fournisseur
        fields = '__all__'

class MouvementStockSerializer(serializers.ModelSerializer):
    # On affiche le nom du produit pour plus de clarté dans les réponses API
    nom_produit = serializers.ReadOnlyField(source='produit.nom_produit')

    class Meta:
        model = MouvementStock
        fields = [
            'id', 'produit', 'nom_produit', 'type_mouvement', 
            'quantite', 'motif', 'nouveau_prix_achat', 
            'nouveau_prix_vente', 'date_mouvement'
        ]

class ProduitSerializer(serializers.ModelSerializer):
    # Pour afficher les détails du fournisseur au lieu de juste son ID (Optionnel)
    fournisseur_details = FournisseurSerializer(source='fournisseur', read_only=True)
    
    class Meta:
        model = Produit
        fields = [
            'id', 'nom_produit', 'stock_quantite', 'prix_d_achat', 
            'prix_de_vente', 'benefice_sur_vente', 'alert_stock', 
            'boutique', 'fournisseur', 'fournisseur_details'
        ]
        # Le bénéfice est calculé par le modèle, l'utilisateur ne doit pas le saisir
        read_only_fields = ['benefice_sur_vente']

class ProduitBoutiqueSerializer(serializers.ModelSerializer):
    # Pour afficher les détails complets du fournisseur au lieu de juste son ID (en lecture seule)
    fournisseur_details = FournisseurSerializer(source='fournisseur', read_only=True)
    
    class Meta:
        model = Produit
        fields = [
            'id', 'nom_produit', 'stock_quantite', 'prix_d_achat', 
            'prix_de_vente', 'benefice_sur_vente', 'alert_stock', 
            'boutique', 'fournisseur', 'fournisseur_details'
        ]
        # Le bénéfice est calculé automatiquement par le modèle (ou par un property), 
        # l'utilisateur ne doit pas pouvoir le modifier manuellement.
        read_only_fields = ['benefice_sur_vente']

    def validate(self, data):
        """
        Vérifications métiers et contrôles de sécurité
        """
        # 1. Extraction du contexte de la requête HTTP pour identifier l'utilisateur
        request = self.context.get('request')
        utilisateur_authentifie = request.user if request else None

        # 2. Sécurité : Vérifier que la boutique sélectionnée appartient bien à l'utilisateur connecté
        # (Remplace 'proprietaire' par le champ exact défini dans ton modèle Boutique, ex: 'user' ou 'gerant')
        boutique = data.get('boutique')
        if boutique and utilisateur_authentifie:
            if hasattr(boutique, 'proprietaire') and boutique.proprietaire != utilisateur_authentifie:
                raise serializers.ValidationError({
                    "boutique": "Action interdite. Vous n'êtes pas le propriétaire de cette boutique."
                })

        # 3. Validation de la rentabilité (Éviter la vente à perte)
        prix_d_achat = data.get('prix_d_achat')
        prix_de_vente = data.get('prix_de_vente')

        # Lors d'une mise à jour partielle (PATCH), on récupère les valeurs existantes si non fournies
        if self.instance:
            if prix_d_achat is None:
                prix_d_achat = self.instance.prix_d_achat
            if prix_de_vente is None:
                prix_de_vente = self.instance.prix_de_vente

        if prix_de_vente is not None and prix_d_achat is not None:
            if prix_de_vente < prix_d_achat:
                raise serializers.ValidationError({
                    "prix_de_vente": (
                        f"Le prix de vente ({prix_de_vente} FCFA) ne peut pas être inférieur "
                        f"au prix d'achat ({prix_d_achat} FCFA). Vous allez vendre à perte !"
                    )
                })

        return data