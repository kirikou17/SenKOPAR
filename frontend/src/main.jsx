import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { store } from './app/store';
import { Provider } from 'react-redux';

// 💡 Enregistrement natif du Service Worker pour SenKOPAR
// Évite l'erreur de module virtuel en développement, mais s'active automatiquement en production
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('SenKOPAR PWA : OK !', reg))
      .catch(err => console.error('Erreur :', err));
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Le Provider enveloppe TOUTE l'application, y compris App */}
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);