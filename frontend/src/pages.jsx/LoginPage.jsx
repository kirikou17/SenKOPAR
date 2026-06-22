import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser, clearAuthError } from '../features/auth/authSlice';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { loading = false, error = null, isAuthenticated = false } = useSelector((state) => state.auth || {});

  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

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
    dispatch(loginUser(credentials));
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        
        /* ── Reset et Base ── */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
          background: #EDF2F7;
        }

        /* ── Layout ── */
        .login-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: #EDF2F7;
          padding: 20px;
        }

        /* ── Card ── */
        .login-card {
          width: 100%;
          max-width: 400px;
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          padding: 40px 32px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        }

        /* ── Brand ── */
        .login-brand {
          text-align: center;
          margin-bottom: 32px;
        }
        .login-brand .logo {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          background: #4A90D9;
          color: #FFFFFF;
          font-size: 20px;
          font-weight: 800;
          letter-spacing: -0.5px;
          margin-bottom: 12px;
          border: 1px solid #4A90D9;
        }
        .login-brand h1 {
          font-size: 20px;
          font-weight: 700;
          color: #2D3748;
          margin: 0 0 4px 0;
          letter-spacing: -0.3px;
        }
        .login-brand p {
          font-size: 13px;
          color: #A0AEC0;
          margin: 0;
        }

        /* ── Form Title ── */
        .login-form-title {
          font-size: 14px;
          font-weight: 600;
          color: #2D3748;
          margin-bottom: 20px;
          padding-bottom: 12px;
          border-bottom: 1px solid #EDF2F7;
        }

        /* ── Error Alert ── */
        .login-error {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          background: #FDF2F2;
          border: 1px solid #FECACA;
          color: #9B1C1C;
          font-size: 13px;
          margin-bottom: 20px;
        }
        .login-error .icon {
          font-size: 18px;
          flex-shrink: 0;
        }

        /* ── Form ── */
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .login-field {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .login-field label {
          font-size: 12px;
          font-weight: 600;
          color: #4A5568;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }
        .login-field label .required {
          color: #EF4444;
        }

        .login-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        .login-input-wrapper .input-icon {
          position: absolute;
          left: 12px;
          color: #A0AEC0;
          font-size: 18px;
          pointer-events: none;
        }
        .login-input-wrapper input {
          width: 100%;
          padding: 10px 14px 10px 42px;
          border: 1.5px solid #E2E8F0;
          font-size: 14px;
          color: #2D3748;
          background: #FFFFFF;
          transition: all 0.2s;
          font-family: 'Inter', system-ui, sans-serif;
          outline: none;
        }
        .login-input-wrapper input:hover {
          border-color: #CBD5E1;
        }
        .login-input-wrapper input:focus {
          border-color: #4A90D9;
          box-shadow: 0 0 0 3px rgba(74,144,217,0.1);
        }
        .login-input-wrapper input::placeholder {
          color: #A0AEC0;
          font-size: 13px;
        }

        .login-input-wrapper .toggle-password {
          position: absolute;
          right: 12px;
          background: none;
          border: none;
          color: #A0AEC0;
          cursor: pointer;
          font-size: 18px;
          padding: 4px;
          transition: color 0.2s;
          font-family: inherit;
        }
        .login-input-wrapper .toggle-password:hover {
          color: #4A5568;
        }

        /* ── Options ── */
        .login-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 4px;
        }
        .login-options .remember {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: #4A5568;
          cursor: pointer;
        }
        .login-options .remember input[type="checkbox"] {
          width: 16px;
          height: 16px;
          accent-color: #4A90D9;
          cursor: pointer;
        }
        .login-options .forgot-link {
          font-size: 13px;
          color: #4A90D9;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s;
        }
        .login-options .forgot-link:hover {
          color: #3A7BC8;
          text-decoration: underline;
        }

        /* ── Submit ── */
        .login-submit {
          width: 100%;
          padding: 12px;
          background: #4A90D9;
          border: 1px solid #4A90D9;
          color: #FFFFFF;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'Inter', system-ui, sans-serif;
          margin-top: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .login-submit:hover:not(:disabled) {
          background: #3A7BC8;
          border-color: #3A7BC8;
          transform: translateY(-1px);
        }
        .login-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        .login-submit .spinner {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #FFFFFF;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* ── Footer ── */
        .login-footer {
          text-align: center;
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #EDF2F7;
        }
        .login-footer p {
          font-size: 13px;
          color: #A0AEC0;
          margin: 0;
        }
        .login-footer a {
          color: #4A90D9;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.2s;
        }
        .login-footer a:hover {
          color: #3A7BC8;
          text-decoration: underline;
        }

        /* ── Responsive ── */
        @media (max-width: 480px) {
          .login-card {
            padding: 28px 20px;
          }
          .login-brand h1 {
            font-size: 18px;
          }
          .login-input-wrapper input {
            padding: 10px 14px 10px 38px;
            font-size: 13px;
          }
          .login-options {
            flex-direction: column;
            gap: 8px;
            align-items: flex-start;
          }
        }

        /* ── Dark Mode Support ── */
        @media (prefers-color-scheme: dark) {
          body {
            background: #1A202C;
          }
          .login-card {
            background: #2D3748;
            border-color: #4A5568;
          }
          .login-brand h1 {
            color: #F7FAFC;
          }
          .login-brand p {
            color: #A0AEC0;
          }
          .login-form-title {
            color: #F7FAFC;
            border-bottom-color: #4A5568;
          }
          .login-field label {
            color: #A0AEC0;
          }
          .login-input-wrapper input {
            background: #1A202C;
            border-color: #4A5568;
            color: #F7FAFC;
          }
          .login-input-wrapper input:hover {
            border-color: #718096;
          }
          .login-input-wrapper input:focus {
            border-color: #4A90D9;
          }
          .login-input-wrapper input::placeholder {
            color: #718096;
          }
          .login-options .remember {
            color: #A0AEC0;
          }
          .login-footer {
            border-top-color: #4A5568;
          }
          .login-footer p {
            color: #718096;
          }
        }
      `}</style>

      <div className="login-wrapper">
        <div className="login-card">
          {/* Brand */}
          <div className="login-brand">
            <div className="logo">SK</div>
            <h1>SenKOPAR</h1>
            <p>Gestion de points de vente</p>
          </div>

          {/* Form Title */}
          <div className="login-form-title">
            🔐 Connexion à votre espace
          </div>

          {/* Error */}
          {error && (
            <div className="login-error">
              <span className="icon">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-field">
              <label>
                Identifiant <span className="required">*</span>
              </label>
              <div className="login-input-wrapper">
                <span className="input-icon">👤</span>
                <input
                  type="text"
                  name="username"
                  placeholder="Nom d'utilisateur"
                  value={credentials.username}
                  onChange={handleChange}
                  required
                  autoFocus
                />
              </div>
            </div>

            <div className="login-field">
              <label>
                Mot de passe <span className="required">*</span>
              </label>
              <div className="login-input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="••••••••"
                  value={credentials.password}
                  onChange={handleChange}
                  required
                  minLength="6"
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                >
                  {showPassword ? '👁️‍🗨️' : '👁️'}
                </button>
              </div>
            </div>

            <div className="login-options">
              <label className="remember">
                <input type="checkbox" />
                Se souvenir
              </label>
              <Link to="/forgot-password" className="forgot-link">
                Mot de passe oublié ?
              </Link>
            </div>

            <button
              type="submit"
              className="login-submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner" />
                  Connexion...
                </>
              ) : (
                '🔑 Se connecter'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="login-footer">
            <p>
              Nouveau sur la plateforme ?{' '}
              <Link to="/register">Créer ma boutique en 3 étapes</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;