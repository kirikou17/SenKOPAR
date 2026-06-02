import { combineReducers } from '@reduxjs/toolkit';
import salesReducer from '../features/sales/salesSlices';
import coreReducer from '../features/core/coreSlice';
import authReducer from '../features/auth/authSlice';
import stocksReducer from '../features/stocks/stocksSlice';
import shopsReducer from '../features/shops/shopsSlice';
import clientsReducer from '../features/sales/clientsSlice';
import fournisseurReducer from '../features/stocks/fournisseurSlice';
import statisticsReducer from '../features/shops/satisticsSlice'; // Assure-toi que le chemin est correct

// 1. Importation de tous tes reducers de features

// Importations pour tes futurs modules (exemples) :

// import salesReducer from '../features/sales/salesSlice';
// import stocksReducer from '../features/stocks/stocksSlice';


// 2. Combinaison de tous les reducers en un seul objet d'état global
const rootReducer = combineReducers({
  core: coreReducer,       // État accessible via state.core
  auth: authReducer,       // État accessible via state.auth
  sales: salesReducer,  // État accessible via state.sales (futur)
  stocks: stocksReducer, // État accessible via state.stocks (futur)
  shops: shopsReducer, // État accessible via state.shops (futur)
  clients: clientsReducer, // État accessible via state.clients (futur)
  fournisseurs: fournisseurReducer, // État accessible via state.fournisseurs (futur)
  statistics: statisticsReducer, // État accessible via state.statistics (futur)
  
});

export default rootReducer;