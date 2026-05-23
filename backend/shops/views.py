from django.shortcuts import render
from rest_framework import viewsets, permissions
from .serializers import BoutiqueOptionSerializer
from .services import get_boutiques_utilisateur

# Create your views here.
class BoutiquesUtilisateurViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = BoutiqueOptionSerializer # 👈 Utilise le ModelSerializer ici
    # permission_classes = [permissions.IsAuthenticated] # 🔒 Bloque les utilisateurs anonymes

    def get_queryset(self):
        utilisateur = self.request.user
        return get_boutiques_utilisateur(utilisateur)