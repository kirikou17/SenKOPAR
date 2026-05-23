from django.urls import path
from .views import CreerVenteView,ClientViewSet

urlpatterns = [
    path('creer-vente/', CreerVenteView.as_view(), name='creer-vente'),
    path('clients/', ClientViewSet.as_view({'get': 'list', 'post': 'create'}), name='clients'),
]