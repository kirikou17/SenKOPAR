from django.urls import path
from .views import BoutiquesUtilisateurViewSet

urlpatterns = [
    path('boutiques/', BoutiquesUtilisateurViewSet.as_view({'get': 'list'}), name='boutiques-utilisateur'),
]