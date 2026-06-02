import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import stockService from './stocksService';

export const chargerFournisseurs = createAsyncThunk(
  'stock/chargerFournisseurs',
  async (_, { rejectWithValue, getState }) => {
    try {
      const etatGlobal = getState();
      const boutiqueId = etatGlobal.shops?.boutiqueSelectionnee?.id; 

      if (!boutiqueId) {
        console.warn("⚠️ Tentative de chargement des fournisseurs sans boutique active.");
        return rejectWithValue("Aucune boutique sélectionnée.");
      }

      const fournisseurs = await stockService.chargerFournisseurs(boutiqueId);
      return fournisseurs;
    } catch (erreur) {
      console.error("Erreur dans le thunk chargerFournisseurs:", erreur);
      return rejectWithValue(erreur.message || "Une erreur est survenue.");
    }
  }
);

export const ajouterFournisseur = createAsyncThunk(
  'stock/ajouterFournisseur',
  async (donneesFournisseur, { rejectWithValue }) => { 
    try {
        return await stockService.creerFournisseur(donneesFournisseur);
    } catch (erreur) {
        return rejectWithValue(erreur.message);
    }
  }
);

const fournisseurSlice = createSlice({
  name: 'fournisseurs',
  initialState: { 
    fournisseursdata: [], // 👈 Ton tableau s'appelle bien comme ça
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(chargerFournisseurs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(chargerFournisseurs.fulfilled, (state, action) => {
        state.loading = false;
        state.fournisseursdata = action.payload;
      })
      .addCase(chargerFournisseurs.rejected, (state, action) => {
        state.loading = false;  
        state.error = action.payload;
      })
      .addCase(ajouterFournisseur.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(ajouterFournisseur.fulfilled, (state, action) => {
        state.loading = false;
        // 🚀 CORRECTION : Utilisation de 'fournisseursdata' au lieu de 'fournisseurs'
        state.fournisseursdata.push(action.payload); 
      })
      .addCase(ajouterFournisseur.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default fournisseurSlice.reducer;