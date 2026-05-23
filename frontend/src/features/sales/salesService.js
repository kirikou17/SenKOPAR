import apiClient from "../../services/api";

/**
 * Service pour la gestion des ventes et de la facturation sur SenKOPAR
 */
const salesService = {
  
  /**
   * 🛒 Enregistrer une nouvelle vente dans la base de données
   * URL finale appelée : http://<IP_PC>:8000/api/sales/creer-vente/
   * * @param {Object} donneesVente - Les détails de la vente (produits, montants, client, etc.)
   * @returns {Promise<Object>} La réponse du serveur Django
   */
  creerVente: async (donneesVente) => {
    try {
      // On utilise le chemin relatif 'sales/creer-vente/' qui s'ajoute à la BASE_URL de ton apiClient
      const reponse = await apiClient.post('sales/creer-vente/', donneesVente);
      
      // Sécurité pour extraire directement les données de la réponse Axios
      return reponse.data ? reponse.data : reponse;
    } catch (erreur) {
      // Extraction et formatage des messages d'erreur renvoyés par Django
      const donneesErreur = erreur.response?.data;
      const messageErreur = 
        donneesErreur?.detail || 
        donneesErreur?.message || 
        "Impossible d'enregistrer la vente. Veuillez vérifier les stocks ou la connexion.";
      
      throw new Error(messageErreur);
    }
  },

  /**
   * 📋 Optionnel : Récupérer l'historique des ventes de la boutique
   */
//   obtenirVentes: async () => {
//     try {
//       const reponse = await apiClient.get('sales/');
//       return reponse.data ? reponse.data : reponse;
//     } catch (erreur) {
//       throw new Error("Erreur lors de la récupération de l'historique des ventes.");
//     }
//   }
};

export default salesService;