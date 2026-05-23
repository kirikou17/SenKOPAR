import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer'; // Importation du reducer combiné

export const store = configureStore({
  reducer: rootReducer, // On passe directement l'objet combiné ici
  
  // Optionnel : Gestion des middlewares si nécessaire à l'avenir
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false, // Utile parfois pour éviter les alertes sur certaines requêtes API
  }),
});