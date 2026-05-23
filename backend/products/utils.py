# products/utils.py
from django.core.exceptions import ValidationError
from core.choices import TypeMouvement

def calculer_benefice(prix_vente, prix_achat):
    """
    Calcule le bénéfice linéaire simple.
    Retourne la différence entre le prix de vente et le prix d'achat.
    """
    return float(prix_vente or 0) - float(prix_achat or 0)


def valider_disponibilite_stock(stock_actuel, quantite_demandee, nom_produit="Ce produit"):
    """
    Vérifie si le stock disponible est suffisant pour couvrir la demande.
    Lève une ValidationError si le stock est insuffisant.
    """
    if stock_actuel < quantite_demandee:
        raise ValidationError(
            f"Action impossible : Stock insuffisant pour '{nom_produit}' "
            f"({stock_actuel} disponibles, {quantite_demandee} demandés)."
        )


def executer_mouvement_stock_initial(produit, initial_stock):
    """
    Gère proprement la création du premier flux entrant lors de l'initialisation
    d'un produit dans le catalogue pour éviter les doubles calculs.
    """
    from .models import MouvementStock  # Import local pour éviter les imports circulaires
    
    if initial_stock > 0:
        MouvementStock.objects.create(
            produit=produit,
            quantite=initial_stock,
            nouveau_prix_achat=produit.prix_d_achat,
            nouveau_prix_vente=produit.prix_de_vente,
            type_mouvement=TypeMouvement.ENTREE,
            motif="Initialisation du stock à la création"
        )