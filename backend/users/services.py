from django.db import transaction
from django.utils import timezone
from datetime import timedelta
from users.models import Utilisateur
from shops.models import Boutique
from subscribes.models import Abonnement, Plan

def creer_compte_complet(data_user, data_boutique, plan_id):
    """
    Service d'orchestration pour l'inscription SenKOPAR.
    Garantit que si un élément échoue, rien n'est enregistré en base (ACID).
    """
    with transaction.atomic():
        # 1. Création de l'Utilisateur
        # Utilise create_user pour hacher le mot de passe automatiquement
        user = Utilisateur.objects.create_user(
            username=data_user['username'],
            password=data_user['password'],
            prenom=data_user.get('prenom', ''),
            nom=data_user.get('nom', ''),
            tel_utilisateur=data_user.get('tel_utilisateur')
        )

        # 2. Création de la Boutique liée à l'utilisateur
        # On récupère les infos comme la région, pays, devise, etc.
        boutique = Boutique.objects.create(
            proprietaire=user,
            nom_boutique=data_boutique['nom_boutique'],
            region=data_boutique.get('region'),
            devise_monetaire=data_boutique.get('devise_monetaire', 'XOF'),
            pays=data_boutique.get('pays', 'Sénégal')
        )

        # 3. Activation de l'Abonnement
        try:
            plan = Plan.objects.get(id=plan_id)
        except Plan.DoesNotExist:
            # Si le plan n'existe pas, la transaction s'annule ici
            raise ValueError(f"Le plan avec l'ID {plan_id} n'existe pas.")

        # Calcul de la date d'expiration (ex: +14 jours pour le plan Gratuit)
        # Tu peux ajuster la logique selon ton modèle
        date_fin = timezone.now() + timedelta(days=5) # Par défaut 5 jours
        
        Abonnement.objects.create(
            boutique=boutique,
            plan=plan,
            date_de_debut=timezone.now(),
            date_d_expiration=date_fin,
            est_active=True
        )

        return user, boutique
    

##service pour filtrer les boutique d'un utilisateur donné (pour le dashboard ou la création de produits)
def get_boutiques_utilisateur(user):
    """
    Récupère toutes les boutiques associées à un utilisateur donné.
    Utile pour afficher la liste des boutiques dans le dashboard ou lors de la création de produits.
    """
    return Boutique.objects.filter(proprietaire=user)

