import React, { useState,useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { logout } from '../features/auth/authSlice';

const DashboardLayout = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

    const { loading = false, error = null, isAuthenticated = false } = useSelector((state) => state.auth || {});


  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const { user } = useSelector((state) => state.auth || {});

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  const menuItems = [
    { name: "Dashboard", path: '/dashboard', icon: "📊" },
    { name: 'Stocks', path: '/stocks', icon: "📦" },
    { name: 'Ventes', path: '/freesales', icon: "🛒" },
    { name: 'Crédits', path: '/credits', icon: "💳" },
    { name: 'Settings', path: '/settings', icon: "⚙️" },
  ];

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          font-family: 'Inter', system-ui, sans-serif;
          background: #f9fafb;
        }

        /* ───────── LAYOUT ───────── */
        .layout {
          display: flex;
          min-height: 100vh;
          width: 100%;
        }

        /* ───────── SIDEBAR FIXE ───────── */
        .sidebar {
          width: 260px;
          background: #ffffff;
          border-right: 1px solid #e5e7eb;
          display: flex;
          flex-direction: column;
          transition: width 0.23s cubic-bezier(0.4, 0, 0.2, 1);
          position: sticky;
          top: 0;
          height: 100vh;
          z-index: 20;
        }

        .sidebar.collapsed {
          width: 70px;
        }

        .logo {
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 16px;
          border-bottom: 1px solid #e5e7eb;
          font-weight: 700;
          color: #111;
        }

        .collapse-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 16px;
          color: #64748b;
        }

        .nav {
          flex: 1;
          padding: 12px 8px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: 8px;
          text-decoration: none;
          color: #4b5563;
          font-size: 14px;
          font-weight: 500;
          transition: 0.15s ease;
        }

        .nav-link:hover {
          background: #f3f4f6;
          color: #111827;
        }

        .nav-link.active {
          background: #111827;
          color: white;
        }

        .sidebar.collapsed .text {
          display: none;
        }

        /* ───────── LOGOUT SIMPLE ───────── */
        .footer {
          padding: 12px;
          border-top: 1px solid #e5e7eb;
          display: flex;
          justify-content: flex-start;
        }
        
        .sidebar.collapsed .footer {
          justify-content: center;
        }

        .logout-btn {
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          color: #94a3b8;
          font-size: 14px;
          font-weight: 500;
          border-radius: 8px;
          transition: all 0.15s;
          width: 100%;
        }

        .logout-btn:hover {
          background: #fef2f2;
          color: #ef4444;
        }
        
        .logout-icon {
          font-size: 16px;
          font-weight: bold;
        }

        /* ───────── MOBILE SIDEBAR ───────── */
        .overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.3);
          backdrop-filter: blur(1px);
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.25s;
          z-index: 15;
        }

        .overlay.open {
          opacity: 1;
          pointer-events: auto;
        }

        @media (max-width: 768px) {
          .sidebar {
            position: fixed;
            left: 0;
            top: 0;
            transform: translateX(-100%);
          }

          .sidebar.open {
            transform: translateX(0);
          }

          .sidebar.collapsed {
            width: 260px;
          }
          
          .sidebar.collapsed .text {
            display: inline;
          }
        }

        /* ───────── MAIN ───────── */
        .main {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        /* ───────── TOPBAR ───────── */
        .topbar {
          height: 56px;
          background: white;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 16px;
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .menu-btn {
          display: none;
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
          color: #334155;
        }

        .title {
          font-weight: 600;
          font-size: 15px;
          color: #1e293b;
        }

        /* ───────── BADGE BOUTIQUE ACTIVE ───────── */
        .shop-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          color: #166534;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          max-width: 240px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        .shop-badge .icon {
          font-size: 14px;
        }

        .user {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #f3f4f6;
          padding: 5px 12px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 500;
          color: #374151;
        }

        /* ───────── CONTENT OPTIMISÉ ───────── */
        .content {
          flex: 1;
          padding: 10px 16px 24px;
          overflow-y: auto;
        }

        /* ───────── RESPONSIVE ───────── */
        @media (max-width: 768px) {
          .menu-btn { display: block; }
          .shop-badge { 
            padding: 6px 10px;
            font-size: 12px;
            max-width: 140px;
          }
        }
      `}</style>

      <div className="layout">
        {/* Overlay mobile */}
        <div
          className={`overlay ${isMobileMenuOpen ? 'open' : ''}`}
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* SIDEBAR FIXE */}
        <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobileMenuOpen ? 'open' : ''}`}>
          <div className="logo">
            {!isCollapsed && <span style={{letterSpacing: '-0.5px'}}>SenKOPAR</span>}

            <button
              type="button"
              className="collapse-btn"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              ☰
            </button>
          </div>

          <nav className="nav">
            {menuItems.map((item) => {
              const active = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-link ${active ? 'active' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span>{item.icon}</span>
                  <span className="text">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* FOOTER AVEC LOGOUT EPURÉ */}
          <div className="footer">
            <button type="button" className="logout-btn" onClick={handleLogout} title="Déconnexion">
              <span className="logout-icon">⇦</span>
              <span className="text">Quitter</span>
            </button>
          </div>
        </aside>

        {/* MAIN */}
        <div className="main">
          {/* TOPBAR */}
          <header className="topbar">
            <div className="left">
              <button
                type="button"
                className="menu-btn"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                ☰
              </button>

              <h3 className="title">Dashboard</h3>
            </div>

          

            <div className="user">
              👤 {user?.username || 'Moussa'}
            </div>
          </header>

          {/* CONTENT */}
          <main className="content">
            {children}
          </main>
        </div>
      </div>
    </>
  );
};

export default DashboardLayout;