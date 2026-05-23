from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (ProduitViewSet, FournisseurViewSet, 
                    MouvementStockViewSet, ProduitBoutiqueViewSet)

router = DefaultRouter()
router.register(r'liste-produits', ProduitViewSet)
router.register(r'fournisseurs', FournisseurViewSet)
router.register(r'mouvements', MouvementStockViewSet)
router.register(r'produits-boutique', ProduitBoutiqueViewSet, basename='produits-boutique')

urlpatterns = [
    path('', include(router.urls)),
]