from django.db import models

class Plan(models.Model):
    nom_plan = models.CharField(max_length=100) # Ex: "Essai", "Mensuel", "Annuel"
    prix_plan = models.BigIntegerField() # Utilisation de BigInteger comme dans votre diagramme

    def __str__(self):
        return f"{self.nom_plan} ({self.prix_plan} {self.id_plan})"

class Abonnement(models.Model):
    date_de_debut = models.DateField(auto_now_add=True)
    date_d_expiration = models.DateField()
    est_active = models.BooleanField(default=True)
    
    # Relations
    plan = models.ForeignKey(Plan, on_delete=models.PROTECT, related_name='abonnements')
    boutique = models.OneToOneField(
        'shops.Boutique', 
        on_delete=models.CASCADE, 
        related_name='abonnement'
    )

    def __str__(self):
        return f"Abonnement {self.boutique.nom_boutique} - {self.plan.nom_plan}"