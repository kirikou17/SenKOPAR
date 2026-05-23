import apiClient from "../../services/api"; // Importe ton apiClient que tu viens de me montrer

const authService = {
  register: async (userData) => {
    // ✅ On ajoute ".data" pour ne donner à Redux que le JSON pur renvoyé par Django
    const response = await apiClient.post('users/register/', userData);
    return response.data; 
  },

  login: async (credentials) => {
    console.log("📡 Envoi des identifiants via apiClient...");
    // ✅ On ajoute ".data" ici aussi !
    const response = await apiClient.post('users/login/', credentials);
    console.log("📥 Réponse brute reçue de Django :", response.data);
    return response.data; 
  },

 
};

export default authService;