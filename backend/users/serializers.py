from rest_framework import serializers
from .services import creer_compte_complet
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from shops.models import Boutique

class InscriptionSerializer(serializers.Serializer):
    # Ces champs servent à la VALIDATION (Entrée)
    utilisateur = serializers.JSONField(write_only=True)
    boutique = serializers.JSONField(write_only=True)
    plan_id = serializers.IntegerField(write_only=True)

    # Ces champs servent à la RÉPONSE (Sortie)
    username = serializers.CharField(read_only=True)
    message = serializers.CharField(read_only=True)

    def create(self, validated_data):
        # On appelle le service
        user, boutique = creer_compte_complet(
            data_user=validated_data['utilisateur'],
            data_boutique=validated_data['boutique'],
            plan_id=validated_data['plan_id']
        )
        
        # On ajoute des attributs temporaires à l'objet user 
        # pour que le serializer puisse les lire à la fin
        user.message = "Inscription réussie"
        return user
    





class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        # ✅ CORRECTION : On utilise super() pour appeler le vrai Simple JWT sans boucler
        token = super(CustomTokenObtainPairSerializer, cls).get_token(user)
        
        # Tu peux ajouter des claims personnalisés dans le token ici si besoin :
        # token['username'] = user.username
        
        return token

    def validate(self, attrs):
        # Le reste de ta fonction validate est parfait et ne change pas
        data = super().validate(attrs)
        
        data['token'] = data.pop('access')
        data['user'] = {
            'id': self.user.id,
            'username': self.user.username,
            'prenom': getattr(self.user, 'prenom', ''),
            'nom': getattr(self.user, 'nom', ''),
            'tel_utilisateur': getattr(self.user, 'tel_utilisateur', ''),
            'role': getattr(self.user, 'role', ''),
        }
        
        if 'refresh' in data:
            del data['refresh']
            
        return data
    

#serializer pour afficher les boutiques d'un utilisateur connecte 

class BoutiqueOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Boutique
        fields = ['id', 'nom_boutique', 'devise_monetaire', 'region'] # Mets les champs réels de ton modèle Boutique  