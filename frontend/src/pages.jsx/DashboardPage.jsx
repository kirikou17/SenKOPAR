import React, { useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { useSelector, useDispatch } from 'react-redux';
// On importe les actions et le thunk exacts de ton shopsSlice
import { chargerBoutiquesUtilisateur, selectionnerBoutique } from '../features/shops/shopsSlice';

function DashboardPage() {
  const dispatch = useDispatch();
  
  // 1. 🚀 On extrait les variables exactes de ton initialState
  const { boutiques, boutiqueSelectionnee, statutChargement } = useSelector((state) => state.shops);

  // 2. On lance le chargement asynchrone via ton Thunk si le tableau est vide
  useEffect(() => {
    if (boutiques.length === 0) {
      dispatch(chargerBoutiquesUtilisateur());
    }
  }, [dispatch, boutiques.length]);

  

  // 3. 🔄 On déclenche ton action synchrone "selectionnerBoutique" au changement du sélecteur
  const handleBoutiqueChange = (event) => {
    const boutiqueId = parseInt(event.target.value, 10);
    const boutiqueTrouvee = boutiques.find((b) => b.id === boutiqueId);
    
    if (boutiqueTrouvee) {
      dispatch(selectionnerBoutique(boutiqueTrouvee)); // Devient globale instantanément !
    }
  };

  return (
    <DashboardLayout>
      <div style={pageStyles.topContainer}>
        <div style={pageStyles.welcomeCard}>
          <h2>Bienvenue sur SenKOPAR, Moussa ! 👋</h2>
          <p>Voici un résumé de l'activité de votre commerce pour aujourd'hui.</p>
        </div>

        {/* 🏪 Sélecteur de Boutique branché sur ton State Global */}
        <div style={pageStyles.selectorCard}>
          <label htmlFor="boutique-select" style={pageStyles.label}>
            Boutique active :
          </label>
          {statutChargement ? (
            <p style={pageStyles.loadingText}>Chargement des points de vente...</p>
          ) : (
            <select
              id="boutique-select"
              value={boutiqueSelectionnee ? boutiqueSelectionnee.id : ''}
              onChange={handleBoutiqueChange}
              style={pageStyles.select}
            >
              {boutiques.length === 0 ? (
                <option value="">Aucune boutique trouvée</option>
              ) : (
                boutiques.map((boutique) => (
                  <option key={boutique.id} value={boutique.id}>
                    🏪 {boutique.nom_boutique}
                  </option>
                ))
              )}
            </select>
          )}
        </div>
      </div>

      {/* Les statistiques affichent dynamiquement le nom de "boutiqueSelectionnee" */}
      <div style={pageStyles.statsGrid}>
        <div style={{ ...pageStyles.statCard, borderLeft: '5px solid #2ecc71' }}>
          <h3>Ventes du Jour 🛒</h3>
          <p style={pageStyles.statNumber}>45 000 FCFA</p>
          <small style={pageStyles.shopIndicator}>
            {boutiqueSelectionnee ? boutiqueSelectionnee.nom_boutique : 'Global'}
          </small>
        </div>
        
        <div style={{ ...pageStyles.statCard, borderLeft: '5px solid #e67e22' }}>
          <h3>Alerte Stock 📦</h3>
          <p style={pageStyles.statNumber}>3 Produits épuisés</p>
          <small style={pageStyles.shopIndicator}>
            {boutiqueSelectionnee ? boutiqueSelectionnee.nom_boutique : 'Global'}
          </small>
        </div>

        <div style={{ ...pageStyles.statCard, borderLeft: '5px solid #e74c3c' }}>
          <h3>Crédits Clients 💳</h3>
          <p style={pageStyles.statNumber}>12 500 FCFA</p>
          <small style={pageStyles.shopIndicator}>
            {boutiqueSelectionnee ? boutiqueSelectionnee.nom_boutique : 'Global'}
          </small>
        </div>
      </div>
    </DashboardLayout>
  );
}

const pageStyles = {
  topContainer: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
    marginBottom: '24px',
  },
  welcomeCard: {
    flex: '2 1 400px',
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
  },
  selectorCard: {
    flex: '1 1 250px',
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  label: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#7f8c8d',
    marginBottom: '8px',
  },
  select: {
    padding: '10px',
    fontSize: '15px',
    borderRadius: '6px',
    border: '1px solid #bdc3c7',
    backgroundColor: '#f8f9fa',
    color: '#2c3e50',
    outline: 'none',
    cursor: 'pointer',
    fontWeight: '500',
  },
  loadingText: {
    fontSize: '14px',
    color: '#7f8c8d',
    fontStyle: 'italic',
  },
  statsGrid: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
  },
  statCard: {
    flex: '1 1 250px',
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.02)',
    display: 'flex',
    flexDirection: 'column',
  },
  statNumber: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#2c3e50',
    margin: '10px 0 5px 0',
  },
  shopIndicator: {
    fontSize: '12px',
    color: '#95a5a6',
    fontStyle: 'italic',
    marginTop: 'auto',
  }
};

export default DashboardPage;