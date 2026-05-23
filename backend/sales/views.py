# sales/views.py
from rest_framework.views import APIView
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from django.core.exceptions import ValidationError
from .services import VenteService
from .serializers import VenteSerializer, ClientSerializer
from .models import Client

class CreerVenteView(APIView):
    
    def post(self, request):
        data = request.data
        
        try:
            # 1. Sécurité : Vérification que le type de vente est bien fourni
            type_de_vente_recu = data.get('type_de_vente')
            if not type_de_vente_recu:
                return Response(
                    {"error": "Le champ 'type_de_vente' (COMPTANT ou DETTE) est obligatoire."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            # 2. Appel du service transactionnel sécurisé
            vente = VenteService.creer_vente_avec_lignes(
                boutique_id=data.get('boutique'),
                type_de_vente=type_de_vente_recu,
                montant_paye=data.get('montant_paye', 0),
                mode_de_paiement=data.get('mode_de_paiement'),
                lignes_data=data.get('lignes', []),
                client_id=data.get('client'),
                description_vente=data.get('description_vente')
            )
            
            # 3. Correction du cache : On force le rechargement pour capter le Versement créé
            vente.refresh_from_db()
            
            # 4. Sérialisation et réponse propre
            serializer = VenteSerializer(vente)
            return Response({
                "message": "Vente enregistrée avec succès !",
                "donnees": serializer.data
            }, status=status.HTTP_201_CREATED)
            
        except ValidationError as e:
            # Capture des erreurs métiers contrôlées (ex: Stock insuffisant, multi-boutique)
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            # Sécurité en cas de crash système inattendu
            return Response(
                {"error": f"Une erreur interne est survenue : {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
class ClientViewSet(viewsets.ModelViewSet):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer