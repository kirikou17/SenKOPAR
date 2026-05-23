import apiClient from "../../services/api";

const coreService = {
  getGlobalChoices: async () => {
    const response = await apiClient.get('core/choices/');
    return response.data; // Axios encapsule la réponse JSON dans la clé .data
  },
};

export default coreService;