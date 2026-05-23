from rest_framework import serializers
from .models import Vente, LigneVente, Versement, Client
from core.choices import ModePaiement

class LigneVenteSerializer(serializers.ModelSerializer):
    class Meta:
        model = LigneVente
        fields = ['id', 'produit', 'designation', 'quantite', 'prix_unitaire', 'total']
        read_only_fields = ['total']

class VersementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Versement
        fields = ['id', 'montant_verse', 'date_de_versement', 'mode_de_paiement']

class VenteSerializer(serializers.ModelSerializer):
    lignes = LigneVenteSerializer(many=True, read_only=True)
    # On ajoute les versements passés en lecture seule pour l'historique du ticket
    versements = VersementSerializer(many=True, read_only=True)
    
    # Champ virtuel temporaire pour intercepter le choix (Wave, OM...) sur Postman
    mode_de_paiement = serializers.ChoiceField(
        choices=ModePaiement.choices, 
        write_only=True, 
        required=False,
        allow_null=True
    )

    class Meta:
        model = Vente
        fields = [
            'id', 'boutique', 'client', 'description_vente', 
            'type_de_vente', 'statut_paiement', 'montant_total', 
            'montant_paye', 'reste_a_payer', 'date_vente', 
            'mode_de_paiement', 'lignes', 'versements'
        ]
        read_only_fields = [
            'montant_total', 'reste_a_payer', 'statut_paiement', 
            'date_vente', 'lignes', 'versements'
        ]

#cree un serializer pour clients

class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = ['id', 'first_name_client', 'last_name_client', 'number_call_client']