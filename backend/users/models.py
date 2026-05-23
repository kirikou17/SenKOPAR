from django.db import models
from django.contrib.auth.models import AbstractUser
from core.choices import Role  # Importation de la classe Role depuis core.choices

class Utilisateur(AbstractUser):
    # On utilise un PositiveSmallIntegerField pour stocker 1, 2 ou 3
    role = models.PositiveSmallIntegerField(
        choices=Role.choices,
        default=Role.PROPRIETAIRE,
    )
    prenom = models.CharField(max_length=100)
    nom = models.CharField(max_length=100)
    tel_utilisateur = models.BigIntegerField(null=True, blank=True)
    
    # Lien vers la boutique (Clé de l'isolation des données)
    boutique = models.ForeignKey(
        'shops.Boutique', 
        on_delete=models.CASCADE, 
        related_name='utilisateurs',
        null=True,
        blank=True
    )

    def __str__(self):
        return f"{self.prenom} {self.nom} ({self.get_role_display()})"