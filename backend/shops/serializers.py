from rest_framework import serializers
from .models import Boutique

class BoutiqueOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Boutique
        fields = ['id', 'nom_boutique', 'devise_monetaire', 'region'] # Mets les champs réels de ton modèle Boutique  