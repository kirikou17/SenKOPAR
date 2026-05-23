from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status,viewsets
from .serializers import InscriptionSerializer # Assure-toi qu'il est créé
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer, BoutiqueOptionSerializer
from .services import get_boutiques_utilisateur


class InscriptionCompleteView(APIView):
    def post(self, request):
        # On passe les données de Postman au Serializer
        serializer = InscriptionSerializer(data=request.data)
        
        if serializer.is_valid():
            # Le serializer appelle le service dans sa méthode create()
            serializer.save()
            return Response({
                "message": "Utilisateur, Boutique et Abonnement créés avec succès !",
                "data": serializer.data
            }, status=status.HTTP_201_CREATED)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class CustomTokenObtainPairView(TokenObtainPairView):
    # On remplace la vue par défaut par notre vue personnalisée
    serializer_class = CustomTokenObtainPairSerializer



#creer moi un viewswt permettant de recuperer les boutiques d'un utilisateur donné (pour le dashboard ou la création de produits)
class BoutiquesUtilisateurViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = BoutiqueOptionSerializer # 👈 Utilise le ModelSerializer ici
    # permission_classes = [permissions.IsAuthenticated] # 🔒 Bloque les utilisateurs anonymes

    def get_queryset(self):
        utilisateur = self.request.user
        return get_boutiques_utilisateur(utilisateur)