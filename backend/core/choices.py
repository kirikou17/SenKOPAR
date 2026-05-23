from django.db import models

# =====================================================================
# 📦 STOCKS & MOUVEMENTS
# =====================================================================
class TypeMouvement(models.TextChoices):
    ENTREE = 'ENTREE', 'Entrée Stock'
    VENTE = 'VENTE', 'Vente'
    PERTE = 'PERTE', 'Perte/Avarie'
    RETOUR = 'RETOUR', 'Retour Client'


# =====================================================================
# 💰 FINANCES & VENTES
# =====================================================================
class TypeVente(models.TextChoices):
    COMPTANT = 'COMPTANT', 'Vente au comptant'
    DETTE = 'DETTE', 'Vente à crédit'


class StatutPaiement(models.TextChoices):
    PAYE = 'PAYE', 'Payé'
    PARTIEL = 'PARTIEL', 'Partiel'
    EN_ATTENTE = 'ATTENTE', 'En attente'


class ModePaiement(models.TextChoices):
    ESPECE = 'ESPECE', 'Espèces'
    ORANGE_MONEY = 'OM', 'Orange Money'
    WAVE = 'WAVE', 'Wave'
    FREE_MONEY = 'FREE', 'Free Money'


# =====================================================================
# 🌍 GÉOGRAPHIE SÉNÉGAL
# =====================================================================
class Region(models.TextChoices):
    TAMBACOUNDA = 'TAMBA', 'Tambacounda'
    BAKEL = 'BAKEL', 'Bakel'
    DAKAR = 'DAKAR', 'Dakar'
    ZIGUINCHOR = 'ZIG', 'Ziguinchor' 
     # Reclassé ici à sa juste place


# =====================================================================
# 👥 SÉCURITÉ & PERMISSIONS
# =====================================================================
class Role(models.IntegerChoices):
    PROPRIETAIRE = 1, 'Propriétaire'  # Correction de la faute de frappe
    GERANT = 2, 'Gérant'
    CAISSIER = 3, 'Caissier'