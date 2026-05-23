import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import salesService from './salesService';

/**
 * 🛒 Thunk Asynchrone : Envoyer la vente à l'API Django
 */
export const enregistrerNouvelleVente = createAsyncThunk(
  'sales/enregistrerNouvelleVente',
  async (donneesVente, { rejectWithValue }) => {
    try {
      const reponse = await salesService.creerVente(donneesVente);
      return reponse; // Transmet les données de la vente créée au reducer .fulfilled
    } catch (erreur) {
      // Capture le message formaté par le service
      return rejectWithValue(erreur.message);
    }
  }
);

/**
 * 📋 Thunk Asynchrone : Charger l'historique des ventes
 */
// export const chargerHistoriqueVentes = createAsyncThunk(
//   'sales/chargerHistoriqueVentes',
//   async (_, { rejectWithValue }) => {
//     try {
//       const reponse = await salesService.obtenirVentes();
//       return reponse;
//     } catch (erreur) {
//       return rejectWithValue(erreur.message);
//     }
//   }
// );

// État initial de la gestion des ventes
const initialState = {
  ventes: [],               // Historique des ventes de la boutique
  derniereVenteRecue: null, // Stocke la dernière vente réussie (utile pour imprimer un ticket)
  statutChargement: false,  // Équivalent de 'loading'
  erreurVente: null,        // Stocke les messages d'erreur de l'API
  venteReussie: false,      // Devient true brièvement pour déclencher une alerte de succès
};

const salesSlice = createSlice({
  name: 'sales',
  initialState,
  reducers: {
    // 🧼 Réinitialiser les indicateurs de succès et d'erreur (changement de page ou nouvelle vente)
    nettoyerStatutVente: (state) => {
      state.erreurVente = null;
      state.venteReussie = false;
    },
    // 🗑️ Vider l'historique local lors du logout
    reinitialiserVentes: () => initialState
  },
  extraReducers: (builder) => {
    builder
      /* ================= CASES: ENREGISTRER VENTE ================= */
      .addCase(enregistrerNouvelleVente.pending, (state) => {
        state.statutChargement = true;
        state.erreurVente = null;
        state.venteReussie = false;
      })
      .addCase(enregistrerNouvelleVente.fulfilled, (state, action) => {
        state.statutChargement = false;
        state.venteReussie = true;
        state.derniereVenteRecue = action.payload;
        // Ajoute la nouvelle vente en haut de l'historique local
        state.ventes.unshift(action.payload); 
        state.erreurVente = null;
      })
      .addCase(enregistrerNouvelleVente.rejected, (state, action) => {
        state.statutChargement = false;
        state.erreurVente = action.payload;
        state.venteReussie = false;
      })

      /* ================= CASES: CHARGER HISTORIQUE ================= */
    //   .addCase(chargerHistoriqueVentes.pending, (state) => {
    //     state.statutChargement = true;
    //     state.erreurVente = null;
    //   })
    //   .addCase(chargerHistoriqueVentes.fulfilled, (state, action) => {
    //     state.statutChargement = false;
    //     state.ventes = action.payload;
    //     state.erreurVente = null;
    //   })
    //   .addCase(chargerHistoriqueVentes.rejected, (state, action) => {
    //     state.statutChargement = false;
    //     state.erreurVente = action.payload;
    //   });
  },
});

// Export des actions synchrones
export const { nettoyerStatutVente, reinitialiserVentes } = salesSlice.actions;

// Export du reducer pour le store Redux
export default salesSlice.reducer;