from django.db import models
from core.choices import Region


class Boutique(models.Model): 

    nom_boutique = models.CharField(max_length=255)
    logo_boutique = models.ImageField(upload_to='logos/', null=True, blank=True)
    devise_monetaire = models.CharField(max_length=10, default='XOF')
    pays = models.CharField(max_length=100, default='Sénégal')
    region = models.CharField(max_length=50, choices=Region.choices)
    proprietaire = models.OneToOneField(
        'users.Utilisateur', 
        on_delete=models.CASCADE, 
        related_name='mes_boutiques'
    )
    create_at = models.DateTimeField(auto_now_add=True)
    update_at = models.DateTimeField(auto_now=True)