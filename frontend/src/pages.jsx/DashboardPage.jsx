import React, { useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { useSelector, useDispatch } from 'react-redux';
import { chargerBoutiquesUtilisateur, selectionnerBoutique } from '../features/shops/shopsSlice';
// 1. Importation du Thunk des statistiques
import {chargerStatistiquesBoutique} from '../features/shops/satisticsSlice';

function DashboardPage() {
  const dispatch = useDispatch();
  
  // Récupération des données des boutiques (State Global Shops)
  const { boutiques, boutiqueSelectionnee, statutChargement } = useSelector((state) => state.shops);
  
  // 2. Récupération des données du slice statistiques (State Global Statistics)
  const { statistiques, statutChargement: chargementStats, erreurShops } = useSelector((state) => state.statistics);

  // Chargement initial des boutiques de l'utilisateur
  useEffect(() => {
    if (boutiques.length === 0) {
      dispatch(chargerBoutiquesUtilisateur());
    }
  }, [dispatch, boutiques.length]);

  // 3. Rechargement automatique des statistiques à chaque changement de boutique active
  useEffect(() => {
    if (boutiqueSelectionnee?.id) {
      dispatch(chargerStatistiquesBoutique()); // Tu peux passer { annee, mois } ici si nécessaire
    }
  }, [dispatch, boutiqueSelectionnee]);

  // Gestion du sélecteur de boutique
  const handleBoutiqueChange = (event) => {
    const boutiqueId = parseInt(event.target.value, 10);
    const boutiqueTrouvee = boutiques.find((b) => b.id === boutiqueId);
    
    if (boutiqueTrouvee) {
      dispatch(selectionnerBoutique(boutiqueTrouvee));
    }
  };

  // Formatage des nombres pour l'affichage monétaire (FCFA)
  const formaterDevise = (valeur) => {
    return valeur ? new Intl.NumberFormat('fr-FR').format(valeur) + " FCFA" : "0 FCFA";
  };

  return (
    <DashboardLayout>
      <div style={pageStyles.topContainer}>
        <div style={pageStyles.welcomeCard}>
          <h2>Bienvenue sur SenKOPAR, Moussa ! 👋</h2>
          <p>Voici un résumé de l'activité de votre commerce pour aujourd'hui.</p>
        </div>

        {/* Sélecteur de Boutique */}
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
                <option value="" disabled>Choisir un point de vente</option>
              )}
              {boutiques.map((boutique) => (
                <option key={boutique.id} value={boutique.id}>
                  🏪 {boutique.nom_boutique}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* État de chargement ou d'erreur spécifique aux statistiques */}
      {chargementStats && <p style={pageStyles.infoText}>Mise à jour des statistiques...</p>}
      {erreurShops && <p style={pageStyles.errorText}>⚠️ {erreurShops}</p>}

      {/* Grille principale des cartes financières */}
      <div style={pageStyles.statsGrid}>
        <div style={{ ...pageStyles.statCard, borderLeft: '5px solid #2ecc71' }}>
          <h3>Chiffre d'Affaires 🛒</h3>
          <p style={pageStyles.statNumber}>
            {formaterDevise(statistiques?.chiffre_affaires)}
          </p>
          <small style={pageStyles.shopIndicator}>
            {boutiqueSelectionnee ? boutiqueSelectionnee.nom_boutique : 'Aucune boutique'}
          </small>
        </div>
        
        <div style={{ ...pageStyles.statCard, borderLeft: '5px solid #e67e22' }}>
          <h3>Alerte Stock 📦</h3>
          <p style={pageStyles.statNumber}>
            {statistiques?.produits_rupture_stock ? statistiques.produits_rupture_stock.length : 0} Rruptures
          </p>
          <small style={pageStyles.shopIndicator}>
            Total en stock : {statistiques?.stock_total || 0} articles
          </small>
        </div>

        <div style={{ ...pageStyles.statCard, borderLeft: '5px solid #e74c3c' }}>
          <h3>Dettes Globales 💳</h3>
          <p style={pageStyles.statNumber}>
            {formaterDevise(statistiques?.dette_totale)}
          </p>
          <small style={pageStyles.shopIndicator}>
            Règlements partiels : {formaterDevise(statistiques?.dette_partielle)}
          </small>
        </div>
      </div>

      {/* Sections listes (Ruptures de stock & Produits les plus vendus) */}
      <div style={pageStyles.listsContainer}>
        {/* Colonne des Ruptures de Stock */}
        <div style={pageStyles.listBlock}>
          <h3 style={{ color: '#c0392b' }}>⚠️ Produits en rupture de stock</h3>
          {statistiques?.produits_rupture_stock && statistiques.produits_rupture_stock.length > 0 ? (
            <ul style={pageStyles.ul}>
              {statistiques.produits_rupture_stock.map((produit, index) => (
                <li key={index} style={pageStyles.liItem}>{produit}</li>
              ))}
            </ul>
          ) : (
            <p style={pageStyles.emptyText}>Aucun produit en rupture. Stock sain ! ✨</p>
          )}
        </div>

        {/* Colonne des Tops Ventes */}
        <div style={pageStyles.listBlock}>
          <h3 style={{ color: '#2980b9' }}>🔥 Produits les plus vendus</h3>
          {statistiques?.produits_plus_vendus && statistiques.produits_plus_vendus.length > 0 ? (
            <ul style={pageStyles.ul}>
              {statistiques.produits_plus_vendus.map((produit, index) => (
                <li key={index} style={pageStyles.liItem}>🏆 {produit}</li>
              ))}
            </ul>
          ) : (
            <p style={pageStyles.emptyText}>Aucune donnée de vente disponible.</p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

// Styles enrichis pour l'affichage des listes de données
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
  infoText: {
    fontSize: '14px',
    color: '#2980b9',
    marginBottom: '15px',
  },
  errorText: {
    fontSize: '14px',
    color: '#e74c3c',
    marginBottom: '15px',
    fontWeight: 'bold',
  },
  statsGrid: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
    marginBottom: '24px',
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
  },
  listsContainer: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
  },
  listBlock: {
    flex: '1 1 400px',
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.02)',
  },
  ul: {
    listStyleType: 'none',
    padding: 0,
    marginTop: '15px',
  },
  liItem: {
    padding: '10px 12px',
    borderBottom: '1px solid #f1f2f6',
    color: '#34495e',
    fontSize: '14px',
  },
  emptyText: {
    color: '#7f8c8d',
    fontStyle: 'italic',
    fontSize: '14px',
    marginTop: '15px',
  }
};

export default DashboardPage;