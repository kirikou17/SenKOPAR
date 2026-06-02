import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchGlobalChoices } from './features/core/coreSlice';
import RegisterWizard from './features/auth/components/RegisterWizard';
import LoginPage from './pages.jsx/LoginPage';
import DashboardPage from './pages.jsx/DashboardPage'; // Future page d'accueil après connexion
import FreeSales from './pages.jsx/FreeSalesPage';
import CreditPage from './pages.jsx/CreditPage';
import StocksPage from './pages.jsx/StocksPage';

const App = () => {
  const dispatch = useDispatch();

  // On charge les choix Django au démarrage
  useEffect(() => {
    dispatch(fetchGlobalChoices());
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        {/* Redirection automatique vers l'inscription pour le moment */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/stocks" element={<StocksPage />} />
        <Route path="/credits" element={<CreditPage />} />
        
        {/* Ton composant d'inscription est bien ICI, à l'intérieur du Router */}
        <Route path="/register" element={<RegisterWizard />} />

        {/* Vos futures pages de l'application connectée */}
        <Route path="/dashboard" element={<DashboardPage />} />

        <Route path="/freesales" element={<FreeSales />} />
      </Routes>
    </Router>
  );
};

export default App;