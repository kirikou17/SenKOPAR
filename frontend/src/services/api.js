import axios from 'axios';

// 1. Définition de l'URL de base de ton backend Django
// const BASE_URL = 'http://127.0.0.1:8000/api/';
//recuperer ip local de l'ordinateur en javascript
const getLocalIP = () => {
  // Implémentation pour récupérer l'IP carte wifi (exemple simplifié)
  if(window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return '127.0.0.1';
  }
  return window.location.hostname;
};

const BASE_URL = `http://localhost:8000/api/`;

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // Coupe la requête après 10 secondes d'inactivité
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// 2. Intercepteur pour injecter automatiquement le Token JWT (pour plus tard)
apiClient.interceptors.request.use(
  (config) => {
    // Si tu stockes ton token dans le localStorage après connexion
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