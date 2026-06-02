import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import salesService from './salesService';

export const chargerClientsBoutique = createAsyncThunk(
  'sales/chargerClientsBoutique',
  async (_, thunkAPI) => {
    try {
      const etatGlobal = thunkAPI.getState();
      const boutiqueId = etatGlobal.shops.boutiqueSelectionnee?.id;

      if (!boutiqueId) {
        return thunkAPI.rejectWithValue("Aucune boutique sélectionnée.");
      }
      console.log("Appel API pour charger les clients de la boutique ID:", boutiqueId);
      const clients = await salesService.ObtenirClientFiltrer(boutiqueId);
      console.log("Clients chargés avec succès:", clients);
      return clients;
    } catch (erreur) {
      return thunkAPI.rejectWithValue(erreur.message);
    }
  }
);


export const ajouterClient = createAsyncThunk(
  'sales/ajouterClient',
  async (donneesClient, { rejectWithValue }) => {
    try {
      const clientCree = await salesService.AjouterClient(donneesClient);
      return clientCree;
    } catch (erreur) {
      return rejectWithValue(erreur.message);
    }
  }
);


const initialState = {
  clients: [],
  statutChargement: false, // 💡 Rappel : Tu l'as nommé statutChargement ici, assure-toi d'utiliser ce nom dans ton useSelector
  erreurClient: null,
  operationReussie: false
};

const clientsSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    // 🧼 Optionnel mais utile : Permet de nettoyer les erreurs ou statuts de succès si nécessaire
    nettoyerStatutClients: (state) => {
      state.erreurClient = null;
      state.operationReussie = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(chargerClientsBoutique.pending, (state) => {
        state.statutChargement = true;
        state.erreurClient = null;
      })
      .addCase(chargerClientsBoutique.fulfilled, (state, action) => {
        state.statutChargement = false;
        // Si l'API renvoie bien un tableau, action.payload remplira correctement le store
        state.clients = action.payload || []; 
      })
      .addCase(chargerClientsBoutique.rejected, (state, action) => {
        state.statutChargement = false;
        state.erreurClient = action.payload;
      })
      .addCase(ajouterClient.fulfilled, (state, action) => {
        state.clients.push(action.payload);
        state.operationReussie = true;
      })
      .addCase(ajouterClient.rejected, (state, action) => {
        state.erreurClient = action.payload;
      });
  }
});

export const { nettoyerStatutClients } = clientsSlice.actions;
export default clientsSlice.reducer;