import stockService from "./stocksService";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const enregistrerMouvementStock = createAsyncThunk(
  'stock/enregistrerMouvementStock',
  async (donneesMouvement, { rejectWithValue }) => {
    try {
        const reponse = await stockService.enregistrerMouvementStock(donneesMouvement);
        return reponse;
    } catch (erreur) {
        return rejectWithValue(erreur.message);
    }
}
);


const mouvementsSlice = createSlice({
  name: 'mouvements',
  initialState: {
    mouvementsdata: [], // 👈 Ton tableau s'appelle bien comme ça
    loadingmouvements: false,
    error: null
  },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(enregistrerMouvementStock.pending, (state) => {
                state.loadingmouvements = true;
                state.error = null;
            })
            .addCase(enregistrerMouvementStock.fulfilled, (state, action) => {
                state.loadingmouvements = false;
                state.mouvementsdata.push(action.payload); // Ajoute le nouveau mouvement à la liste
            })
            .addCase(enregistrerMouvementStock.rejected, (state, action) => {
                state.loadingmouvements = false;
                state.error = action.payload;
            });
    }
});


export default mouvementsSlice.reducer;