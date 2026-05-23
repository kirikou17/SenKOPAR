# core/tests.py
"""
Tests pour les mini-APIs de choix
"""
from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status

class ChoicesAPITests(APITestCase):
    """Tests des APIs de choix"""
    
    def test_regions_endpoint(self):
        """Test que l'endpoint régions retourne les bonnes données"""
        response = self.client.get('/api/choices/regions/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('count', response.data)
        self.assertIn('results', response.data)
        self.assertGreater(response.data['count'], 0)
    
    def test_devises_endpoint(self):
        """Test que l'endpoint devises retourne les bonnes données"""
        response = self.client.get('/api/choices/devises/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('count', response.data)
        self.assertIn('results', response.data)
        self.assertGreater(response.data['count'], 0)
    
    def test_roles_endpoint(self):
        """Test que l'endpoint rôles retourne les bonnes données"""
        response = self.client.get('/api/choices/roles/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('count', response.data)
        self.assertIn('results', response.data)
        self.assertEqual(response.data['count'], 3)  # 3 rôles
    
    def test_types_vente_endpoint(self):
        """Test que l'endpoint types de vente retourne les bonnes données"""
        response = self.client.get('/api/choices/types-vente/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('count', response.data)
        self.assertIn('results', response.data)
        self.assertEqual(response.data['count'], 2)  # 2 types
    
    def test_statuts_paiement_endpoint(self):
        """Test que l'endpoint statuts de paiement retourne les bonnes données"""
        response = self.client.get('/api/choices/statuts-paiement/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('count', response.data)
        self.assertIn('results', response.data)
        self.assertEqual(response.data['count'], 3)  # 3 statuts
    
    def test_modes_paiement_endpoint(self):
        """Test que l'endpoint modes de paiement retourne les bonnes données"""
        response = self.client.get('/api/choices/modes-paiement/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('count', response.data)
        self.assertIn('results', response.data)
        self.assertEqual(response.data['count'], 4)  # 4 modes
    
    def test_types_mouvement_endpoint(self):
        """Test que l'endpoint types de mouvement retourne les bonnes données"""
        response = self.client.get('/api/choices/types-mouvement/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('count', response.data)
        self.assertIn('results', response.data)
        self.assertEqual(response.data['count'], 4)  # 4 types
    
    def test_all_choices_endpoint(self):
        """Test que l'endpoint all_choices retourne tous les choix"""
        response = self.client.get('/api/choices/all/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Vérifier que toutes les clés sont présentes
        expected_keys = [
            'regions', 'devises', 'roles', 'types_vente',
            'statuts_paiement', 'modes_paiement', 'types_mouvement'
        ]
        for key in expected_keys:
            self.assertIn(key, response.data)
    
    def test_choices_format(self):
        """Test que le format des choix est correct (value, label)"""
        response = self.client.get('/api/choices/regions/')
        results = response.data['results']
        
        for choice in results:
            self.assertIn('value', choice)
            self.assertIn('label', choice)

# Exécuter les tests : python manage.py test core.tests.ChoicesAPITests
