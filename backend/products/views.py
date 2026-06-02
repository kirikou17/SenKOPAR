from django.db.models import Q
from rest_framework import viewsets, permissions
from .models import Produit, Fournisseur, MouvementStock
from .serializers import (  ProduitSerializer, 
                            FournisseurSerializer, 
                            MouvementStockSerializer,
                            ProduitBoutiqueSerializer,
                          )

class ProduitViewSet(viewsets.ModelViewSet):
    queryset = Produit.objects.all()
    serializer_class = ProduitSerializer

    def get_queryset(self):
        # On récupère le queryset de base de manière sécurisée
        queryset = self.queryset
        
        # Récupération du paramètre 'boutique' dans l'URL (?boutique=ID)
        boutique_id = self.request.query_params.get('boutique')
        
        if boutique_id:
            # Filtrage par l'ID de la boutique
            queryset = queryset.filter(boutique_id=boutique_id)
            
        return queryset


class ProduitBoutiqueViewSet(viewsets.ModelViewSet):
    serializer_class = ProduitBoutiqueSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
            utilisateur = self.request.user
        
            # 1. On ne récupère que les produits des boutiques appartenant à l'utilisateur connecté
            queryset = Produit.objects.filter(boutique__proprietaire=utilisateur)
        
            # 2. On exclut les produits en rupture (quantité <= 0) ou sans quantité (Null)
            queryset = queryset.exclude(Q(stock_quantite__lte=0) | Q(stock_quantite__isnull=True))
        
            # 3. Filtrage optionnel par boutique spécifique via les paramètres de requête (?boutique_id=X)
            boutique_id = self.request.query_params.get('boutique_id')
            if boutique_id:
                queryset = queryset.filter(boutique_id=boutique_id)
            
            # 🚀 CORRECTION : On retourne le queryset final filtré, et non le queryset de départ !
            return queryset
        
        


    def perform_create(self, serializer):
        """
        Optionnel : Lors de la création d'un produit, on peut injecter automatiquement
        des données ou valider que l'utilisateur a le droit de créer dans cette boutique.
        """
        serializer.save()

class FournisseurViewSet(viewsets.ModelViewSet):
    queryset = Fournisseur.objects.all()
    serializer_class = FournisseurSerializer

    def get_queryset(self):
        boutique_id = self.request.query_params.get('boutique')
        if boutique_id:
            return self.queryset.filter(boutique_id=boutique_id)
        return self.queryset


class MouvementStockViewSet(viewsets.ModelViewSet):
    queryset = MouvementStock.objects.all().order_by('-date_mouvement')
    serializer_class = MouvementStockSerializer