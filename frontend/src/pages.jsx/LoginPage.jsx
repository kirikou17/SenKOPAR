import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser, clearAuthError } from '../features/auth/authSlice';
import { styles } from './LoginPage.styles';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // ✅ Protection fallback '|| {}' intégrée pour éviter le crash au chargement
  const { loading = false, error = null, isAuthenticated = false } = useSelector((state) => state.auth || {});

  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });


  
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
    return () => dispatch(clearAuthError());
  }, [isAuthenticated, navigate, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("🚀 Tentative d'envoi des identifiants :", credentials);
    dispatch(loginUser(credentials));
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.loginCard}>
        <h2 style={styles.brandTitle}>SenKOPAR</h2>
        <p style={styles.brandSubtitle}>Gestion de commerce, stocks & crédits</p>

        <h3 style={styles.formTitle}>Connexion à votre espace</h3>
        
        {error && (
          <div style={styles.errorAlert}>
            <span style={{ marginRight: '8px' }}>⚠️</span> {error}
          </div>
        )}

        {/* ✅ Vérifie que la balise <form> englobe bien le bouton de soumission */}
        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Nom d'utilisateur</label>
            <input 
              type="text" 
              name="username" 
              value={credentials.username} 
              onChange={handleChange} 
              required 
              style={styles.input} 
              placeholder="Ex: merah" 
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Mot de passe</label>
            <input 
              type="password" 
              name="password" 
              value={credentials.password} 
              onChange={handleChange} 
              required 
              style={styles.input} 
              placeholder="••••••••" 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            style={{ 
              ...styles.submitButton, 
              backgroundColor: loading ? '#bdc3c7' : '#3498db',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Vérification en cours...' : 'Se connecter au système 🔑'}
          </button>
        </form>

        <p style={styles.footerText}>
          Nouveau sur la plateforme ?{' '}
          <Link to="/register" style={styles.registerLink}>
            Créer ma boutique en 3 étapes
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;