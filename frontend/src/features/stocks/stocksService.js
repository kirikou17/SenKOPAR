import apiClient from "../../services/api";

/**
 * Service pour la gestion du catalogue de produits et des niveaux de stock
 */
const stockService = {
  
  // 📦 1. Récupérer tous les produits en stock (Global)
  obtenirProduits: async () => {
    try {
      const reponse = await apiClient.get('/products/liste-produits/');
      console.log("Données reçues de Django :", reponse.data);
      return reponse.data ? reponse.data : reponse;
    } catch (erreur) {
      throw new Error("Impossible de charger les produits en stock.");
    }
  },

  // 🔍 2. Récupérer les produits filtrés par l'ID d'une boutique
  obtenirProduitsFiltres: async (boutiqueId) => {
  try {
    if (!boutiqueId) return []; // Évite une requête inutile si l'ID n'est pas encore défini
    
    // 💡 Note le '/' juste avant le '?' ici :
    const reponse = await apiClient.get(`/products/produits-boutique/?boutique_id=${Number(boutiqueId)}`);
    
    console.log("Données filtrées reçues de Django :", reponse.data);
    return reponse.data ? reponse.data : reponse;
  } catch (erreur) {
    throw new Error("Impossible de charger les produits de cette boutique.");
  }
},

  // ➕ 3. Créer un nouveau produit (Sucre, Riz, etc.)
  creerProduit: async (donneesProduit) => {
    try {
      const reponse = await apiClient.post('/products/liste-produits/', donneesProduit);      
      return reponse.data ? reponse.data : reponse;
    } catch (erreur) {
      throw new Error(erreur.response?.data?.detail || "Échec de la création du produit.");
    }
  },

  // ✏️ 4. Mettre à jour un produit existant (Ajuster la quantité ou le prix)
  modifierProduit: async (idProduit, nouvellesDonnees) => {
    try {
      const reponse = await apiClient.put(`/products/liste-produits/${idProduit}/`, nouvellesDonnees);
      return reponse.data ? reponse.data : reponse;
    } catch (erreur) {
      throw new Error("Erreur lors de la modification du produit.");
    }
  },

  // 🗑️ 5. Supprimer un article du catalogue
  supprimerProduit: async (idProduit) => {
    try {
      await apiClient.delete(`/products/liste-produits/${idProduit}/`);
      return idProduit;
    } catch (erreur) {
      throw new Error("Impossible de supprimer ce produit.");
    }
  }
};

export default stockService;