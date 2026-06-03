import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DashboardLayout from '../layouts/DashboardLayout';
import { 
  chargerTousLesProduits,
} from '../features/stocks/stocksSlice';
import { chargerBoutiquesUtilisateur, selectionnerBoutique } from '../features/shops/shopsSlice';
import { chargerFournisseurs, ajouterFournisseur } from '../features/stocks/fournisseurSlice'; 
import { ajouterNouveauProduit } from '../features/stocks/stocksSlice';
import { enregistrerMouvementStock } from '../features/stocks/mouvementsSlice'; // 👈 Remplacer par le chemin de votre Slice

/* ─── STYLES GLOBAUX CSS ─── */
const STOCK_CSS = `
  .st-page { padding: 20px 16px; max-width: 1100px; margin: 0 auto; }
  @media (min-width: 640px) { .st-page { padding: 28px 24px; } }

  /* Tabs Navigation */
  .st-tabs { display: flex; background: #f1f5f9; border-radius: 10px; padding: 4px; gap: 3px; margin-bottom: 24px; }
  .st-tab {
    flex: 1; padding: 10px; border: none; border-radius: 7px;
    background: transparent; cursor: pointer; font-size: 13px; font-weight: 600;
    color: #64748b; display: flex; align-items: center; justify-content: center;
    gap: 6px; transition: all 0.15s ease;
  }
  .st-tab.active { background: #fff; box-shadow: 0 1px 4px rgba(0,0,0,0.08); }

  /* Dashboard Stats Widgets */
  .st-stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 20px; }
  .st-stat-card { background: #fff; border: 1px solid #e8edf2; border-radius: 10px; padding: 16px; display: flex; flex-direction: column; gap: 4px; }
  .st-stat-label { font-size: 11px; text-transform: uppercase; color: #94a3b8; font-weight: 700; letter-spacing: 0.05em; }
  .st-stat-value { font-size: 20px; font-weight: 800; color: #1e293b; }

  /* Layouts */
  .st-card { background: #fff; border-radius: 10px; border: 1px solid #e8edf2; padding: 20px; margin-bottom: 20px; }
  .st-card-title { font-size: 14px; font-weight: 700; color: #1e293b; margin: 0 0 16px 0; display: flex; justify-content: space-between; align-items: center; }

  /* Tables */
  .st-table-wrapper { overflow-x: auto; margin: 0 -20px; padding: 0 20px; }
  .st-table { width: 100%; border-collapse: collapse; text-align: left; font-size: 13px; }
  .st-table th { padding: 12px; border-bottom: 2px solid #f1f5f9; color: #64748b; font-weight: 600; }
  .st-table td { padding: 12px; border-bottom: 1px solid #f1f5f9; color: #334155; vertical-align: middle; }
  .st-table tr:hover { background: #f8fafc; }

  /* Badges Alerte Stock */
  .badge { padding: 4px 8px; border-radius: 20px; font-size: 11px; font-weight: 600; display: inline-block; }
  .badge-success { background: #d4edda; color: #155724; }
  .badge-danger { background: #f8d7da; color: #721c24; }

  /* Forms & Fields */
  .st-grid-form { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 14px; }
  .st-field { display: flex; flex-direction: column; gap: 5px; position: relative; }
  .st-label { font-size: 12px; font-weight: 600; color: #475569; }
  .st-input, .st-select {
    width: 100%; padding: 9px 11px; border-radius: 7px; border: 1px solid #e2e8f0;
    font-size: 13px; color: #1e293b; background: #fafafa; box-sizing: border-box; outline: none;
  }
  .st-input:focus, .st-select:focus { border-color: #3498db; background: #fff; }

  /* Bouton d'action à côté du select */
  .st-input-group { display: flex; gap: 6px; width: 100%; }
  .st-btn-action {
    padding: 0 12px; background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 7px;
    cursor: pointer; font-size: 15px; display: flex; align-items: center; justify-content: center;
    transition: all 0.15s; color: #475569;
  }
  .st-btn-action:hover { background: #e2e8f0; color: #1e293b; }

  /* Modals */
  .st-modal-overlay {
    position: fixed; top:0; left:0; right:0; bottom:0; background: rgba(15, 23, 42, 0.45);
    backdrop-filter: blur(2px); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 16px;
  }
  .st-modal { background: #fff; border-radius: 12px; width: 100%; max-width: 500px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.15); overflow: hidden; }
  .st-modal-header { padding: 16px 20px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; }
  .st-modal-header h3 { margin: 0; font-size: 15px; font-weight: 700; color: #1e293b; }
  .st-modal-close { border: none; background: transparent; font-size: 20px; cursor: pointer; color: #94a3b8; }
  .st-modal-close:hover { color: #475569; }
  .st-modal-body { padding: 20px; max-height: 400px; overflow-y: auto; }
  .st-modal-tabs { display: flex; border-bottom: 1px solid #e2e8f0; margin-bottom: 16px; }
  .st-modal-tab { flex: 1; text-align: center; padding: 10px; background: none; border: none; border-bottom: 2px solid transparent; cursor: pointer; font-size: 13px; font-weight: 600; color: #64748b; }
  .st-modal-tab.active { color: #3498db; border-bottom-color: #3498db; }

  /* Liste Interne */
  .st-item-list { display: flex; flex-direction: column; gap: 8px; margin: 0; padding: 0; list-style: none; }
  .st-item-box { padding: 10px 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; }
  .st-item-info h4 { margin: 0 0 2px 0; font-size: 13px; font-weight: 600; color: #1e293b; }
  .st-item-info p { margin: 0; font-size: 12px; color: #64748b; }

  /* Buttons */
  .st-btn { padding: 10px 16px; border: none; border-radius: 7px; font-size: 13px; font-weight: 700; cursor: pointer; color: #fff; transition: background 0.1s; }
  .st-btn-primary { background: #3498db; }
  .st-btn-primary:hover { background: #2980b9; }
  .st-btn-success { background: #2ecc71; }
  .st-btn-success:hover { background: #27ae60; }
  .st-submit-full { width: 100%; padding: 12px; border: none; border-radius: 8px; color: #fff; font-size: 13px; font-weight: 700; cursor: pointer; }
`;

const StocksPage = () => {
  const dispatch = useDispatch();

  const { produits = [], statutChargement, erreurStock } = useSelector((state) => state.stocks);
  const { fournisseursdata = [] } = useSelector((state) => state.fournisseurs); 
  const { boutiques = [], boutiqueSelectionnee } = useSelector((state) => state.shops);
  const idBoutiqueActive = boutiqueSelectionnee ? boutiqueSelectionnee.id : null;
  
  const [ongletActif, setOngletActif] = useState('INVENTAIRE');
  const [estModalOuvert, setEstModalOuvert] = useState(false);
  const [ongletModal, setOngletModal] = useState('CREER'); 
  const [nouveauFournisseur, setNouveauFournisseur] = useState({ prenom_fournisseur: '', nom_fournisseur: '', tel_fournisseur: '', adresse_fournisseur: '' });

  const [nouveauProduit, setNouveauProduit] = useState({
    nom_produit: '', stock_quantite: 0, prix_d_achat: '', prix_de_vente: '', alert_stock: 5, fournisseur: ''
  });

  const [mouvement, setMouvement] = useState({
    produitId: '', type_mouvement: 'ENTREE', quantite: 1, motif: '', nouveau_prix_achat: '', nouveau_prix_vente: ''
  });

  useEffect(() => {
    dispatch(chargerFournisseurs());
    if (boutiques.length === 0) {
      dispatch(chargerBoutiquesUtilisateur());
    }
    if (idBoutiqueActive) {
      dispatch(chargerTousLesProduits());
    }
  }, [dispatch, idBoutiqueActive]); // Nettoyage de la dépendance fournisseursdata.length pour éviter des boucles inutiles

  const handleBoutiqueChange = (event) => {
    const bId = parseInt(event.target.value, 10);
    const boutiqueTrouvee = boutiques.find((b) => b.id === bId);
    if (boutiqueTrouvee) {
      dispatch(selectionnerBoutique(boutiqueTrouvee));
    }
  };

  const valeurTotaleStockAchat = produits.reduce((sum, p) => sum + (p.stock_quantite * p.prix_d_achat), 0);
  const beneficeTheoriqueTotal = produits.reduce((sum, p) => sum + (p.stock_quantite * (p.prix_de_vente - p.prix_d_achat)), 0);
  const articlesEnAlerte = produits.filter(p => p.stock_quantite <= p.alert_stock).length;

  // Envoi API : Création d'un produit (Sécurisé)
  const handleCreerProduit = (e) => {
    e.preventDefault();
    const payload = {
      ...nouveauProduit,
      boutique: idBoutiqueActive,
      stock_quantite: Number(nouveauProduit.stock_quantite),
      prix_d_achat: Number(nouveauProduit.prix_d_achat),
      prix_de_vente: Number(nouveauProduit.prix_de_vente),
      alert_stock: Number(nouveauProduit.alert_stock),
      fournisseur: nouveauProduit.fournisseur ? Number(nouveauProduit.fournisseur) : null
    };

    dispatch(ajouterNouveauProduit(payload))
      .unwrap() // Déballe pour intercepter proprement la réussite ou l'échec
      .then(() => {
        setOngletActif('INVENTAIRE');
        setNouveauProduit({ nom_produit: '', stock_quantite: 0, prix_d_achat: '', prix_de_vente: '', alert_stock: 5, fournisseur: '' });
      })
      .catch((err) => {
        console.error("Erreur d'enregistrement de l'article :", err);
      });
  };

  // Envoi API : Enregistrement d'un mouvement de stock
  const handleEnregistrerMouvement = (e) => {
    e.preventDefault();
    const payload = {
      produit: Number(mouvement.produitId),
      type_mouvement: mouvement.type_mouvement,
      quantite: Number(mouvement.quantite),
      motif: mouvement.motif || null, 
      nouveau_prix_achat: mouvement.nouveau_prix_achat ? Number(mouvement.nouveau_prix_achat) : null,
      nouveau_prix_vente: mouvement.nouveau_prix_vente ? Number(mouvement.nouveau_prix_vente) : null,
    };
    dispatch(enregistrerMouvementStock(payload))
      .unwrap()
      .then(() => {
        setOngletActif('INVENTAIRE');
        setMouvement({ produitId: '', type_mouvement: 'ENTREE', quantite: 1, motif: '', nouveau_prix_achat: '', nouveau_prix_vente: '' });
      })
      .catch((err) => {
        console.error("Erreur lors du mouvement de stock :", err);
      });
  };

  const handleCreerFournisseur = (e) => {
    e.preventDefault();
    const payload = { ...nouveauFournisseur, boutique: idBoutiqueActive };
    
    dispatch(ajouterFournisseur(payload))
      .unwrap()
      .then((fournisseurCree) => {
        if (fournisseurCree?.id) {
          setNouveauProduit((prev) => ({ ...prev, fournisseur: fournisseurCree.id }));
        }
        setNouveauFournisseur({ prenom_fournisseur: '', nom_fournisseur: '', tel_fournisseur: '', adresse_fournisseur: '' });
        setEstModalOuvert(false);
      })
      .catch((erreur) => {
        console.error("Erreur lors de la création du fournisseur :", erreur);
      });
  };

  return (
    <DashboardLayout>
      <style>{STOCK_CSS}</style>

      <div style={pageStyles.selectorCard}>
        <label htmlFor="boutique-select" style={pageStyles.label}>🏪 Boutique active :</label>
        {statutChargement && boutiques.length === 0 ? (
          <p style={pageStyles.loadingText}>Chargement des points de vente...</p>
        ) : (
          <select
            id="boutique-select"
            value={boutiqueSelectionnee ? boutiqueSelectionnee.id : ''}
            onChange={handleBoutiqueChange}
            style={pageStyles.select}
            disabled={true}
          >
            {boutiques.length === 0 ? (
              <option value="">Aucune boutique trouvée</option>
            ) : (
               boutiques.map((b) => (
                <option key={b.id} value={b.id}> {b.nom_boutique}</option>
              ))
            )}
          </select>
        )}
      </div>

      <div className="st-page">
        <div className="st-tabs">
          <button type="button" className={`st-tab ${ongletActif === 'INVENTAIRE' ? 'active' : ''}`} onClick={() => setOngletActif('INVENTAIRE')}>📦 État des Stocks</button>
          <button type="button" className={`st-tab ${ongletActif === 'NOUVEAU_PRODUIT' ? 'active' : ''}`} onClick={() => setOngletActif('NOUVEAU_PRODUIT')}>➕ Ajouter un Article</button>
          <button type="button" className={`st-tab ${ongletActif === 'MOUVEMENT' ? 'active' : ''}`} onClick={() => setOngletActif('MOUVEMENT')}>🔄 Mouvement / Arrivage</button>
        </div>

        {erreurStock && (
          <div style={{ padding: '12px', background: '#f8d7da', color: '#721c24', borderRadius: '8px', marginBottom: '16px', fontSize: '13px' }}>
            ⚠️ <strong>Erreur :</strong> {erreurStock}
          </div>
        )}

        {/* ─── INVENTAIRE ─── */}
        {ongletActif === 'INVENTAIRE' && (
          <>
            <div className="st-stats-grid">
              <div className="st-stat-card">
                <span className="st-stat-label">Valeur du Stock (Achat)</span>
                <span className="st-stat-value">{valeurTotaleStockAchat.toLocaleString()} F CFA</span>
              </div>
              <div className="st-stat-card">
                <span className="st-stat-label">Bénéfice Latent Estimé</span>
                <span className="st-stat-value" style={{ color: '#2ecc71' }}>+{beneficeTheoriqueTotal.toLocaleString()} F CFA</span>
              </div>
              <div className="st-stat-card">
                <span className="st-stat-label">Alertes Rupture</span>
                <span className="st-stat-value" style={{ color: articlesEnAlerte > 0 ? '#ef4444' : '#1e293b' }}>
                  {articlesEnAlerte} {articlesEnAlerte > 1 ? 'articles' : 'article'}
                </span>
              </div>
            </div>

            <div className="st-card">
              <div className="st-card-title">
                <span>Liste des articles en magasin</span>
                <span style={{ fontSize: '12px', color: '#64748b' }}>{produits.length} références</span>
              </div>
              <div className="st-table-wrapper">
                <table className="st-table">
                  <thead>
                    <tr>
                      <th>Désignation</th>
                      <th>Quantité dispo</th>
                      <th>Prix d'achat</th>
                      <th>Prix de vente</th>
                      <th>Marge / Unité</th>
                      <th>Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {produits.length === 0 ? (
                      <tr>
                        <td colSpan="6" style={{ textAlign: 'center', color: '#94a3b8', padding: '24px' }}>
                          Aucun produit en stock pour cette boutique.
                        </td>
                      </tr>
                    ) : (
                      produits.map((p) => {
                        const estEnAlerte = p.stock_quantite <= p.alert_stock;
                        return (
                          <tr key={p.id}>
                            <td style={{ fontWeight: '600', color: '#1e293b' }}>{p.nom_produit}</td>
                            <td style={{ fontWeight: '700' }}>{p.stock_quantite} pcs</td>
                            <td>{p.prix_d_achat.toLocaleString()} F</td>
                            <td>{p.prix_de_vente.toLocaleString()} F</td>
                            <td style={{ color: '#27ae60', fontWeight: '600' }}>
                              +{(p.prix_de_vente - p.prix_d_achat).toLocaleString()} F
                            </td>
                            <td>
                              <span className={`badge ${estEnAlerte ? 'badge-danger' : 'badge-success'}`}>
                                {estEnAlerte ? '⚠️ Réappro' : '✅ Correct'}
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
          </>
        )}

        {/* ─── AJOUT NOUVEL ARTICLE ─── */}
        {ongletActif === 'NOUVEAU_PRODUIT' && (
          <div className="st-card">
            <p className="st-card-title">Enregistrement initial d'un nouvel article</p>
            <form onSubmit={handleCreerProduit} className="st-grid-form">
              <div className="st-field">
                <label className="st-label">Désignation du produit *</label>
                <input required className="st-input" type="text" placeholder="Ex: Sac de Riz 50kg..." value={nouveauProduit.nom_produit} onChange={(e) => setNouveauProduit({...nouveauProduit, nom_produit: e.target.value})} />
              </div>
              <div className="st-field">
                <label className="st-label">Stock Initial *</label>
                <input required className="st-input" type="number" min="0" placeholder="Ex: 50" value={nouveauProduit.stock_quantite} onChange={(e) => setNouveauProduit({...nouveauProduit, stock_quantite: e.target.value})} />
              </div>
              <div className="st-field">
                <label className="st-label">Prix d'Achat Unitaire (FCFA) *</label>
                <input required className="st-input" type="number" min="0" placeholder="Ex: 17500" value={nouveauProduit.prix_d_achat} onChange={(e) => setNouveauProduit({...nouveauProduit, prix_d_achat: e.target.value})} />
              </div>
              <div className="st-field">
                <label className="st-label">Prix de Vente Unitaire (FCFA) *</label>
                <input required className="st-input" type="number" min="0" placeholder="Ex: 22000" value={nouveauProduit.prix_de_vente} onChange={(e) => setNouveauProduit({...nouveauProduit, prix_de_vente: e.target.value})} />
              </div>
              <div className="st-field">
                <label className="st-label">Seuil d'alerte de stock *</label>
                <input required className="st-input" type="number" min="0" value={nouveauProduit.alert_stock} onChange={(e) => setNouveauProduit({...nouveauProduit, alert_stock: e.target.value})} />
              </div>

              <div className="st-field">
                <label className="st-label">Fournisseur associé</label>
                <div className="st-input-group">
                  <select className="st-select" value={nouveauProduit.fournisseur} onChange={(e) => setNouveauProduit({...nouveauProduit, fournisseur: e.target.value})}>
                    <option value="">— Aucun fournisseur —</option>
                    {fournisseursdata.map(f => (
                      <option key={f.id} value={f.id}>{f.prenom_fournisseur} {f.nom_fournisseur}</option>
                    ))}
                  </select>
                  <button 
                    type="button" 
                    className="st-btn-action" 
                    title="Gérer les fournisseurs"
                    onClick={() => setEstModalOuvert(true)}
                  >
                    🚚+
                  </button>
                </div>
              </div>

              <div style={{ gridColumn: '1 / -1', marginTop: '10px', display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" className="st-btn st-btn-success" disabled={statutChargement}>
                  {statutChargement ? 'Enregistrement...' : '🚀 Enregistrer et Initialiser le Stock'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ─── MOUVEMENTS DE STOCKS ─── */}
        {ongletActif === 'MOUVEMENT' && (
          <div className="st-card">
            <p className="st-card-title">Déclarer un arrivage ou une perte de marchandise</p>
            <form onSubmit={handleEnregistrerMouvement} className="st-grid-form">
              <div className="st-field">
                <label className="st-label">Sélectionner le produit affecté *</label>
                <select required className="st-select" value={mouvement.produitId} onChange={(e) => setMouvement({...mouvement, produitId: e.target.value})}>
                  <option value="">— Choisir un article —</option>
                  {produits.map(p => (
                    <option key={p.id} value={p.id}>{p.nom_produit} (Dispo: {p.stock_quantite})</option>
                  ))}
                </select>
              </div>
              <div className="st-field">
                <label className="st-label">Type de flux de stock *</label>
                <select className="st-select" value={mouvement.type_mouvement} onChange={(e) => setMouvement({...mouvement, type_mouvement: e.target.value, nouveau_prix_achat: '', nouveau_prix_vente: ''})}>
                  <option value="ENTREE">📦 Entrée / Nouvel Arrivage</option>
                  <option value="PERTE">⚠️ Perte / Avarie / Vol</option>
                  <option value="RETOUR">🔄 Retour Client</option>
                </select>
              </div>
              <div className="st-field">
                <label className="st-label">Quantité impactée *</label>
                <input required className="st-input" type="number" min="1" value={mouvement.quantite} onChange={(e) => setMouvement({...mouvement, quantite: e.target.value})} />
              </div>
              <div className="st-field">
                <label className="st-label">Motif / Commentaire</label>
                <input className="st-input" type="text" placeholder="Commentaire..." value={mouvement.motif} onChange={(e) => setMouvement({...mouvement, motif: e.target.value})} />
              </div>

              {mouvement.type_mouvement === 'ENTREE' && (
                <>
                  <div className="st-field">
                    <label className="st-label">Nouveau prix d'achat unitaire (Optionnel)</label>
                    <input className="st-input" type="number" placeholder="Inchangé si vide" value={mouvement.nouveau_prix_achat} onChange={(e) => setMouvement({...mouvement, nouveau_prix_achat: e.target.value})} />
                  </div>
                  <div className="st-field">
                    <label className="st-label">Nouveau prix de vente unitaire (Optionnel)</label>
                    <input className="st-input" type="number" placeholder="Inchangé si vide" value={mouvement.nouveau_prix_vente} onChange={(e) => setMouvement({...mouvement, nouveau_prix_vente: e.target.value})} />
                  </div>
                </>
              )}

              <div style={{ gridColumn: '1 / -1', marginTop: '10px', display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" className="st-btn st-btn-primary" disabled={statutChargement || !mouvement.produitId}>
                  {statutChargement ? 'Validation...' : '💾 Appliquer le mouvement de stock'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* ─── MODAL FOURNISSEURS ─── */}
      {estModalOuvert && (
        <div className="st-modal-overlay" onClick={() => setEstModalOuvert(false)}>
          <div className="st-modal" onClick={(e) => e.stopPropagation()}>
            <div className="st-modal-header">
              <h3>Gestion des Fournisseurs</h3>
              <button type="button" className="st-modal-close" onClick={() => setEstModalOuvert(false)}>×</button>
            </div>
            
            <div className="st-modal-tabs">
              <button type="button" className={`st-modal-tab ${ongletModal === 'CREER' ? 'active' : ''}`} onClick={() => setOngletModal('CREER')}>➕ Nouveau Fournisseur</button>
              <button type="button" className={`st-modal-tab ${ongletModal === 'LISTE' ? 'active' : ''}`} onClick={() => setOngletModal('LISTE')}>📋 Parcourir ({fournisseursdata.length})</button>
            </div>

            <div className="st-modal-body">
              {ongletModal === 'CREER' ? (
                <form onSubmit={handleCreerFournisseur} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <div className="st-field" style={{ flex: 1 }}>
                      <label className="st-label">Prénom *</label>
                      <input className="st-input" type="text" required value={nouveauFournisseur.prenom_fournisseur} onChange={(e) => setNouveauFournisseur({ ...nouveauFournisseur, prenom_fournisseur: e.target.value })} />
                    </div>
                    <div className="st-field" style={{ flex: 1 }}>
                      <label className="st-label">Nom *</label>
                      <input className="st-input" type="text" required value={nouveauFournisseur.nom_fournisseur} onChange={(e) => setNouveauFournisseur({ ...nouveauFournisseur, nom_fournisseur: e.target.value })} />
                    </div>
                  </div>
                  <div className="st-field">
                    <label className="st-label">Téléphone</label>
                    <input className="st-input" type="tel" placeholder="Ex: 77XXXXXXX" value={nouveauFournisseur.tel_fournisseur} onChange={(e) => setNouveauFournisseur({ ...nouveauFournisseur, tel_fournisseur: e.target.value })} />
                  </div>
                  <div className="st-field">
                    <label className="st-label">Adresse</label>
                    <input className="st-input" type="text" placeholder="Ex: Marché Central, Bakel" value={nouveauFournisseur.adresse_fournisseur} onChange={(e) => setNouveauFournisseur({ ...nouveauFournisseur, adresse_fournisseur: e.target.value })} />
                  </div>
                  <button type="submit" className="st-submit-full" style={{ backgroundColor: '#2ecc71', marginTop: '10px' }}>
                    ✅ Enregistrer le fournisseur
                  </button>
                </form>
              ) : (
                <ul className="st-item-list">
                  {fournisseursdata.length > 0 ? (
                    fournisseursdata.map(f => (
                      <li 
                        key={f.id} 
                        className="st-item-box" 
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          setNouveauProduit({ ...nouveauProduit, fournisseur: f.id });
                          setEstModalOuvert(false);
                        }}
                      >
                        <div className="st-item-info">
                          <h4>{f.prenom_fournisseur} {f.nom_fournisseur}</h4>
                          <p>📞 {f.tel_fournisseur || 'Aucun contact'} {f.adresse_fournisseur ? `· 📍 ${f.adresse_fournisseur}` : ''}</p>
                        </div>
                        <span style={{ fontSize: '11px', color: '#3498db', fontWeight: 600 }}>Choisir →</span>
                      </li>
                    ))
                  ) : (
                    <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>Aucun fournisseur enregistré.</p>
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

const pageStyles = {
  selectorCard: { background: '#fff', padding: '12px 24px', borderBottom: '1px solid #e8edf2', display: 'flex', alignItems: 'center', gap: '12px' },
  label: { fontSize: '13px', fontWeight: '700', color: '#334155' },
  select: { padding: '6px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', fontSize: '13px', fontWeight: '600', color: '#1e293b', outline: 'none', cursor: 'pointer' }
};

export default StocksPage;