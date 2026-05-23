import apiClient from "../../services/api";

const shopsService = {
  getShops: async () => {
    const response = await apiClient.get('shops/boutiques/');
    return response.data; 
  },
};
export default shopsService;