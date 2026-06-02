from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import BoutiqueOptionSerializer
from .services import get_boutiques_utilisateur
from .services import *


# Create your views here.
class BoutiquesUtilisateurViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = BoutiqueOptionSerializer # 👈 Utilise le ModelSerializer ici
    # permission_classes = [permissions.IsAuthenticated] # 🔒 Bloque les utilisateurs anonymes

    def get_queryset(self):
        utilisateur = self.request.user
        return get_boutiques_utilisateur(utilisateur)
    




class StatistiqueAPIView(APIView):

    def get(self, request, format=None):

        # permission_classes = [permissions.IsAuthenticated] # 🔒 Bloque les utilisateurs anonymes
        # Récupérer les statistiques globales pour l'utilisateur connecté
        boutique=self.request.query_params.get('boutique')
        annee=self.request.query_params.get('annee')
        mois=self.request.query_params.get('mois')

        chiffre_affaires = get_chiffre_affaires_boutique(boutique, annee, mois)
        stock_total = get_stock_total_boutique(boutique)
        # benefice_total = get_benefice_total_boutique(boutique, annee, mois)
        produits_rupture_stock = get_produits_en_rupture_stock(boutique)
        produits_plus_vendus = get_produits_plus_vendus(boutique)
        dette_totale = get_dette_totale_boutique(boutique)
        dette_partielle = get_dette_partielle_boutique(boutique)
        data = {
            'chiffre_affaires': chiffre_affaires,
            'stock_total': stock_total,
            # 'benefice_total': benefice_total,
            'produits_rupture_stock': [produit.nom_produit for produit in produits_rupture_stock],
            'produits_plus_vendus': [produit.nom_produit for produit in produits_plus_vendus],
            'dette_totale': dette_totale,
            'dette_partielle': dette_partielle
        }

        return Response(data, status=status.HTTP_200_OK)
        
    
