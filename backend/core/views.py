from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from core.choices import (
    TypeMouvement, 
    TypeVente, 
    StatutPaiement, 
    ModePaiement, 
    Region, 
    Role
)

class AppChoicesView(APIView):
    """
    Endpoint global pour récupérer toutes les énumérations (choices) de SenKOPAR
    """
    # Optionnel : permets l'accès sans token si tu as besoin des régions/rôles à l'inscription
    permission_classes = [] 

    def get(self, request):
        data = {
            "types_mouvement": [
                {"value": key, "label": value} for key, value in TypeMouvement.choices
            ],
            "types_vente": [
                {"value": key, "label": value} for key, value in TypeVente.choices
            ],
            "statuts_paiement": [
                {"value": key, "label": value} for key, value in StatutPaiement.choices
            ],
            "modes_paiement": [
                {"value": key, "label": value} for key, value in ModePaiement.choices
            ],
            "regions": [
                {"value": key, "label": value} for key, value in Region.choices
            ],
            # Pour le rôle, les clés sont des entiers (1, 2, 3), ce code fonctionne de la même manière
            "roles": [
                {"value": key, "label": value} for key, value in Role.choices
            ],
        }
        return Response(data, status=status.HTTP_200_OK)