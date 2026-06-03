from django.db import models
from core.choices import TypeVente, StatutPaiement, ModePaiement

# --- 1. MODÈLE CLIENT ---
class Client(models.Model):
    first_name_client = models.CharField(max_length=255)
    last_name_client = models.CharField(max_length=255)
    number_call_client = models.BigIntegerField()
    date_compte = models.DateField(auto_now_add=True)
    boutique = models.ForeignKey('shops.Boutique', on_delete=models.CASCADE, null=True)

    def __str__(self):
        return f"{self.first_name_client} {self.last_name_client}"


# --- 2. MODÈLE VENTE ---
class Vente(models.Model):
    description_vente = models.CharField(max_length=255, null=True, blank=True)
    montant_total = models.FloatField(default=0.0)
    montant_paye = models.FloatField(default=0.0)
    reste_a_payer = models.FloatField(default=0.0)
    type_de_vente = models.CharField(max_length=20, choices=TypeVente.choices)
    statut_paiement = models.CharField(max_length=20, choices=StatutPaiement.choices)
    date_vente = models.DateTimeField(auto_now_add=True)
    
    client = models.ForeignKey(Client, on_delete=models.SET_NULL, null=True, blank=True)
    boutique = models.ForeignKey('shops.Boutique', on_delete=models.CASCADE)

    def __str__(self):
        return f"Vente #{self.id} - {self.boutique.nom_boutique}"


# --- 3. LE MODÈLE MANQUANT : LIGNE DE VENTE ---
class LigneVente(models.Model):
    vente = models.ForeignKey(Vente, on_delete=models.CASCADE, related_name='lignes')
    
    # Relation vers Produit (peut être nulle si le produit est hors stock/saisie libre)
    produit = models.ForeignKey('products.Produit', on_delete=models.SET_NULL, null=True, blank=True)
    
    # Correspond au champ 'designation' du schéma pour le hors-stock
    designation = models.CharField(
        max_length=255, 
        null=True, 
        blank=True, 
        help_text="Nom de l'article si absent du catalogue de stock"
    )
    
    quantite = models.PositiveIntegerField(default=1)
    prix_unitaire = models.FloatField()
    total = models.FloatField() # Quantité * Prix unitaire

    def __str__(self):
        nom = self.produit.nom_produit if self.produit else self.designation
        return f"{nom} (x{self.quantite})"


# --- 4. MODÈLE VERSEMENT ---
class Versement(models.Model):

    montant_verse = models.FloatField()
    date_de_versement = models.DateTimeField(auto_now_add=True)
    mode_de_paiement = models.CharField(max_length=20, choices=ModePaiement.choices)
    vente = models.ForeignKey(Vente, on_delete=models.CASCADE, related_name='versements')