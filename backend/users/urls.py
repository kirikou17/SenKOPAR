from django.urls import path
from .views import InscriptionCompleteView,CustomTokenObtainPairView,BoutiquesUtilisateurViewSet

urlpatterns = [
    path('register/', InscriptionCompleteView.as_view(), name='register-complet'),
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('boutiques/', BoutiquesUtilisateurViewSet.as_view({'get': 'list'}), name='boutiques-utilisateur'),
]