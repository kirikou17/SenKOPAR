import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import coreService from './coreService';

// Thunk asynchrone pour récupérer les choix depuis l'API Django via le service Axios
export const fetchGlobalChoices = createAsyncThunk(
  'core/fetchGlobalChoices',
  async (_, { rejectWithValue }) => {
    try {
      const data = await coreService.getGlobalChoices();
      return data; // Ce return devient le action.payload dans extraReducers
    } catch (error) {
      // On capture proprement le message d'erreur d'Axios ou du serveur
      const errorMessage = error.response?.data?.message || "Impossible de charger les configurations système.";
      return rejectWithValue(errorMessage);
    }
  }
);

const initialState = {
  regions: [],
  roles: [],
  types_mouvement: [],
  types_vente: [],
  statuts_paiement: [],
  modes_paiement: [],
  loading: false,
  error: null,
};

const coreSlice = createSlice({
  name: 'core',
  initialState,
  reducers: {
    // Tu pourras ajouter des reducers synchrones ici si nécessaire (ex: resetCoreState)
    clearCoreError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // 1. Pendant que la requête est en cours
      .addCase(fetchGlobalChoices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // 2. Quand la requête réussit (C'est ici que le store se remplit !)
      .addCase(fetchGlobalChoices.fulfilled, (state, action) => {
        state.loading = false;
        state.regions = action.payload.regions || [];
        state.roles = action.payload.roles || [];
        state.types_mouvement = action.payload.types_mouvement || [];
        state.types_vente = action.payload.types_vente || [];
        state.statuts_paiement = action.payload.statuts_paiement || [];
        state.modes_paiement = action.payload.modes_paiement || [];
      })
      // 3. Si la requête échoue (ex: serveur Django éteint, mauvaise URL)
      .addCase(fetchGlobalChoices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Une erreur inconnue est survenue.";
      });
  },
});

export const { clearCoreError } = coreSlice.actions;
export default coreSlice.reducer;