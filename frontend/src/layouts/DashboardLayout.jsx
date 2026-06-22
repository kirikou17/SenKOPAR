import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { logout } from '../features/auth/authSlice';
import { chargerBoutiquesUtilisateur, selectionnerBoutique } from '../features/shops/shopsSlice';

const menuItems = [
  { 
    name: 'Dashboard', 
    path: '/dashboard', 
    icon: 'ti-layout-dashboard', 
    label: 'Vue générale'
  },
  { 
    name: 'Stocks',    
    path: '/stocks',    
    icon: 'ti-package',           
    label: 'Inventaire'
  },
  { 
    name: 'Ventes',   
    path: '/freesales', 
    icon: 'ti-shopping-cart',     
    label: 'Point de vente'
  },
];

const pageTitles = {
  '/dashboard': 'Tableau de bord',
  '/stocks': 'Gestion des stocks',
  '/freesales': 'Point de vente',
};

const DashboardLayout = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const navRef = useRef(null);
  const indicatorRef = useRef(null);

  const { loading = false, isAuthenticated = false, user } = useSelector((s) => s.auth || {});
  const { boutiques = [], boutiqueSelectionnee, statutChargement } = useSelector((s) => s.shops || {});

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const activeIndex = menuItems.findIndex((m) => m.path === location.pathname);

  // ── Chargement des boutiques ──
  useEffect(() => {
    if (boutiques.length === 0 && isAuthenticated) {
      dispatch(chargerBoutiquesUtilisateur());
    }
  }, [dispatch, boutiques.length, isAuthenticated]);

  // ── Sélection automatique de la première boutique ──
  useEffect(() => {
    if (boutiques.length > 0 && !boutiqueSelectionnee) {
      dispatch(selectionnerBoutique(boutiques[0]));
    }
  }, [boutiques, boutiqueSelectionnee, dispatch]);

  // ── Sliding indicator ──
  useEffect(() => {
    const nav = navRef.current;
    const indicator = indicatorRef.current;
    if (!nav || !indicator) return;

    const links = nav.querySelectorAll('.nav-link');
    if (!links[activeIndex]) return;

    const linkEl = links[activeIndex];
    indicator.style.top = `${linkEl.offsetTop}px`;
    indicator.style.height = `${linkEl.offsetHeight}px`;
    indicator.style.opacity = '1';
  }, [activeIndex, isCollapsed]);

  // ── Redirection si non authentifié ──
  useEffect(() => {
    if (!isAuthenticated && !loading) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  const handleLogout = useCallback(() => {
    dispatch(logout());
    navigate('/login');
  }, [dispatch, navigate]);

  const handleShopChange = useCallback((e) => {
    const id = parseInt(e.target.value, 10);
    const shop = boutiques.find(b => b.id === id);
    if (shop) dispatch(selectionnerBoutique(shop));
  }, [boutiques, dispatch]);

  const getInitials = useCallback((name = '') => {
    if (!name) return 'SK';
    return name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        @import url('https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css');

        *, *::before, *::after { 
          box-sizing: border-box; 
          margin: 0; 
          padding: 0; 
        }

        :root {
          --sidebar-w: 240px;
          --sidebar-collapsed-w: 60px;
          --topbar-h: 56px;
          
          --bg-sidebar: #1A1F2E;
          --bg-sidebar-hover: rgba(255,255,255,0.04);
          --bg-indicator: #2D3748;
          --color-accent: #4A90D9;
          --color-accent-hover: #5B9DE0;
          --color-accent-text: #6BA3E6;
          --border-sidebar: rgba(255,255,255,0.06);
          --text-nav: rgba(255,255,255,0.5);
          --text-nav-hover: rgba(255,255,255,0.85);
          --text-nav-active: #FFFFFF;
          
          --bg-main: #EDF2F7;
          --bg-topbar: #FFFFFF;
          --border-topbar: #E2E8F0;
          --text-primary: #2D3748;
          --text-secondary: #718096;
          --text-muted: #A0AEC0;
          
          --radius: 0px;
          --shadow-sm: 0 1px 3px rgba(0,0,0,0.06);
          --shadow-md: 0 2px 8px rgba(0,0,0,0.08);
          --transition: 0.2s ease;
        }

        body { 
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif; 
          background: var(--bg-main);
          color: var(--text-primary);
          font-size: 13px;
        }

        ::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: #CBD5E0;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #A0AEC0;
        }

        /* ── LAYOUT ── */
        .sk-layout {
          display: flex;
          min-height: 100vh;
        }

        /* ── SIDEBAR ── */
        .sk-sidebar {
          width: var(--sidebar-w);
          background: var(--bg-sidebar);
          display: flex;
          flex-direction: column;
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          flex-shrink: 0;
          transition: width var(--transition);
          z-index: 30;
          overflow: hidden;
          border-right: 1px solid var(--border-sidebar);
        }

        .sk-sidebar.collapsed { 
          width: var(--sidebar-collapsed-w); 
        }

        /* Brand */
        .sk-brand {
          height: var(--topbar-h);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 14px;
          border-bottom: 1px solid var(--border-sidebar);
          flex-shrink: 0;
          gap: 8px;
          min-height: var(--topbar-h);
        }

        .sk-brand-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
          overflow: hidden;
        }

        .sk-brand-icon {
          width: 28px;
          height: 28px;
          background: var(--color-accent);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          color: #fff;
          font-weight: 700;
          flex-shrink: 0;
          letter-spacing: -0.5px;
        }

        .sk-brand-name {
          color: #fff;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.3px;
          white-space: nowrap;
          opacity: 1;
          transition: opacity var(--transition);
        }

        .sk-sidebar.collapsed .sk-brand-name { 
          opacity: 0; 
        }

        .sk-collapse-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          color: rgba(255,255,255,0.3);
          font-size: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          transition: all 0.15s;
          flex-shrink: 0;
        }

        .sk-collapse-btn:hover { 
          color: #fff; 
          background: var(--bg-sidebar-hover);
        }

        /* ── SHOP SELECTOR IN SIDEBAR ── */
        .sk-shop-selector {
          padding: 8px 10px;
          border-bottom: 1px solid var(--border-sidebar);
          flex-shrink: 0;
        }
        .sk-shop-selector .shop-label {
          font-size: 9px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: rgba(255,255,255,0.3);
          display: block;
          margin-bottom: 4px;
        }
        .sk-shop-selector .shop-select {
          width: 100%;
          padding: 6px 28px 6px 10px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.08);
          color: #fff;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10'%3E%3Cpath fill='%23A0AEC0' d='M5 7L1 3h8z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 8px center;
          font-family: inherit;
          transition: all 0.2s;
        }
        .sk-shop-selector .shop-select:focus {
          border-color: var(--color-accent);
          outline: none;
        }
        .sk-shop-selector .shop-select option {
          background: #2D3748;
          color: #fff;
        }
        .sk-shop-selector .shop-loading {
          font-size: 11px;
          color: rgba(255,255,255,0.3);
          padding: 4px 0;
          display: block;
        }

        /* Nav */
        .sk-nav {
          flex: 1;
          padding: 8px 6px;
          display: flex;
          flex-direction: column;
          gap: 1px;
          position: relative;
          overflow-y: auto;
          overflow-x: hidden;
        }

        .sk-indicator {
          position: absolute;
          left: 6px;
          right: 6px;
          background: var(--bg-indicator);
          border-left: 2px solid var(--color-accent);
          transition: top 0.2s ease, height 0.2s ease, opacity 0.15s;
          opacity: 0;
          pointer-events: none;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 10px;
          text-decoration: none;
          color: var(--text-nav);
          font-size: 13px;
          font-weight: 500;
          transition: all 0.15s ease;
          position: relative;
          white-space: nowrap;
          cursor: pointer;
          border: none;
          background: transparent;
          width: 100%;
          font-family: inherit;
        }

        .nav-link:hover { 
          background: var(--bg-sidebar-hover); 
          color: var(--text-nav-hover);
        }

        .nav-link.active { 
          color: var(--text-nav-active);
          background: var(--bg-indicator);
        }

        .nav-link i {
          font-size: 18px;
          flex-shrink: 0;
          transition: color 0.15s;
          width: 20px;
          text-align: center;
        }

        .nav-link.active i { 
          color: var(--color-accent-text);
        }

        .nav-text {
          display: flex;
          flex-direction: column;
          min-width: 0;
          opacity: 1;
          transition: opacity var(--transition);
          overflow: hidden;
        }

        .nav-text-main { 
          font-size: 13px; 
          font-weight: 500;
          line-height: 1.3;
        }

        .nav-text-sub {  
          font-size: 10px; 
          color: rgba(255,255,255,0.25); 
          line-height: 1.2;
          margin-top: 1px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .nav-link.active .nav-text-sub { 
          color: rgba(255,255,255,0.4); 
        }

        .sk-sidebar.collapsed .nav-text { 
          opacity: 0; 
        }

        /* Divider */
        .sk-nav-divider {
          height: 1px;
          background: var(--border-sidebar);
          margin: 4px 6px;
        }

        /* Footer */
        .sk-footer {
          border-top: 1px solid var(--border-sidebar);
          padding: 8px 6px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex-shrink: 0;
        }

        .sk-user-row {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 6px 10px;
          overflow: hidden;
          min-width: 0;
        }

        .sk-avatar {
          width: 28px;
          height: 28px;
          background: rgba(74,144,217,0.2);
          color: var(--color-accent-text);
          font-size: 10px;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border: 1px solid rgba(74,144,217,0.2);
        }

        .sk-user-info {
          min-width: 0;
          opacity: 1;
          transition: opacity var(--transition);
          overflow: hidden;
        }

        .sk-sidebar.collapsed .sk-user-info { 
          opacity: 0; 
        }

        .sk-user-name { 
          font-size: 12px; 
          font-weight: 600; 
          color: #fff; 
          white-space: nowrap;
          line-height: 1.3;
        }

        .sk-user-role { 
          font-size: 10px; 
          color: rgba(255,255,255,0.3); 
          white-space: nowrap;
          line-height: 1.2;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .sk-logout-btn {
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 7px 10px;
          color: rgba(255,255,255,0.3);
          font-size: 12px;
          font-weight: 500;
          transition: all 0.15s;
          width: 100%;
          font-family: inherit;
          white-space: nowrap;
        }

        .sk-logout-btn:hover { 
          background: rgba(229,62,62,0.1); 
          color: #FC8181;
        }

        .sk-logout-btn i { 
          font-size: 16px; 
          flex-shrink: 0; 
          width: 20px; 
          text-align: center;
        }

        .sk-logout-text {
          opacity: 1;
          transition: opacity var(--transition);
          overflow: hidden;
        }

        .sk-sidebar.collapsed .sk-logout-text { 
          opacity: 0; 
        }

        /* ── OVERLAY mobile ── */
        .sk-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.2s ease;
          z-index: 20;
        }

        .sk-overlay.open { 
          opacity: 1; 
          pointer-events: auto; 
        }

        /* ── MAIN ── */
        .sk-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
          margin-left: var(--sidebar-w);
          transition: margin-left var(--transition);
        }

        .sk-sidebar.collapsed ~ .sk-main {
          margin-left: var(--sidebar-collapsed-w);
        }

        /* ── TOPBAR ── */
        .sk-topbar {
          height: var(--topbar-h);
          background: var(--bg-topbar);
          border-bottom: 1px solid var(--border-topbar);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 20px;
          position: sticky;
          top: 0;
          z-index: 15;
        }

        .sk-topbar-left {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .sk-mobile-btn {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          color: var(--text-primary);
          font-size: 20px;
          width: 32px;
          height: 32px;
          align-items: center;
          justify-content: center;
          transition: background 0.15s;
        }

        .sk-mobile-btn:hover { 
          background: #F7FAFC;
        }

        .sk-breadcrumb {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .sk-breadcrumb-app {
          font-size: 12px;
          font-weight: 500;
          color: var(--text-secondary);
          letter-spacing: 0.3px;
        }

        .sk-breadcrumb-sep {
          color: #CBD5E0;
          font-size: 14px;
        }

        .sk-breadcrumb-page {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .sk-topbar-right {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .sk-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #F7FAFC;
          border: 1px solid #E2E8F0;
          padding: 4px 12px 4px 8px;
          font-size: 12px;
          font-weight: 500;
          color: var(--text-primary);
          cursor: default;
          user-select: none;
        }

        .sk-pill-dot {
          width: 6px;
          height: 6px;
          background: var(--color-accent);
        }

        /* ── CONTENT ── */
        .sk-content {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
          background: var(--bg-main);
        }

        /* ── MOBILE ── */
        @media (max-width: 768px) {
          .sk-sidebar {
            position: fixed;
            left: 0;
            top: 0;
            transform: translateX(-100%);
            width: var(--sidebar-w) !important;
          }

          .sk-sidebar.mobile-open {
            transform: translateX(0);
          }

          .sk-sidebar.collapsed .sk-brand-name,
          .sk-sidebar.collapsed .nav-text,
          .sk-sidebar.collapsed .sk-user-info,
          .sk-sidebar.collapsed .sk-logout-text {
            opacity: 1;
          }

          .sk-mobile-btn { 
            display: flex; 
          }
          
          .sk-content { 
            padding: 16px; 
          }

          .sk-main {
            margin-left: 0 !important;
          }

          .sk-topbar {
            padding: 0 14px;
          }

          .sk-breadcrumb-app {
            display: none;
          }

          .sk-breadcrumb-sep {
            display: none;
          }
        }

        /* ── DARK MODE ── */
        @media (prefers-color-scheme: dark) {
          :root {
            --bg-main: white;
            --bg-topbar: #2D3748;
            --border-topbar: #4A5568;
            --text-primary: #E2E8F0;
            --text-secondary: #A0AEC0;
            --text-muted: #718096;
          }

          .sk-pill {
            background: #374151;
            border-color: #4B5563;
            color: #E2E8F0;
          }

          .sk-mobile-btn:hover { 
            background: #374151;
          }
        }
      `}</style>

      <div className="sk-layout">
        {/* Overlay mobile */}
        <div
          className={`sk-overlay ${isMobileMenuOpen ? 'open' : ''}`}
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />

        {/* ── SIDEBAR ── */}
        <aside 
          className={`sk-sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobileMenuOpen ? 'mobile-open' : ''}`}
        >
          {/* Brand */}
          <div className="sk-brand">
            <div className="sk-brand-logo">
              <div className="sk-brand-icon">SK</div>
              <span className="sk-brand-name">SenKOPAR</span>
            </div>
            <button
              type="button"
              className="sk-collapse-btn"
              onClick={() => setIsCollapsed(!isCollapsed)}
              title={isCollapsed ? 'Agrandir' : 'Réduire'}
            >
              <i className={`ti ${isCollapsed ? 'ti-layout-sidebar-right' : 'ti-layout-sidebar'}`} />
            </button>
          </div>

          {/* ── SÉLECTEUR DE BOUTIQUE DANS LA SIDEBAR ── */}
          <div className="sk-shop-selector">
            <span className="shop-label"> Boutique active</span>
            {statutChargement && boutiques.length === 0 ? (
              <span className="shop-loading">Chargement...</span>
            ) : (
              <select
                className="shop-select"
                value={boutiqueSelectionnee?.id || ''}
                onChange={handleShopChange}
                // disabled={boutiques.length <= 2}
              >
                
                {boutiques.map(b => (
                  
                  <option key={b.id} value={b.id}>
                    {b.nom_boutique}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Navigation */}
          <nav className="sk-nav" ref={navRef}>
            <div className="sk-indicator" ref={indicatorRef} />

            {menuItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-link ${active ? 'active' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  title={isCollapsed ? item.name : undefined}
                >
                  <i className={`ti ${item.icon}`} />
                  <span className="nav-text">
                    <span className="nav-text-main">{item.name}</span>
                    <span className="nav-text-sub">{item.label}</span>
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="sk-footer">
            <div className="sk-user-row">
              <div className="sk-avatar">{getInitials(user?.username)}</div>
              <div className="sk-user-info">
                <div className="sk-user-name">{user?.username || 'Utilisateur'}</div>
                <div className="sk-user-role">Administrateur</div>
              </div>
            </div>

            <button type="button" className="sk-logout-btn" onClick={handleLogout}>
              <i className="ti ti-logout" />
              <span className="sk-logout-text">Déconnexion</span>
            </button>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <div className="sk-main">
          {/* Topbar */}
          <header className="sk-topbar">
            <div className="sk-topbar-left">
              <button
                type="button"
                className="sk-mobile-btn"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Menu"
              >
                <i className={`ti ${isMobileMenuOpen ? 'ti-x' : 'ti-menu-2'}`} />
              </button>

              <div className="sk-breadcrumb">
                <span className="sk-breadcrumb-app">SenKOPAR</span>
                <span className="sk-breadcrumb-sep">›</span>
                <span className="sk-breadcrumb-page">
                  {pageTitles[location.pathname] || 'Page'}
                </span>
              </div>
            </div>

            <div className="sk-topbar-right">
              <div className="sk-pill">
                <span className="sk-pill-dot" />
                <span>{boutiqueSelectionnee?.nom_boutique || 'Aucune boutique'}</span>
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="sk-content">
            {children}
          </main>
        </div>
      </div>
    </>
  );
};

export default DashboardLayout;