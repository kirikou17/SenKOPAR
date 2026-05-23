from .models import Boutique

def get_boutiques_utilisateur(user):
    """
    Récupère toutes les boutiques associées à un utilisateur donné.
    Utile pour afficher la liste des boutiques dans le dashboard ou lors de la création de produits.
    """
    return Boutique.objects.filter(proprietaire=user)