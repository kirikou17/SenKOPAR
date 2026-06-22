import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DashboardLayout from '../layouts/DashboardLayout';
import { 
  chargerTousLesProduits,
  ajouterNouveauProduit
} from '../features/stocks/stocksSlice';
import { chargerFournisseurs, ajouterFournisseur } from '../features/stocks/fournisseurSlice'; 
import { enregistrerMouvementStock } from '../features/stocks/mouvementsSlice';

/* ─── STYLES MODERNES ET ÉPURÉS ─── */
const GLOBAL_CSS = `
  .st-app {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
    color: #1A202C;
  }

  .st-page {
    max-width: 1200px;
    margin: 0 auto;
  }

  .st-tabs {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 4px;
    background: #F7FAFC;
    border: 1px solid #E2E8F0;
    padding: 4px;
    margin-bottom: 24px;
  }
  .st-tab {
    padding: 12px 16px;
    border: none;
    background: transparent;
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    color: #718096;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.2s;
    font-family: inherit;
  }
  .st-tab:hover {
    background: rgba(74,144,217,0.05);
  }
  .st-tab.active {
    background: #FFFFFF;
    border: 1px solid #E2E8F0;
    color: #2D3748;
  }
  .st-tab .icon { font-size: 18px; }
  .st-tab .badge {
    font-size: 10px;
    font-weight: 700;
    padding: 2px 8px;
    background: #EDF2F7;
    color: #718096;
  }
  .st-tab.active .badge {
    background: #EBF5FF;
    color: #4A90D9;
  }

  .st-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    margin-bottom: 24px;
  }
  .st-stat {
    background: #FFFFFF;
    border: 1px solid #E2E8F0;
    padding: 16px 20px;
  }
  .st-stat .label {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #A0AEC0;
  }
  .st-stat .value {
    font-size: 24px;
    font-weight: 800;
    color: #2D3748;
    margin-top: 4px;
  }
  .st-stat .value .currency {
    font-size: 14px;
    font-weight: 500;
    color: #A0AEC0;
  }
  .st-stat .value.danger { color: #EF4444; }
  .st-stat .value.success { color: #1A7A3A; }

  .st-card {
    background: #FFFFFF;
    border: 1px solid #E2E8F0;
    overflow: hidden;
  }
  .st-card-header {
    padding: 16px 20px;
    background: #F7FAFC;
    border-bottom: 1px solid #E2E8F0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
  }
  .st-card-title {
    font-size: 14px;
    font-weight: 600;
    color: #2D3748;
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0;
  }
  .st-card-title .count {
    background: #EDF2F7;
    padding: 0 10px;
    font-size: 12px;
    font-weight: 600;
    color: #718096;
  }
  .st-card-subtitle {
    font-size: 13px;
    color: #718096;
  }
  .st-card-body {
    padding: 20px;
  }

  .st-table-wrap {
    overflow-x: auto;
    margin: 0 -20px;
    padding: 0 20px;
  }
  .st-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
  }
  .st-table th {
    padding: 12px 8px;
    text-align: left;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #A0AEC0;
    border-bottom: 1.5px solid #EDF2F7;
  }
  .st-table td {
    padding: 12px 8px;
    border-bottom: 1px solid #EDF2F7;
    color: #2D3748;
    vertical-align: middle;
  }
  .st-table tr:hover td {
    background: #F7FAFC;
  }
  .st-table .empty {
    text-align: center;
    color: #A0AEC0;
    padding: 32px !important;
  }
  .st-table .product-name {
    font-weight: 600;
  }
  .st-table .qty {
    font-weight: 700;
  }
  .st-table .price {
    font-weight: 500;
  }
  .st-table .margin {
    font-weight: 600;
    color: #1A7A3A;
  }

  .st-badge {
    padding: 4px 10px;
    font-size: 11px;
    font-weight: 600;
    display: inline-block;
    border: 1px solid;
  }
  .st-badge.success {
    background: #F0FDF4;
    border-color: #BBF7D0;
    color: #1A7A3A;
  }
  .st-badge.danger {
    background: #FDF2F2;
    border-color: #FECACA;
    color: #9B1C1C;
  }

  .st-form {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
  }
  @media (min-width: 640px) {
    .st-form {
      grid-template-columns: repeat(2, 1fr);
    }
    .st-form .full-width {
      grid-column: 1 / -1;
    }
  }

  .st-field {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .st-field .label {
    font-size: 13px;
    font-weight: 600;
    color: #4A5568;
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .st-field .label .required {
    color: #EF4444;
  }
  .st-field .label .hint {
    font-weight: 400;
    font-size: 12px;
    color: #A0AEC0;
    margin-left: auto;
  }
  .st-field .input,
  .st-field .select {
    width: 100%;
    padding: 10px 14px;
    border: 1.5px solid #E2E8F0;
    font-size: 14px;
    color: #2D3748;
    background: #FFFFFF;
    transition: all 0.2s;
    font-family: inherit;
  }
  .st-field .input:hover,
  .st-field .select:hover {
    border-color: #CBD5E1;
  }
  .st-field .input:focus,
  .st-field .select:focus {
    border-color: #4A90D9;
    box-shadow: 0 0 0 3px rgba(74,144,217,0.1);
    outline: none;
  }
  .st-field .input::placeholder {
    color: #A0AEC0;
  }
  .st-field .select {
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%234A5568' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    padding-right: 36px;
  }

  .st-input-group {
    display: flex;
    gap: 8px;
  }
  .st-input-group .input { flex: 1; }
  .st-input-group .btn-icon {
    padding: 0 16px;
    background: #F7FAFC;
    border: 1.5px solid #E2E8F0;
    cursor: pointer;
    font-size: 18px;
    font-weight: 600;
    color: #4A5568;
    transition: all 0.2s;
    min-width: 44px;
    font-family: inherit;
  }
  .st-input-group .btn-icon:hover {
    background: #EDF2F7;
    border-color: #CBD5E1;
  }

  .st-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 8px;
  }
  .st-actions .btn {
    padding: 10px 24px;
    border: none;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    font-family: inherit;
    color: #FFFFFF;
  }
  .st-actions .btn:hover:not(:disabled) {
    filter: brightness(1.05);
    transform: translateY(-1px);
  }
  .st-actions .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
  .st-actions .btn-primary {
    background: #4A90D9;
  }
  .st-actions .btn-success {
    background: #1A7A3A;
  }

  .st-alert {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    border: 1px solid;
    margin-bottom: 20px;
  }
  .st-alert.error {
    background: #FDF2F2;
    border-color: #FECACA;
    color: #9B1C1C;
  }
  .st-alert .icon { font-size: 18px; }
  .st-alert .body { flex: 1; }
  .st-alert .body strong { font-weight: 600; }

  .st-modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(15, 23, 42, 0.5);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    padding: 20px;
  }
  .st-modal {
    background: #FFFFFF;
    width: 100%;
    max-width: 520px;
    border: 1px solid #E2E8F0;
    box-shadow: 0 24px 48px -12px rgba(0,0,0,0.25);
    max-height: 90vh;
    display: flex;
    flex-direction: column;
  }
  .st-modal-header {
    padding: 16px 24px;
    background: #F7FAFC;
    border-bottom: 1px solid #E2E8F0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-shrink: 0;
  }
  .st-modal-header h3 {
    font-size: 16px;
    font-weight: 700;
    color: #2D3748;
    margin: 0;
  }
  .st-modal-header .close {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #A0AEC0;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    font-family: inherit;
  }
  .st-modal-header .close:hover {
    color: #2D3748;
    background: #EDF2F7;
  }
  .st-modal-body {
    padding: 24px;
    overflow-y: auto;
    flex: 1;
  }
  .st-modal-tabs {
    display: flex;
    border-bottom: 1px solid #E2E8F0;
    margin-bottom: 20px;
    flex-shrink: 0;
  }
  .st-modal-tab {
    flex: 1;
    padding: 12px;
    background: none;
    border: none;
    border-bottom: 2px solid transparent;
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    color: #718096;
    transition: all 0.2s;
    font-family: inherit;
  }
  .st-modal-tab:hover {
    color: #4A90D9;
  }
  .st-modal-tab.active {
    color: #4A90D9;
    border-bottom-color: #4A90D9;
  }

  .st-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 0;
    margin: 0;
    list-style: none;
  }
  .st-list .item {
    padding: 12px 16px;
    background: #F7FAFC;
    border: 1px solid #E2E8F0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: all 0.2s;
  }
  .st-list .item:hover {
    background: #EDF2F7;
  }
  .st-list .item .info h4 {
    margin: 0 0 2px 0;
    font-size: 14px;
    font-weight: 600;
    color: #2D3748;
  }
  .st-list .item .info p {
    margin: 0;
    font-size: 13px;
    color: #718096;
  }
  .st-list .item .btn-select {
    padding: 6px 16px;
    background: #4A90D9;
    color: #FFFFFF;
    border: 1px solid #4A90D9;
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
    transition: all 0.2s;
    font-family: inherit;
  }
  .st-list .item .btn-select:hover {
    background: #3A7BC8;
  }
  .st-list .empty {
    text-align: center;
    color: #A0AEC0;
    font-size: 14px;
    padding: 20px 0;
  }

  @media (max-width: 480px) {
    .st-page { padding: 16px; }
    .st-tab .label { display: none; }
    .st-tab { padding: 10px; }
    .st-card-body { padding: 16px; }
    .st-stats { grid-template-columns: 1fr; }
  }
`;

const StocksPage = () => {
  const dispatch = useDispatch();

  const { produits = [], statutChargement, erreurStock } = useSelector((s) => s.stocks);
  const { fournisseursdata = [], loading } = useSelector((s) => s.fournisseurs);
  const { loadingmouvements } = useSelector((s) => s.mouvements);
  const { boutiqueSelectionnee } = useSelector((s) => s.shops);

  const [activeTab, setActiveTab] = useState('INVENTAIRE');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState('CREER');
  
  const [newSupplier, setNewSupplier] = useState({
    prenom: '', nom: '', tel: '', adresse: ''
  });

  const [newProduct, setNewProduct] = useState({
    nom: '', stock: 0, prixAchat: '', prixVente: '', alerte: 5, fournisseur: ''
  });

  const [movement, setMovement] = useState({
    produitId: '', type: 'ENTREE', quantite: 1, motif: '', nouveauPrixAchat: '', nouveauPrixVente: ''
  });

  const stats = useMemo(() => {
    const totalAchat = produits.reduce((sum, p) => sum + (p.stock_quantite * p.prix_d_achat), 0);
    const totalVente = produits.reduce((sum, p) => sum + (p.stock_quantite * p.prix_de_vente), 0);
    const benefice = totalVente - totalAchat;
    const enAlerte = produits.filter(p => p.stock_quantite <= p.alert_stock).length;
    return { totalAchat, benefice, enAlerte };
  }, [produits]);

  useEffect(() => {
    dispatch(chargerFournisseurs());
    if (boutiqueSelectionnee?.id) {
      dispatch(chargerTousLesProduits());
    }
  }, [dispatch, boutiqueSelectionnee]);

  const handleCreateProduct = useCallback((e) => {
    e.preventDefault();
    if (!boutiqueSelectionnee?.id) {
      alert('Veuillez sélectionner une boutique');
      return;
    }
    const payload = {
      nom_produit: newProduct.nom,
      stock_quantite: Number(newProduct.stock),
      prix_d_achat: Number(newProduct.prixAchat),
      prix_de_vente: Number(newProduct.prixVente),
      alert_stock: Number(newProduct.alerte),
      fournisseur: newProduct.fournisseur ? Number(newProduct.fournisseur) : null,
      boutique: boutiqueSelectionnee.id
    };
    dispatch(ajouterNouveauProduit(payload))
      .unwrap()
      .then(() => {
        dispatch(chargerTousLesProduits());
        setActiveTab('INVENTAIRE');
        setNewProduct({ nom: '', stock: 0, prixAchat: '', prixVente: '', alerte: 5, fournisseur: '' });
      })
      .catch(console.error);
  }, [newProduct, boutiqueSelectionnee, dispatch]);

  const handleCreateSupplier = useCallback((e) => {
    e.preventDefault();
    const payload = {
      prenom_fournisseur: newSupplier.prenom,
      nom_fournisseur: newSupplier.nom,
      tel_fournisseur: newSupplier.tel,
      adresse_fournisseur: newSupplier.adresse,
      boutique: boutiqueSelectionnee?.id
    };
    dispatch(ajouterFournisseur(payload))
      .unwrap()
      .then((supplier) => {
        if (supplier?.id) {
          setNewProduct(prev => ({ ...prev, fournisseur: supplier.id }));
        }
        setNewSupplier({ prenom: '', nom: '', tel: '', adresse: '' });
        setModalOpen(false);
      })
      .catch(console.error);
  }, [newSupplier, boutiqueSelectionnee, dispatch]);

  const handleMovement = useCallback((e) => {
    e.preventDefault();
    const payload = {
      produit: Number(movement.produitId),
      type_mouvement: movement.type,
      quantite: Number(movement.quantite),
      motif: movement.motif || null,
      nouveau_prix_achat: movement.nouveauPrixAchat ? Number(movement.nouveauPrixAchat) : null,
      nouveau_prix_vente: movement.nouveauPrixVente ? Number(movement.nouveauPrixVente) : null,
    };
    dispatch(enregistrerMouvementStock(payload))
      .unwrap()
      .then(() => {
        dispatch(chargerTousLesProduits());
        setActiveTab('INVENTAIRE');
        setMovement({ produitId: '', type: 'ENTREE', quantite: 1, motif: '', nouveauPrixAchat: '', nouveauPrixVente: '' });
      })
      .catch(console.error);
  }, [movement, dispatch]);

  const tabs = [
    { key: 'INVENTAIRE', icon: '📦', label: 'État des stocks' },
    { key: 'NOUVEAU_PRODUIT', icon: '➕', label: 'Nouvel article' },
    { key: 'MOUVEMENT', icon: '🔄', label: 'Mouvement' },
  ];

  return (
    <DashboardLayout>
      <style>{GLOBAL_CSS}</style>

      <div className="st-app">
        <div className="st-page">
          {/* TABS */}
          <div className="st-tabs">
            {tabs.map(tab => (
              <button
                key={tab.key}
                className={`st-tab ${activeTab === tab.key ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.key)}
              >
                <span className="icon">{tab.icon}</span>
                <span className="label">{tab.label}</span>
                {tab.key === 'INVENTAIRE' && (
                  <span className="badge">{produits.length}</span>
                )}
              </button>
            ))}
          </div>

          {/* ERROR */}
          {erreurStock && (
            <div className="st-alert error">
              <span className="icon">⚠️</span>
              <div className="body">
                <strong>Erreur :</strong> {erreurStock}
              </div>
            </div>
          )}

          {/* TAB: INVENTAIRE */}
          {activeTab === 'INVENTAIRE' && (
            <>
              <div className="st-stats">
                <div className="st-stat">
                  <div className="label">Valeur du stock (achat)</div>
                  <div className="value">
                    {stats.totalAchat.toLocaleString()}
                    <span className="currency"> FCFA</span>
                  </div>
                </div>
                <div className="st-stat">
                  <div className="label">Bénéfice latent</div>
                  <div className="value success">
                    +{stats.benefice.toLocaleString()}
                    <span className="currency"> FCFA</span>
                  </div>
                </div>
                <div className="st-stat">
                  <div className="label">Alertes rupture</div>
                  <div className={`value ${stats.enAlerte > 0 ? 'danger' : ''}`}>
                    {stats.enAlerte} {stats.enAlerte > 1 ? 'articles' : 'article'}
                  </div>
                </div>
              </div>

              <div className="st-card">
                <div className="st-card-header">
                  <h3 className="st-card-title">
                    📋 Catalogue des articles
                    <span className="count">{produits.length}</span>
                  </h3>
                  <span className="st-card-subtitle">
                    {produits.filter(p => p.stock_quantite > 0).length} en stock
                  </span>
                </div>
                <div className="st-card-body">
                  <div className="st-table-wrap">
                    <table className="st-table">
                      <thead>
                        <tr>
                          <th>Désignation</th>
                          <th style={{ textAlign: 'center' }}>Qté</th>
                          <th style={{ textAlign: 'right' }}>Prix achat</th>
                          <th style={{ textAlign: 'right' }}>Prix vente</th>
                          <th style={{ textAlign: 'right' }}>Marge</th>
                          <th style={{ textAlign: 'center' }}>Statut</th>
                        </tr>
                      </thead>
                      <tbody>
                        {produits.length === 0 ? (
                          <tr>
                            <td colSpan="6" className="empty">Aucun produit en stock</td>
                          </tr>
                        ) : (
                          produits.map(p => {
                            const isAlert = p.stock_quantite <= p.alert_stock;
                            return (
                              <tr key={p.id}>
                                <td className="product-name">{p.nom_produit}</td>
                                <td className="qty" style={{ textAlign: 'center' }}>
                                  {p.stock_quantite}
                                </td>
                                <td className="price" style={{ textAlign: 'right' }}>
                                  {p.prix_d_achat.toLocaleString()}
                                </td>
                                <td className="price" style={{ textAlign: 'right' }}>
                                  {p.prix_de_vente.toLocaleString()}
                                </td>
                                <td className="margin" style={{ textAlign: 'right' }}>
                                  +{(p.prix_de_vente - p.prix_d_achat).toLocaleString()}
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                  <span className={`st-badge ${isAlert ? 'danger' : 'success'}`}>
                                    {isAlert ? '⚠️ Alerte' : '✅ OK'}
                                  </span>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* TAB: NOUVEAU PRODUIT */}
          {activeTab === 'NOUVEAU_PRODUIT' && (
            <div className="st-card">
              <div className="st-card-header">
                <h3 className="st-card-title">➕ Nouvel article</h3>
              </div>
              <div className="st-card-body">
                <form onSubmit={handleCreateProduct} className="st-form">
                  <div className="st-field full-width">
                    <label className="label">
                      Désignation <span className="required">*</span>
                    </label>
                    <input
                      className="input"
                      type="text"
                      placeholder="Ex: Sac de riz 50kg"
                      required
                      value={newProduct.nom}
                      onChange={(e) => setNewProduct({ ...newProduct, nom: e.target.value })}
                    />
                  </div>

                  <div className="st-field">
                    <label className="label">
                      Stock initial <span className="required">*</span>
                    </label>
                    <input
                      className="input"
                      type="number"
                      min="0"
                      placeholder="0"
                      required
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                    />
                  </div>

                  <div className="st-field">
                    <label className="label">
                      Prix d'achat <span className="required">*</span>
                    </label>
                    <input
                      className="input"
                      type="number"
                      min="0"
                      placeholder="Ex: 17500"
                      required
                      value={newProduct.prixAchat}
                      onChange={(e) => setNewProduct({ ...newProduct, prixAchat: e.target.value })}
                    />
                  </div>

                  <div className="st-field">
                    <label className="label">
                      Prix de vente <span className="required">*</span>
                    </label>
                    <input
                      className="input"
                      type="number"
                      min="0"
                      placeholder="Ex: 22000"
                      required
                      value={newProduct.prixVente}
                      onChange={(e) => setNewProduct({ ...newProduct, prixVente: e.target.value })}
                    />
                  </div>

                  <div className="st-field">
                    <label className="label">
                      Seuil d'alerte <span className="required">*</span>
                    </label>
                    <input
                      className="input"
                      type="number"
                      min="0"
                      placeholder="5"
                      required
                      value={newProduct.alerte}
                      onChange={(e) => setNewProduct({ ...newProduct, alerte: e.target.value })}
                    />
                  </div>

                  <div className="st-field">
                    <label className="label">Fournisseur</label>
                    <div className="st-input-group">
                      <select
                        className="select"
                        value={newProduct.fournisseur}
                        onChange={(e) => setNewProduct({ ...newProduct, fournisseur: e.target.value })}
                      >
                        <option value="">— Aucun —</option>
                        {fournisseursdata.map(f => (
                          <option key={f.id} value={f.id}>
                            {f.prenom_fournisseur} {f.nom_fournisseur}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        className="btn-icon"
                        title="Gérer les fournisseurs"
                        onClick={() => { setModalTab('CREER'); setModalOpen(true); }}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="full-width st-actions">
                    <button type="submit" className="btn btn-success">
                      🚀 Enregistrer l'article
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* TAB: MOUVEMENT */}
          {activeTab === 'MOUVEMENT' && (
            <div className="st-card">
              <div className="st-card-header">
                <h3 className="st-card-title">🔄 Mouvement de stock</h3>
              </div>
              <div className="st-card-body">
                <form onSubmit={handleMovement} className="st-form">
                  <div className="st-field full-width">
                    <label className="label">
                      Produit <span className="required">*</span>
                    </label>
                    <select
                      className="select"
                      required
                      value={movement.produitId}
                      onChange={(e) => setMovement({ ...movement, produitId: e.target.value })}
                    >
                      <option value="">— Sélectionner —</option>
                      {produits.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.nom_produit} (Stock: {p.stock_quantite})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="st-field">
                    <label className="label">Type <span className="required">*</span></label>
                    <select
                      className="select"
                      value={movement.type}
                      onChange={(e) => setMovement({ 
                        ...movement, 
                        type: e.target.value,
                        nouveauPrixAchat: '',
                        nouveauPrixVente: ''
                      })}
                    >
                      <option value="ENTREE">📦 Entrée</option>
                      <option value="PERTE">⚠️ Perte</option>
                      <option value="RETOUR">🔄 Retour</option>
                    </select>
                  </div>

                  <div className="st-field">
                    <label className="label">
                      Quantité <span className="required">*</span>
                    </label>
                    <input
                      className="input"
                      type="number"
                      min="1"
                      required
                      value={movement.quantite}
                      onChange={(e) => setMovement({ ...movement, quantite: e.target.value })}
                    />
                  </div>

                  <div className="st-field">
                    <label className="label">Motif</label>
                    <input
                      className="input"
                      type="text"
                      placeholder="Ex: Réapprovisionnement"
                      value={movement.motif}
                      onChange={(e) => setMovement({ ...movement, motif: e.target.value })}
                    />
                  </div>

                  {movement.type === 'ENTREE' && (
                    <>
                      <div className="st-field">
                        <label className="label">
                          Nouveau prix d'achat
                          <span className="hint">optionnel</span>
                        </label>
                        <input
                          className="input"
                          type="number"
                          placeholder="Inchangé si vide"
                          value={movement.nouveauPrixAchat}
                          onChange={(e) => setMovement({ ...movement, nouveauPrixAchat: e.target.value })}
                        />
                      </div>
                      <div className="st-field">
                        <label className="label">
                          Nouveau prix de vente
                          <span className="hint">optionnel</span>
                        </label>
                        <input
                          className="input"
                          type="number"
                          placeholder="Inchangé si vide"
                          value={movement.nouveauPrixVente}
                          onChange={(e) => setMovement({ ...movement, nouveauPrixVente: e.target.value })}
                        />
                      </div>
                    </>
                  )}

                  <div className="full-width st-actions">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loadingmouvements || !movement.produitId}
                    >
                      {loadingmouvements ? '⏳ Enregistrement...' : '💾 Appliquer le mouvement'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL FOURNISSEURS */}
      {modalOpen && (
        <div className="st-modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="st-modal" onClick={(e) => e.stopPropagation()}>
            <div className="st-modal-header">
              <h3>🚚 Gestion des fournisseurs</h3>
              <button className="close" onClick={() => setModalOpen(false)}>✕</button>
            </div>
            <div className="st-modal-tabs">
              <button
                className={`st-modal-tab ${modalTab === 'CREER' ? 'active' : ''}`}
                onClick={() => setModalTab('CREER')}
              >
                ➕ Nouveau
              </button>
              <button
                className={`st-modal-tab ${modalTab === 'LISTE' ? 'active' : ''}`}
                onClick={() => setModalTab('LISTE')}
              >
                📋 Sélectionner ({fournisseursdata.length})
              </button>
            </div>
            <div className="st-modal-body">
              {modalTab === 'CREER' ? (
                <form onSubmit={handleCreateSupplier} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div className="st-field">
                      <label className="label">Prénom <span className="required">*</span></label>
                      <input
                        className="input"
                        type="text"
                        required
                        placeholder="Ex: Mamadou"
                        value={newSupplier.prenom}
                        onChange={(e) => setNewSupplier({ ...newSupplier, prenom: e.target.value })}
                      />
                    </div>
                    <div className="st-field">
                      <label className="label">Nom <span className="required">*</span></label>
                      <input
                        className="input"
                        type="text"
                        required
                        placeholder="Ex: Diallo"
                        value={newSupplier.nom}
                        onChange={(e) => setNewSupplier({ ...newSupplier, nom: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="st-field">
                    <label className="label">Téléphone</label>
                    <input
                      className="input"
                      type="tel"
                      placeholder="77 123 45 67"
                      value={newSupplier.tel}
                      onChange={(e) => setNewSupplier({ ...newSupplier, tel: e.target.value })}
                    />
                  </div>
                  <div className="st-field">
                    <label className="label">Adresse</label>
                    <input
                      className="input"
                      type="text"
                      placeholder="Ex: Marché Central, Dakar"
                      value={newSupplier.adresse}
                      onChange={(e) => setNewSupplier({ ...newSupplier, adresse: e.target.value })}
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-success"
                    style={{ width: '100%', marginTop: '4px' }}
                    disabled={loading}
                  >
                    {loading ? '⏳ Création...' : '✅ Créer le fournisseur'}
                  </button>
                </form>
              ) : (
                <ul className="st-list">
                  {fournisseursdata.length > 0 ? (
                    fournisseursdata.map(f => (
                      <li key={f.id} className="item">
                        <div className="info">
                          <h4>{f.prenom_fournisseur} {f.nom_fournisseur}</h4>
                          <p>
                            📞 {f.tel_fournisseur || 'Non renseigné'}
                            {f.adresse_fournisseur && ` · 📍 ${f.adresse_fournisseur}`}
                          </p>
                        </div>
                        <button
                          className="btn-select"
                          onClick={() => {
                            setNewProduct(prev => ({ ...prev, fournisseur: f.id }));
                            setModalOpen(false);
                          }}
                        >
                          Choisir
                        </button>
                      </li>
                    ))
                  ) : (
                    <li className="empty">Aucun fournisseur enregistré</li>
                  )}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default StocksPage;