from rest_framework import viewsets
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
        # Optionnel : Filtrer les produits par boutique via l'URL
        boutique_id = self.request.query_params.get('boutique')
        if boutique_id:
            return self.queryset.filter(boutique_id=boutique_id)
        return self.queryset
    
class ProduitBoutiqueViewSet(viewsets.ModelViewSet):
    serializer_class = ProduitBoutiqueSerializer
    # permission_classes = [permissions.IsAuthenticated] # 🔒 Force l'authentification

    def get_queryset(self):
        utilisateur = self.request.user
        queryset = Produit.objects.all()
        boutique_id = self.request.query_params.get('boutique_id')

        if boutique_id:
             queryset = queryset.filter(
                boutique_id=boutique_id
            )
        else:
            queryset = queryset.filter(boutique__proprietaire=utilisateur)

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

class MouvementStockViewSet(viewsets.ModelViewSet):
    queryset = MouvementStock.objects.all().order_by('-date_mouvement')
    serializer_class = MouvementStockSerializer