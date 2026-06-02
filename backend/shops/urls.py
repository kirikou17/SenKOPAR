from django.urls import path
from .views import BoutiquesUtilisateurViewSet, StatistiqueAPIView

urlpatterns = [
    path('boutiques/', BoutiquesUtilisateurViewSet.as_view({'get': 'list'}), name='boutiques-utilisateur'),
    path('statistiques/', StatistiqueAPIView.as_view(), name='statistiques-boutique')
]
