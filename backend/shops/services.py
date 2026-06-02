import datetime
from django.db.models import Sum, F, Q
from .models import Boutique
from sales.models import Vente
from products.models import Produit
from core.choices import StatutPaiement

def get_boutiques_utilisateur(user):
    return Boutique.objects.filter(proprietaire=user)

def get_chiffre_affaires_boutique(boutique, annee=None, mois=None):
    maintenant = datetime.datetime.now()
    annee_cible = annee if annee is not None else maintenant.year
    
    # Sécurisé avec boutique_id
    ventes = Vente.objects.filter(boutique_id=boutique)
    if annee_cible:
        ventes = ventes.filter(date_vente__year=annee_cible)
    if mois is not None:
        ventes = ventes.filter(date_vente__month=mois)
        
    resultat = ventes.aggregate(total=Sum('montant_total'))['total']
    return float(resultat) if resultat is not None else 0.0

def get_stock_total_boutique(boutique):
    resultat = Produit.objects.filter(boutique_id=boutique).aggregate(total_stock=Sum('stock_quantite'))['total_stock']
    return int(resultat) if resultat is not None else 0

def get_benefice_total_boutique(boutique, annee=None, mois=None):
    maintenant = datetime.datetime.now()
    annee_cible = annee if annee is not None else maintenant.year
    mois_cible = mois if mois is not None else maintenant.month

    ventes = Vente.objects.filter(boutique_id=boutique)
    if annee_cible:
        ventes = ventes.filter(date_vente__year=annee_cible)
    if mois_cible:
        ventes = ventes.filter(date_vente__month=mois_cible)
        
    resultat = ventes.aggregate(
        total_benefice=Sum(F('lignes__quantite') * F('lignes__benefice_sur_vente'))
    )['total_benefice']
    return float(resultat) if resultat is not None else 0.0

def get_produits_en_rupture_stock(boutique):
    return Produit.objects.filter(boutique_id=boutique, stock_quantite__lte=F('alert_stock'))

def get_produits_plus_vendus(boutique, top_n=5):
    # Utilisation d'une jointure explicite et propre sur la relation 'mouvements'
    return (
        Produit.objects.filter(boutique_id=boutique)
        .annotate(total_vendus=Sum('mouvements__quantite', filter=Q(mouvements__type_mouvement='VENTE'))) 
        .order_by('-total_vendus')[:top_n]
    )

def get_dette_totale_boutique(boutique):
    dette = Vente.objects.filter(
        boutique_id=boutique,
        statut_paiement=StatutPaiement.EN_ATTENTE
    ).aggregate(total_dette=Sum('montant_total'))['total_dette']
    return float(dette) if dette is not None else 0.0

def get_dette_partielle_boutique(boutique):
    dette_partielle = Vente.objects.filter(
        boutique_id=boutique, 
        statut_paiement=StatutPaiement.PARTIEL
    ).aggregate(total_dette_partielle=Sum('montant_total'))['total_dette_partielle']
    return float(dette_partielle) if dette_partielle is not None else 0.0
