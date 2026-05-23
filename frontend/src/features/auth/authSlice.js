import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from './authService';

/**
 * 🔑 Thunk Asynchrone : Connexion de l'utilisateur
 */
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      
      // ✅ PROTECTION : On extrait les données, que le service renvoie 'response' ou directement 'response.data'
      const data = response.data ? response.data : response;
      
      // Si Django renvoie le token, on le sauvegarde localement
      if (data && data.token) {
        localStorage.setItem('senkopar_token', data.token);
        localStorage.setItem('senkopar_user', JSON.stringify(data.user));
        return data; // Déclenche le .fulfilled et transmet le payload exact
      } else {
        return rejectWithValue("Le serveur n'a pas renvoyé de jeton valide.");
      }
    } catch (error) {
      // Capture les erreurs d'identifiants ou de serveur (ex: 401 Unauthorized)
      const errorData = error.response?.data;
      const errorMessage = errorData?.detail || errorData?.message || "Identifiants incorrects ou serveur injoignable.";
      return rejectWithValue(errorMessage); // Déclenche le .rejected
    }
  }
);

/**
 * 📝 Thunk Asynchrone : Inscription en 3 étapes (RegisterWizard)
 */
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authService.register(userData);
      
      // ✅ PROTECTION : Même chose pour l'inscription
      const data = response.data ? response.data : response;
      
      // Si ton API connecte directement l'utilisateur après inscription
      if (data && data.token) {
        localStorage.setItem('senkopar_token', data.token);
        localStorage.setItem('senkopar_user', JSON.stringify(data.user));
      }
      
      return data;
    } catch (error) {
      // Capture les erreurs de validation de Django (ex: username déjà pris)
      const errorData = error.response?.data;
      const errorMessage = errorData?.message || errorData?.detail || "Erreur lors de la création du compte.";
      return rejectWithValue(errorMessage);
    }
  }
);

// État initial synchronisé avec le stockage du navigateur
const initialState = {
  user: JSON.parse(localStorage.getItem('senkopar_user')) || null,
  token: localStorage.getItem('senkopar_token') || null,
  isAuthenticated: !!localStorage.getItem('senkopar_token'),
  loading: false,
  error: null,
  registerSuccess: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // 🚪 Déconnexion : Nettoyage complet
    logout: (state) => {
      localStorage.removeItem('senkopar_token');
      localStorage.removeItem('senkopar_user');
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.registerSuccess = false;
      
    },
    // 🧹 Nettoyer les messages d'erreur lors des changements de page
    clearAuthError: (state) => {
      state.error = null;
    },
    // Réinitialiser le statut de succès d'inscription
    resetRegisterSuccess: (state) => {
      state.registerSuccess = false;
    }
  },
  extraReducers: (builder) => {
    builder
      /* ================= LOGIN CASES ================= */
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })

      /* ================= REGISTER CASES ================= */
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.registerSuccess = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.registerSuccess = true;
        state.error = null;
        if (action.payload && action.payload.token) {
          state.isAuthenticated = true;
          state.user = action.payload.user;
          state.token = action.payload.token;
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.registerSuccess = false;
      });
  },
});

export const { logout, clearAuthError, resetRegisterSuccess } = authSlice.actions;
export default authSlice.reducer;