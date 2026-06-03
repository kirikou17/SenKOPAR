import axios from 'axios';

// Détermination automatique de l'URL de base
const getBaseURL = () => {
  // Si vous développez sur votre PC (localhost)
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:8000/api/'; 
  }
  // En production (sur le VPS), on utilise une URL relative.
  // Le navigateur cherchera automatiquement sur http://134.209.113
  return '/api/';
};

const apiClient = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000, 
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Intercepteur pour le Token JWT (Parfait, rien à changer ici)
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('senkopar_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;

