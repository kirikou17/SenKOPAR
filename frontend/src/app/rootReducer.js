import { combineReducers } from '@reduxjs/toolkit';
import salesReducer from '../features/sales/salesSlices';
import coreReducer from '../features/core/coreSlice';
import authReducer from '../features/auth/authSlice';
import stocksReducer from '../features/stocks/stocksSlice';
import shopsReducer from '../features/shops/shopsSlice';

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
  
});

export default rootReducer;