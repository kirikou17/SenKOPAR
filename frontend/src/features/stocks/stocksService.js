import apiClient from "../../services/api";

/**
 * Service pour la gestion du catalogue de produits et des niveaux de stock
 */
const stockService = {
  
  // 📦 1. Récupérer tous les produits en stock (Global)
 obtenirProduits: async (boutiqueId) => {
  try {
    // 1. Gestion propre du cas "tous les produits" (on n'envoie pas le paramètre si boutiqueId vaut 0 ou n'est pas défini)
    let url = '/products/liste-produits/';
    if (boutiqueId && boutiqueId !== 0) {
      // 🚀 CORRECTION : Utilise 'boutique' ou 'boutique_id' selon ce que tu as mis dans ton get_queryset Django
      url += `?boutique=${boutiqueId}`; 
    }

    const reponse = await apiClient.get(url);
    
    console.log("Données reçues de Django :", reponse.data);
    
    // 2. CORRECTION : Toujours retourner reponse.data (Axios encapsule toujours la réponse dedans)
    return reponse.data; 

  } catch (erreur) {
    // On logue la vraie erreur en console pour le développement
    console.error("Erreur technique lors de la récupération des produits :", erreur);
    
    // On lève une erreur explicite pour le thunk Redux
    throw new Error(erreur.response?.data?.detail || "Impossible de charger les produits en stock.");
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
,
  creerFournisseur: async (donneesFournisseur) => {
  try {
    const reponse = await apiClient.post('/products/fournisseurs/', donneesFournisseur);
    return reponse.data ? reponse.data : reponse;
  } catch (erreur) {
    throw new Error(erreur.response?.data?.detail || "Échec de la création du fournisseur.");
  }
}
,
chargerFournisseurs: async (boutiqueId) => {
  try {
    const reponse = await apiClient.get(`/products/fournisseurs/?boutique=${boutiqueId}`);
    console.log("Données des fournisseurs reçues de Django :", reponse.data);
    
    // Si reponse.data existe (Axios standard), on le renvoie.
    // Si c'est undefined parce qu'un intercepteur l'a déjà extrait, on renvoie reponse.
    return reponse.data !== undefined ? reponse.data : reponse;

  } catch (erreur) {
    // Permet de voir la vraie erreur de Django dans la console en phase de dev
    console.error("Erreur API fournisseurs:", erreur);
    throw new Error("Impossible de charger les fournisseurs.");
  }
}

// chargerFournisseurs: async () => {
//   try {
//     const reponse = await apiClient.get(`/products/fournisseurs/`);
//     console.log("Données des fournisseurs reçues de Django :", reponse.data);
    
//     // Si reponse.data existe (Axios standard), on le renvoie.
//     // Si c'est undefined parce qu'un intercepteur l'a déjà extrait, on renvoie reponse.
//     return reponse.data !== undefined ? reponse.data : reponse;

//   } catch (erreur) {
//     // Permet de voir la vraie erreur de Django dans la console en phase de dev
//     console.error("Erreur API fournisseurs:", erreur);
//     throw new Error("Impossible de charger les fournisseurs.");
//   }
// }

};




export default stockService;