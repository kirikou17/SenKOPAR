import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import stockService from './stocksService'; // Ton service propre, sans useSelector

// ==========================================
// ---        THUNKS ASYNCHRONES          ---
// ==========================================

// 🚀 Charger les produits filtrés pour la boutique active
export const chargerProduitsBoutique = createAsyncThunk(
  'stock/chargerProduitsBoutique',
  async (_, thunkAPI) => {
    try { 
      // 💡 Extraction de la boutique sélectionnée directement depuis le slice "shops"
      const etatGlobal = thunkAPI.getState();
      const boutiqueId = etatGlobal.shops.boutiqueSelectionnee?.id;

      if (!boutiqueId) {
        return thunkAPI.rejectWithValue("Aucune boutique sélectionnée.");
      }

      // 📡 Passage de l'ID au service
      return await stockService.obtenirProduitsFiltres(boutiqueId); 
    }
    catch (erreur) { 
      return thunkAPI.rejectWithValue(erreur.message); 
    }
  }
);

// 📦 Charger tous les produits du catalogue (Global)
export const chargerTousLesProduits = createAsyncThunk(
  'stock/chargerTousLesProduits',
   async (_, thunkAPI) => {
    try { 
      // 💡 Extraction de la boutique sélectionnée directement depuis le slice "shops"
      const etatGlobal = thunkAPI.getState();
      const boutiqueId = etatGlobal.shops.boutiqueSelectionnee?.id;

      if (!boutiqueId) {
        return thunkAPI.rejectWithValue("Aucune boutique sélectionnée.");
      }

      // 📡 Passage de l'ID au service
      return await stockService.obtenirProduits(boutiqueId); 
    }
    catch (erreur) { 
      return thunkAPI.rejectWithValue(erreur.message); 
    }
  }

);

// ➕ Ajouter un nouveau produit
export const ajouterNouveauProduit = createAsyncThunk(
  'stock/ajouterNouveauProduit',
  async (donneesProduit, { rejectWithValue }) => {
    try { 
      return await stockService.creerProduit(donneesProduit); 
    }
    catch (erreur) { 
      return rejectWithValue(erreur.message); 
    }
  }
);

// ✏️ Mettre à jour un produit existant
export const actualiserProduit = createAsyncThunk(
  'stock/actualiserProduit',
  async ({ idProduit, nouvellesDonnees }, { rejectWithValue }) => {
    try { 
      return await stockService.modifierProduit(idProduit, nouvellesDonnees); 
    }
    catch (erreur) { 
      return rejectWithValue(erreur.message); 
    }
  }
);

// 🗑️ Supprimer un produit du catalogue
export const retirerProduitDuCatalogue = createAsyncThunk(
  'stock/retirerProduitDuCatalogue',
  async (idProduit, { rejectWithValue }) => {
    try { 
      return await stockService.supprimerProduit(idProduit); 
    }
    catch (erreur) { 
      return rejectWithValue(erreur.message); 
    }
  }
);

// ==========================================
// ---          ÉTAT INITIAL              ---
// ==========================================
const initialState = {
  produits: [],                 // Liste complète des articles de la boutique sélectionnée
  produitsEnAlerte: [],         // Articles dont le stock actuel <= alert_stock
  statutChargement: false,      
  erreurStock: null,            
  operationReussie: false       
};

// ==========================================
// ---            LE SLICE                ---
// ==========================================
const stockSlice = createSlice({
  name: 'stock',
  initialState,
  reducers: {
    nettoyerStatutStock: (state) => {
      state.erreurStock = null;
      state.operationReussie = false;
    },
    // Analyse globale pour isoler les articles en rupture ou pré-rupture
    calculerAlertesStock: (state) => {
      state.produitsEnAlerte = state.produits.filter(
        (p) => p.stock_quantite <= p.alert_stock
      );
    },
    reinitialiserStock: () => initialState,
    filtrerProduitsDisponibles: (state) => {
      console.log("Filtrage des produits disponibles...");
      state.produits = state.produits.filter(p => p.stock_quantite > 0);
      state.produitsEnAlerte = state.produitsEnAlerte.filter(p => p.stock_quantite > 0);
      console.log("Produits restants après filtrage:", state.produits);
    }
  },
  extraReducers: (builder) => {
    builder
      /* ================= 1. TOUS LES ADDCASE EN PREMIER ================= */
      
      // Réception des produits de la boutique filtrée
      .addCase(chargerProduitsBoutique.fulfilled, (state, action) => {
        state.statutChargement = false;
        state.produits = action.payload;
        state.produitsEnAlerte = action.payload.filter(p => p.stock_quantite >0);
      })

      // Chargement de la liste globale
      .addCase(chargerTousLesProduits.fulfilled, (state, action) => {
        state.statutChargement = false;
        state.produits = action.payload;
        state.produitsEnAlerte = action.payload.filter(p => p.stock_quantite <= p.alert_stock);
      })
      
      // Ajout d'un produit
      .addCase(ajouterNouveauProduit.fulfilled, (state, action) => {
        state.statutChargement = false;
        state.operationReussie = true;
        state.produits.unshift(action.payload); // Place le nouveau produit en tête de liste
        
        if (action.payload.stock_quantite <= action.payload.alert_stock) {
          state.produitsEnAlerte.unshift(action.payload);
        }
      })
      
      // Modification d'un produit
      .addCase(actualiserProduit.fulfilled, (state, action) => {
        state.statutChargement = false;
        state.operationReussie = true;
        
        const index = state.produits.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.produits[index] = action.payload;
        }
        
        state.produitsEnAlerte = state.produits.filter(p => p.stock_quantite <= p.alert_stock);
      })
      
      // Suppression d'un produit
      .addCase(retirerProduitDuCatalogue.fulfilled, (state, action) => {
        state.statutChargement = false;
        state.produits = state.produits.filter(p => p.id !== action.payload);
        state.produitsEnAlerte = state.produitsEnAlerte.filter(p => p.id !== action.payload);
      })

      // 🚪 Réinitialisation automatique du stock sur déconnexion générale
      .addCase('auth/logout', (state) => {
        state.produits = [];
        state.produitsEnAlerte = [];
        state.erreurStock = null;
        state.operationReussie = false;
      })

      /* ================= 2. LES ADDMATCHER TOUT EN BAS ================= */
      
      // Centralisation des états de chargement (Pending)
      .addMatcher(
        (action) => action.type.startsWith('stock/') && action.type.endsWith('/pending'),
        (state) => {
          state.statutChargement = true;
          state.erreurStock = null;
          state.operationReussie = false;
        }
      )
      // Centralisation des échecs (Rejected)
      .addMatcher(
        (action) => action.type.startsWith('stock/') && action.type.endsWith('/rejected'),
        (state, action) => {
          state.statutChargement = false;
          state.erreurStock = action.payload;
          state.operationReussie = false;
        }
      );
  }
});

export const { nettoyerStatutStock, calculerAlertesStock, reinitialiserStock, filtrerProduitsDisponibles } = stockSlice.actions;
export default stockSlice.reducer;