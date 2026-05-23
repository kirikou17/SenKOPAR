# products/models.py
from django.db import models
from .utils import calculer_benefice, valider_disponibilite_stock, executer_mouvement_stock_initial
from core.choices import TypeMouvement
# --- 1. MODÈLE FOURNISSEUR ---
class Fournisseur(models.Model):
    prenom_fournisseur = models.CharField(max_length=255)
    nom_fournisseur = models.CharField(max_length=255)
    adresse_fournisseur = models.CharField(max_length=255, null=True, blank=True)
    tel_fournisseur = models.CharField(max_length=20, null=True, blank=True)
    date_enregistrement_fournisseur = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.prenom_fournisseur} {self.nom_fournisseur}"


# --- 2. MODÈLE PRODUIT ---
class Produit(models.Model):
    nom_produit = models.CharField(max_length=255)
    stock_quantite = models.IntegerField(default=0)
    prix_d_achat = models.FloatField()
    prix_de_vente = models.FloatField()
    benefice_sur_vente = models.FloatField(editable=False)
    date_stockage = models.DateField(auto_now_add=True)
    alert_stock = models.IntegerField(default=5)
    
    boutique = models.ForeignKey('shops.Boutique', on_delete=models.CASCADE)
    fournisseur = models.ForeignKey(Fournisseur, on_delete=models.SET_NULL, null=True)

    def save(self, *args, **kwargs):
        is_new = self.pk is None
        
        # Centralisation du calcul du bénéfice via l'utilitaire
        self.benefice_sur_vente = calculer_benefice(self.prix_de_vente, self.prix_d_achat)
        
        if is_new:
            initial_stock = self.stock_quantite
            self.stock_quantite = 0  # Sécurité anti-doublon au démarrage
            super().save(*args, **kwargs)  # Sauvegarde initiale du produit à 0
            
            # Génération propre du mouvement d'entrée initial
            executer_mouvement_stock_initial(self, initial_stock)
        else:
            super().save(*args, **kwargs)

    def __str__(self):
        return self.nom_produit


# --- 3. MODÈLE MOUVEMENT DE STOCK ---
class MouvementStock(models.Model):
    
    type_mouvement = models.CharField(max_length=20, choices=TypeMouvement.choices)
    quantite = models.PositiveIntegerField()
    date_mouvement = models.DateTimeField(auto_now_add=True)
    motif = models.CharField(max_length=255, null=True, blank=True)
    produit = models.ForeignKey(Produit, on_delete=models.CASCADE, related_name='mouvements')
    
    nouveau_prix_achat = models.FloatField(null=True, blank=True)
    nouveau_prix_vente = models.FloatField(null=True, blank=True)
    nouveau_benefice_sur_vente = models.FloatField(null=True, blank=True, editable=False)

    def save(self, *args, **kwargs):
        if not self.pk:
            prod = self.produit
            
            # 1. Calcul du bénéfice spécifique au mouvement
            if self.nouveau_prix_achat and self.nouveau_prix_vente:
                self.nouveau_benefice_sur_vente = calculer_benefice(self.nouveau_prix_vente, self.nouveau_prix_achat)

            # 2. Traitement des flux de stock entrants
            if self.type_mouvement in [TypeMouvement.ENTREE, TypeMouvement.RETOUR]:
                if self.type_mouvement == TypeMouvement.ENTREE:
                    if self.nouveau_prix_achat: prod.prix_d_achat = self.nouveau_prix_achat
                    if self.nouveau_prix_vente: prod.prix_de_vente = self.nouveau_prix_vente
                
                prod.stock_quantite += self.quantite
            
            # 3. Traitement des flux de stock sortants (Pertes / Avaries)
            elif self.type_mouvement == TypeMouvement.PERTE:
                # Validation de sécurité déléguée à l'utilitaire
                valider_disponibilite_stock(prod.stock_quantite, self.quantite, prod.nom_produit)
                prod.stock_quantite -= self.quantite
            
            # Sauvegarde et synchronisation automatique du produit lié
            prod.save()

        super().save(*args, **kwargs)