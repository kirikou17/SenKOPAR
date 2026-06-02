import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import shopsService from './shopsService'; // Ajuste le chemin si nécessaire


export const chargerStatistiquesBoutique = createAsyncThunk(
  'shops/chargerStatistiquesBoutique',
  // Argument 1 : Un objet contenant tes filtres (avec des valeurs par défaut si vide)
  // Argument 2 : thunkAPI déstructuré pour récupérer getState et rejectWithValue
  async ({ annee = null, mois = null } = {}, { getState, rejectWithValue }) => {
    try {
      const etatGlobal = getState();
      const boutiqueActive = etatGlobal.shops?.boutiqueSelectionnee;

      if (!boutiqueActive) {
        return rejectWithValue("Aucune boutique sélectionnée pour charger les statistiques.");
      }

      // Appel de ton service avec l'ID et les filtres
      return await shopsService.statisticsShop(boutiqueActive.id, annee, mois);
      
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.detail) ||
        error.message ||
        error.toString();
      return rejectWithValue(message);
    }
  }
);


const initialState = {
  statistiques: null, // Pour stocker les statistiques de la boutique active
  boutiqueSelectionnee: null, // Utile pour stocker la boutique active dans SenKOPAR
  statutChargement: false,
  erreurShops: null,
};

const statisticsSlice = createSlice({
    name: 'statistics',
    initialState,
    reducers: {
        //
    },
    extraReducers: (builder) => {
        builder
        .addCase(chargerStatistiquesBoutique.pending, (state) => {
            state.statutChargement = true;
            state.erreurShops = null;
        })
        .addCase(chargerStatistiquesBoutique.fulfilled, (state, action) => {
            state.statutChargement = false;
            state.statistiques = action.payload;
        })
        .addCase(chargerStatistiquesBoutique.rejected, (state, action) => {
                state.statutChargement = false;
                state.erreurShops = action.payload;
        })
    }

});

export default statisticsSlice.reducer;

                
