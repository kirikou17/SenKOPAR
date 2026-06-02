import apiClient from "../../services/api";

const shopsService = {
  getShops: async () => {
    const response = await apiClient.get('shops/boutiques/');
    return response.data; 
  },

statisticsShop: async (shopId, annee = null, mois = null) => {
  try {
    const response = await apiClient.get('shops/statistiques/', {
      params: {
        boutique: shopId,
        annee: annee || undefined, // Remplace null par undefined pour qu'Axios l'ignore si vide
        mois: mois || undefined     // Idem pour le mois
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
},

}
export default shopsService;

