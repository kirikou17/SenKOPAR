import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import shopsService from './shopsService'; // Ajuste le chemin si nécessaire

// 🚀 Action asynchrone (Thunk) pour charger les boutiques de l'utilisateur
export const chargerBoutiquesUtilisateur = createAsyncThunk(
  'shops/chargerBoutiques',
  async (_, thunkAPI) => {
    try {
      return await shopsService.getShops();
    } catch (error) {
      // Récupère le message d'erreur du backend Django s'il existe
      const message =
        (error.response && error.response.data && error.response.data.detail) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const initialState = {
  boutiques: [],
  boutiqueSelectionnee: null, // Utile pour stocker la boutique active dans SenKOPAR
  statutChargement: false,
  erreurShops: null,
};

const shopsSlice = createSlice({
  name: 'shops',
  initialState,
  reducers: {
    // Action pour changer manuellement la boutique active dans l'application
    selectionnerBoutique: (state, action) => {
      state.boutiqueSelectionnee = action.payload;
    },
    // Réinitialiser le statut lors de la déconnexion
    reinitialiserShopsState: (state) => {
      state.boutiques = [];
      state.boutiqueSelectionnee = null;
      state.erreurShops = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // --- CAS : CHARGEMENT EN COURS ---
      .addCase(chargerBoutiquesUtilisateur.pending, (state) => {
        state.statutChargement = true;
        state.erreurShops = null;
      })
      // --- CAS : CHARGEMENT RÉUSSI ---
      .addCase(chargerBoutiquesUtilisateur.fulfilled, (state, action) => {
        state.statutChargement = false;
        state.boutiques = action.payload;
        if (action.payload.length > 0 && !state.boutiqueSelectionnee) {
          state.boutiqueSelectionnee = action.payload[0];
        }
      })
      // --- CAS : ÉCHEC DU CHARGEMENT ---
      .addCase(chargerBoutiquesUtilisateur.rejected, (state, action) => {
        state.statutChargement = false;
        state.erreurShops = action.payload;
      })
      
      // 🚪 NOUVEAU : Réinitialisation automatique sur déconnexion de l'utilisateur
      .addCase('auth/logout', (state) => {
        state.boutiques = [];
        state.boutiqueSelectionnee = null;
        state.erreurShops = null;
      });
  },
});

export const { selectionnerBoutique, reinitialiserShopsState } = shopsSlice.actions;
export default shopsSlice.reducer;