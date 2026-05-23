import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DashboardLayout from '../layouts/DashboardLayout';
import { enregistrerNouvelleVente, nettoyerStatutVente } from '../features/sales/salesSlices';
import { chargerProduitsBoutique } from '../features/stocks/stocksSlice';

/* ─── STYLES GLOBAUX INJECTÉS UNE SEULE FOIS ─── */
const GLOBAL_CSS = `
  .fs-page { padding: 20px 16px; max-width: 960px; margin: 0 auto; }
  @media (min-width: 640px) { .fs-page { padding: 28px 24px; } }

  /* Segment tabs */
  .fs-tabs { display: flex; background: #f1f5f9; border-radius: 10px; padding: 4px; gap: 3px; margin-bottom: 24px; }
  .fs-tab {
    flex: 1; padding: 9px 8px; border: none; border-radius: 7px;
    background: transparent; cursor: pointer; font-size: 12px; font-weight: 600;
    color: #64748b; display: flex; align-items: center; justify-content: center;
    gap: 5px; transition: all 0.15s ease; white-space: nowrap;
  }
  .fs-tab.active { background: #fff; box-shadow: 0 1px 4px rgba(0,0,0,0.08); }
  @media (max-width: 480px) { .fs-tab span.fs-tab-label { display: none; } .fs-tab { padding: 10px; } }

  /* Page header */
  .fs-header { margin-bottom: 20px; }
  .fs-header h2 { margin: 0 0 4px; font-size: 18px; font-weight: 700; color: #1e293b; }
  .fs-header p  { margin: 0; font-size: 13px; color: #94a3b8; line-height: 1.5; }

  /* Alerts */
  .fs-alert { display: flex; align-items: center; gap: 12px; padding: 13px 16px; border-radius: 9px; margin-bottom: 16px; font-size: 13px; }
  .fs-alert-success { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
  .fs-alert-error   { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
  .fs-alert-body { flex: 1; }
  .fs-alert-body strong { display: block; font-size: 13px; }
  .fs-alert-body span   { font-size: 12px; opacity: 0.8; margin-top: 2px; display: block; }
  .fs-btn-new { padding: 6px 12px; background: #155724; color: #fff; border: none; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 600; white-space: nowrap; }

  /* Layout 2 colonnes desktop */
  .fs-layout { display: flex; flex-direction: column; gap: 16px; }
  @media (min-width: 768px) { .fs-layout { flex-direction: row; align-items: flex-start; } }
  .fs-main  { flex: 1; display: flex; flex-direction: column; gap: 14px; min-width: 0; }
  .fs-aside { width: 100%; }
  @media (min-width: 768px) { .fs-aside { width: 300px; flex-shrink: 0; position: sticky; top: 20px; } }

  /* Cards */
  .fs-card { background: #fff; border-radius: 10px; border: 1px solid #e8edf2; padding: 18px 20px; }
  .fs-card-title { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #b0bac6; margin: 0 0 14px; }

  /* Champs */
  .fs-field { display: flex; flex-direction: column; gap: 5px; position: relative; }
  .fs-label { font-size: 12px; font-weight: 600; color: #475569; }
  .fs-input, .fs-select {
    width: 100%; padding: 9px 11px; border-radius: 7px; border: 1px solid #e2e8f0;
    font-size: 13px; color: #1e293b; background: #fafafa;
    box-sizing: border-box; outline: none; transition: border-color 0.15s;
  }
  .fs-input:focus, .fs-select:focus { border-color: #94a3b8; background: #fff; }
  .fs-grid-2 { display: grid; grid-template-columns: 1fr; gap: 12px; }
  @media (min-width: 520px) { .fs-grid-2 { grid-template-columns: 1fr 1fr; } }

  /* Recherche Client Autocomplete */
  .fs-search-wrapper { display: flex; gap: 6px; width: 100%; }
  .fs-search-dropdown {
    position: absolute; top: 100%; left: 0; right: 0; background: #fff;
    border: 1px solid #cbd5e1; border-radius: 8px; max-height: 180px; overflow-y: auto;
    z-index: 50; box-shadow: 0 4px 12px rgba(0,0,0,0.1); margin-top: 4px; padding: 0; list-style: none;
  }
  .fs-search-item { padding: 10px 12px; font-size: 13px; cursor: pointer; color: #334155; border-bottom: 1px solid #f1f5f9; }
  .fs-search-item:hover { background: #f8fafc; color: #1e293b; }
  .fs-search-empty { padding: 12px; font-size: 12px; color: #94a3b8; text-align: center; }
  .fs-btn-action {
    padding: 0 12px; background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 7px;
    cursor: pointer; font-size: 16px; display: flex; align-items: center; justify-content: center;
    transition: all 0.15s; color: #475569;
  }
  .fs-btn-action:hover { background: #e2e8f0; color: #1e293b; }

  /* Modals */
  .fs-modal-overlay {
    position: fixed; top:0; left:0; right:0; bottom:0; background: rgba(15, 23, 42, 0.45);
    backdrop-filter: blur(2px); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 16px;
  }
  .fs-modal { background: #fff; border-radius: 12px; width: 100%; max-width: 500px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.15); overflow: hidden; }
  .fs-modal-header { padding: 16px 20px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; }
  .fs-modal-header h3 { margin: 0; font-size: 15px; font-weight: 700; color: #1e293b; }
  .fs-modal-close { border: none; background: transparent; font-size: 20px; cursor: pointer; color: #94a3b8; }
  .fs-modal-close:hover { color: #475569; }
  .fs-modal-body { padding: 20px; max-height: 400px; overflow-y: auto; }
  .fs-modal-tabs { display: flex; border-bottom: 1px solid #e2e8f0; margin-bottom: 16px; }
  .fs-modal-tab { flex: 1; text-align: center; padding: 10px; background: none; border: none; border-bottom: 2px solid transparent; cursor: pointer; font-size: 13px; font-weight: 600; color: #64748b; }
  .fs-modal-tab.active { color: #3498db; border-bottom-color: #3498db; }

  /* Liste Clients Interne au Modal */
  .fs-client-list { display: flex; flex-direction: column; gap: 8px; margin: 0; padding: 0; list-style: none; }
  .fs-client-item { padding: 10px 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; }
  .fs-client-info h4 { margin: 0 0 2px 0; font-size: 13px; font-weight: 600; color: #1e293b; }
  .fs-client-info p { margin: 0; font-size: 12px; color: #64748b; }

  /* Lignes articles */
  .fs-articles-header { display: none; }
  @media (min-width: 600px) {
    .fs-articles-header { display: grid; grid-template-columns: 120px 1fr 72px 100px 80px 28px; gap: 8px; padding: 0 4px 8px; border-bottom: 1px solid #f1f5f9; margin-bottom: 6px; }
    .fs-articles-header span { font-size: 10px; text-transform: uppercase; letter-spacing: 0.06em; color: #b0bac6; font-weight: 600; }
  }
  .fs-ligne {
    display: grid; grid-template-columns: 1fr 1fr; gap: 8px;
    padding: 12px; border-radius: 8px; background: #fafafa;
    border: 1px solid #f0f4f8; margin-bottom: 8px;
  }
  .fs-ligne-cell { display: flex; flex-direction: column; gap: 4px; }
  .fs-ligne-cell label { font-size: 10px; color: #94a3b8; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
  @media (min-width: 600px) {
    .fs-ligne { grid-template-columns: 120px 1fr 72px 100px 80px 28px; align-items: center; padding: 8px 4px; background: transparent; border: none; border-bottom: 1px solid #f8fafc; border-radius: 0; margin-bottom: 0; gap: 8px; }
    .fs-ligne:last-of-type { border-bottom: none; }
    .fs-ligne-cell label { display: none; }
  }
  .fs-ligne-total { font-size: 13px; font-weight: 700; color: #1e293b; text-align: right; align-self: center; }
  .fs-del-btn {
    width: 26px; height: 26px; border-radius: 6px; border: 1px solid #fecaca;
    background: none; color: #ef4444; cursor: pointer; font-size: 14px; font-weight: 700;
    display: flex; align-items: center; justify-content: center; padding: 0; align-self: center;
  }
  .fs-add-btn {
    width: 100%; margin-top: 10px; padding: 10px; background: #f8fafc;
    border: 1.5px dashed #cbd5e1; border-radius: 8px; cursor: pointer;
    font-size: 13px; font-weight: 600; color: #64748b;
    display: flex; align-items: center; justify-content: center; gap: 6px;
    transition: background 0.15s;
  }
  .fs-add-btn:hover { background: #f1f5f9; }

  /* Récap aside */
  .fs-recap { background: #2c3e50; border-radius: 12px; padding: 20px; color: #fff; display: flex; flex-direction: column; gap: 14px; }
  .fs-recap-row { display: flex; justify-content: space-between; align-items: center; }
  .fs-recap-label { font-size: 10px; color: #78909c; text-transform: uppercase; letter-spacing: 0.07em; font-weight: 600; }
  .fs-recap-value { font-size: 22px; font-weight: 800; letter-spacing: -0.5px; }
  .fs-recap-sep { border: none; border-top: 1px solid rgba(255,255,255,0.08); margin: 0; }
  .fs-recap-field { display: flex; flex-direction: column; gap: 6px; }
  .fs-recap-input {
    width: 100%; padding: 9px 11px; border-radius: 7px; box-sizing: border-box;
    border: 1px solid rgba(255,255,255,0.12); background: rgba(255,255,255,0.07);
    color: #fff; font-size: 15px; font-weight: 700; outline: none;
  }
  .fs-recap-select {
    width: 100%; padding: 9px 11px; border-radius: 7px; box-sizing: border-box;
    border: none; background: #fff; color: #2c3e50; font-size: 13px; font-weight: 700; cursor: pointer;
  }
  .fs-dette-box {
    display: flex; justify-content: space-between; align-items: center;
    background: rgba(255,118,117,0.12); border-radius: 7px; padding: 10px 12px;
  }
  .fs-dette-label { font-size: 12px; font-weight: 600; color: #ff7675; }
  .fs-dette-value { font-size: 16px; font-weight: 800; color: #ff7675; }
  .fs-submit {
    width: 100%; padding: 13px; border: none; border-radius: 8px;
    color: #fff; font-size: 13px; font-weight: 700; cursor: pointer;
    transition: opacity 0.15s, transform 0.1s;
    box-shadow: 0 4px 14px rgba(0,0,0,0.15);
  }
  .fs-submit:disabled { opacity: 0.45; cursor: not-allowed; }
  .fs-submit:not(:disabled):active { transform: scale(0.98); }
`;

const FreeSales = () => {
  const dispatch = useDispatch();

  const { statutChargement, erreurVente, venteReussie } = useSelector((state) => state.sales);
  const { modes_paiement = [] } = useSelector((state) => state.core);
  const { produits = [] } = useSelector((state) => state.stocks);
  const { boutiqueSelectionnee } = useSelector((state) => state.shops);
  const idBoutiqueActive = boutiqueSelectionnee ? boutiqueSelectionnee.id : null;

  // Liste locale réactive des clients (pour simuler l'ajout en direct)
  const [clientsBoutique, setClientsBoutique] = useState([
    { id: 1, nom: "Moussa Diop", telephone: "771234567" },
    { id: 2, nom: "Fatou Kiné", telephone: "769876543" }
  ]);

  useEffect(() => {
    if (idBoutiqueActive) dispatch(chargerProduitsBoutique());
    if (venteReussie) {
    dispatch(chargerProduitsBoutique());
  }
  }, [dispatch, idBoutiqueActive, venteReussie]);

  const [ongletActif, setOngletActif] = useState('ANONYME');
  const [modeDePaiement, setModeDePaiement] = useState('ESPECE');
  const [descriptionVente, setDescriptionVente] = useState('Vente comptant boutique - Client anonyme');
  
  // États pour la recherche prédictive du client
  const [clientId, setClientId] = useState('');
  const [rechercheClient, setRechercheClient] = useState('');
  const [afficherDropdown, setAfficherDropdown] = useState(false);

  // États pour la gestion du modal client
  const [estModalOuvert, setEstModalOuvert] = useState(false);
  const [ongletModal, setOngletModal] = useState('CREER'); // 'CREER' ou 'LISTE'
  const [nouveauClient, setNouveauClient] = useState({ nom: '', telephone: '' });

  const [montantVerseInitial, setMontantVerseInitial] = useState(0);
  const [lignes, setLignes] = useState([
    { produit: '', designation: '', quantite: 1, prix_unitaire: 0, estProduitStocke: true }
  ]);

  const ajouterLigne = () =>
    setLignes([...lignes, { produit: '', designation: '', quantite: 1, prix_unitaire: 0, estProduitStocke: true }]);

  const supprimerLigne = (index) => lignes.length > 1 && setLignes(lignes.filter((_, i) => i !== index));

  const handleLigneChange = (index, champ, valeur) => {
    const nl = [...lignes];
    if (champ === 'estProduitStocke') {
      nl[index] = { produit: '', designation: '', quantite: 1, prix_unitaire: 0, estProduitStocke: valeur };
    } else if (champ === 'produit') {
      const id = valeur ? Number(valeur) : '';
      const p = produits.find(p => p.id === id);
      nl[index]['produit'] = id;
      if (p) nl[index]['prix_unitaire'] = p.prix_de_vente;
    } else {
      nl[index][champ] = valeur;
    }
    setLignes(nl);
  };

  const totalCalculé = lignes.reduce((t, l) => t + (Number(l.quantite) || 0) * (Number(l.prix_unitaire) || 0), 0);
  const resteAPayer = ongletActif === 'DETTE' ? Math.max(0, totalCalculé - (Number(montantVerseInitial) || 0)) : 0;

  const basculerOnglet = (type) => {
    setOngletActif(type);
    setClientId('');
    setRechercheClient('');
    setMontantVerseInitial(0);
    if (type === 'ANONYME') setDescriptionVente('Vente comptant boutique - Client anonyme');
    else if (type === 'COMPTANT_CLIENT') setDescriptionVente('Vente comptant - Client identifié');
    else setDescriptionVente('Vente à crédit - En attente de règlement');
  };

  // Filtrage intelligent des clients
  const clientsFiltrés = clientsBoutique.filter(c =>
    c.nom.toLowerCase().includes(rechercheClient.toLowerCase()) ||
    c.telephone.includes(rechercheClient)
  );

  const selectionnerClient = (client) => {
    setClientId(client.id);
    setRechercheClient(`${client.nom} · ${client.telephone}`);
    setAfficherDropdown(false);
  };

  // Soumission du formulaire de création d'un client dans le Modal
  const handleCreerClient = (e) => {
    e.preventDefault();
    if (!nouveauClient.nom || !nouveauClient.telephone) return;

    const nvClientObj = {
      id: Date.now(), // Simulation d'ID local
      nom: nouveauClient.nom,
      telephone: nouveauClient.telephone
    };

    setClientsBoutique([...clientsBoutique, nvClientObj]);
    selectionnerClient(nvClientObj); // Sélectionne automatiquement le client créé
    setNouveauClient({ nom: '', telephone: '' });
    setEstModalOuvert(false);
  };

  const soumettreVente = (e) => {
    e.preventDefault();
    if ((ongletActif === 'DETTE' || ongletActif === 'COMPTANT_CLIENT') && !clientId) {
      alert("⚠️ Veuillez rechercher et sélectionner un compte client pour valider cette opération.");
      return;
    }
    const lignesFormatees = lignes.map(l =>
      l.estProduitStocke
        ? { produit: Number(l.produit), quantite: Number(l.quantite), prix_unitaire: Number(l.prix_unitaire) }
        : { designation: l.designation, quantite: Number(l.quantite), prix_unitaire: Number(l.prix_unitaire) }
    );
    const payloadVente = {
      boutique: Number(idBoutiqueActive || 1),
      type_de_vente: ongletActif === 'DETTE' ? 'DETTE' : 'COMPTANT',
      montant_paye: ongletActif === 'DETTE' ? Number(montantVerseInitial) : totalCalculé,
      mode_de_paiement: modeDePaiement,
      description_vente: descriptionVente,
      client: ongletActif === 'ANONYME' ? null : Number(clientId),
      lignes: lignesFormatees
    };
    console.log("Payload SenKOPAR envoyé :", JSON.stringify(payloadVente));
    dispatch(enregistrerNouvelleVente(payloadVente));
  };

  const reinitialiserFormulaire = () => {
    setLignes([{ produit: '', designation: '', quantite: 1, prix_unitaire: 0, estProduitStocke: true }]);
    setModeDePaiement('ESPECE');
    setClientId('');
    setRechercheClient('');
    setMontantVerseInitial(0);
    basculerOnglet('ANONYME');
    dispatch(nettoyerStatutVente());
  };

  const accentColor =
    ongletActif === 'ANONYME' ? '#2ecc71' :
    ongletActif === 'COMPTANT_CLIENT' ? '#3498db' : '#e67e22';

  const TABS = [
    { key: 'ANONYME',         emoji: '🛒', label: 'Comptant anonyme', color: '#2ecc71', subtitle: 'Saisie rapide pour les clients de passage.' },
    { key: 'COMPTANT_CLIENT', emoji: '👤', label: 'Comptant client',  color: '#3498db', subtitle: "L'achat est enregistré dans l'historique client." },
    { key: 'DETTE',           emoji: '📝', label: 'À crédit',         color: '#e67e22', subtitle: "La dette est ajoutée au solde débiteur du client." },
  ];

  const activeTab = TABS.find(t => t.key === ongletActif);

  return (
    <DashboardLayout>
      <style>{GLOBAL_CSS}</style>

      <div className="fs-page">

        {/* ONGLETS SEGMENTS */}
        <div className="fs-tabs">
          {TABS.map(tab => (
            <button
              key={tab.key}
              type="button"
              className={`fs-tab${ongletActif === tab.key ? ' active' : ''}`}
              style={ongletActif === tab.key ? { color: tab.color } : {}}
              onClick={() => basculerOnglet(tab.key)}
            >
              <span>{tab.emoji}</span>
              <span className="fs-tab-label">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* HEADER DYNAMIQUE */}
        <div className="fs-header">
          <h2 style={{ borderLeft: `3px solid ${accentColor}`, paddingLeft: '10px' }}>
            {activeTab.label}
          </h2>
          <p>{activeTab.subtitle}</p>
        </div>

        {/* ALERTES */}
        {venteReussie && (
          <div className="fs-alert fs-alert-success">
            <span style={{ fontSize: '20px' }}>🎉</span>
            <div className="fs-alert-body">
              <strong>Opération enregistrée !</strong>
              <span>Net encaissé : {totalCalculé.toLocaleString()} FCFA</span>
            </div>
            <button className="fs-btn-new" onClick={reinitialiserFormulaire}>+ Nouvelle vente</button>
          </div>
        )}
        {erreurVente && (
          <div className="fs-alert fs-alert-error">
            <span>⚠️</span>
            <div className="fs-alert-body"><strong>Erreur :</strong> {erreurVente}</div>
          </div>
        )}

        <form onSubmit={soumettreVente}>
          <div className="fs-layout">

            {/* ── COLONNE PRINCIPALE ── */}
            <div className="fs-main">

              {/* CARD : Contexte */}
              <div className="fs-card">
                <p className="fs-card-title">Contexte de la vente</p>
                <div className="fs-grid-2">
                  <div className="fs-field">
                    <label className="fs-label">Description / Notes</label>
                    <input
                      className="fs-input"
                      type="text"
                      value={descriptionVente}
                      onChange={(e) => setDescriptionVente(e.target.value)}
                    />
                  </div>

                  {ongletActif !== 'ANONYME' && (
                    <div className="fs-field">
                      <label className="fs-label">
                        Rechercher un client <span style={{ color: accentColor }}>*</span>
                      </label>
                      <div className="fs-search-wrapper">
                        <input
                          className="fs-input"
                          type="text"
                          placeholder="Taper le nom ou téléphone..."
                          value={rechercheClient}
                          required={!clientId}
                          onFocus={() => setAfficherDropdown(true)}
                          onChange={(e) => {
                            setRechercheClient(e.target.value);
                            setClientId(''); // Reset si l'utilisateur remodifie le texte
                            setAfficherDropdown(true);
                          }}
                        />
                        <button 
                          type="button" 
                          className="fs-btn-action" 
                          title="Gérer les clients"
                          onClick={() => setEstModalOuvert(true)}
                        >
                          👤+
                        </button>

                        {/* Dropdown prédictif */}
                        {afficherDropdown && rechercheClient.length >= 0 && (
                          <ul className="fs-search-dropdown">
                            {clientsFiltrés.length > 0 ? (
                              clientsFiltrés.map(c => (
                                <li 
                                  key={c.id} 
                                  className="fs-search-item"
                                  onClick={() => selectionnerClient(c)}
                                >
                                  <strong>{c.nom}</strong> · {c.telephone}
                                </li>
                              ))
                            ) : (
                              <li className="fs-search-empty">
                                Aucun client trouvé. Cliquez sur "👤+" pour l'ajouter.
                              </li>
                            )}
                          </ul>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* CARD : Articles */}
              <div className="fs-card">
                <p className="fs-card-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Articles</span>
                  <span style={{ background: '#f1f5f9', color: '#64748b', fontSize: '10px', padding: '2px 8px', borderRadius: '20px', fontWeight: 600 }}>
                    {lignes.length}
                  </span>
                </p>

                <div className="fs-articles-header">
                  <span>Type</span>
                  <span>Désignation</span>
                  <span style={{ textAlign: 'center' }}>Qté</span>
                  <span>Prix unit.</span>
                  <span style={{ textAlign: 'right' }}>Sous-total</span>
                  <span></span>
                </div>

                {lignes.map((ligne, index) => (
                  <div key={index} className="fs-ligne">
                    <div className="fs-ligne-cell">
                      <label>Type</label>
                      <select
                        className="fs-select"
                        value={ligne.estProduitStocke}
                        onChange={(e) => handleLigneChange(index, 'estProduitStocke', e.target.value === 'true')}
                      >
                        <option value="true">Stocké</option>
                        <option value="false">Libre</option>
                      </select>
                    </div>

                    <div className="fs-ligne-cell">
                      <label>Désignation</label>
                      {ligne.estProduitStocke ? (
                        <select
                          className="fs-select"
                          value={ligne.produit}
                          required
                          onChange={(e) => handleLigneChange(index, 'produit', e.target.value)}
                        >
                          <option value="">— Produit —</option>
                          {produits?.map(p => (
                            <option key={p.id} value={p.id}>{p.nom_produit} ({p.stock_quantite})</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          className="fs-input"
                          type="text"
                          placeholder="Nom de l'article"
                          value={ligne.designation}
                          required
                          onChange={(e) => handleLigneChange(index, 'designation', e.target.value)}
                        />
                      )}
                    </div>

                    <div className="fs-ligne-cell">
                      <label>Qté</label>
                      <input
                        className="fs-input"
                        type="number"
                        min="1"
                        value={ligne.quantite}
                        required
                        style={{ textAlign: 'center' }}
                        onChange={(e) => handleLigneChange(index, 'quantite', e.target.value)}
                      />
                    </div>

                    <div className="fs-ligne-cell">
                      <label>Prix unit.</label>
                      <input
                        className="fs-input"
                        type="number"
                        placeholder="0"
                        value={ligne.prix_unitaire}
                        required
                        onChange={(e) => handleLigneChange(index, 'prix_unitaire', e.target.value)}
                      />
                    </div>

                    <div className="fs-ligne-total">
                      {((Number(ligne.quantite) * Number(ligne.prix_unitaire)) || 0).toLocaleString()} F
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                      {lignes.length > 1 && (
                        <button type="button" className="fs-del-btn" onClick={() => supprimerLigne(index)}>×</button>
                      )}
                    </div>
                  </div>
                ))}

                <button type="button" className="fs-add-btn" onClick={ajouterLigne}>
                  <span>+</span> Ajouter un article
                </button>
              </div>
            </div>

            {/* ── COLONNE RÉCAP (ASIDE) ── */}
            <div className="fs-aside">
              <div className="fs-recap">
                <div>
                  <div className="fs-recap-label">Net à payer</div>
                  <div className="fs-recap-value">{totalCalculé.toLocaleString()} <span style={{ fontSize: '13px', fontWeight: 500, opacity: 0.6 }}>FCFA</span></div>
                </div>

                {ongletActif === 'DETTE' && (
                  <>
                    <hr className="fs-recap-sep" />
                    <div className="fs-recap-field">
                      <label className="fs-recap-label">Acompte versé</label>
                      <input
                        className="fs-recap-input"
                        type="number"
                        min="0"
                        max={totalCalculé}
                        value={montantVerseInitial}
                        onChange={(e) => setMontantVerseInitial(Number(e.target.value) || 0)}
                      />
                    </div>
                    <div className="fs-dette-box">
                      <span className="fs-dette-label">Reste dû</span>
                      <span className="fs-dette-value">{resteAPayer.toLocaleString()} FCFA</span>
                    </div>
                  </>
                )}

                <hr className="fs-recap-sep" />

                <div className="fs-recap-field">
                  <label className="fs-recap-label">
                    {ongletActif === 'DETTE' ? "Encaissement acompte" : "Règlement par"}
                  </label>
                  <select
                    className="fs-recap-select"
                    value={modeDePaiement}
                    onChange={(e) => setModeDePaiement(e.target.value)}
                  >
                    {modes_paiement.length > 0 ? (
                      modes_paiement.map(m => <option key={m.value} value={m.value}>{m.label}</option>)
                    ) : (
                      <>
                        <option value="ESPECE">💵 Espèce</option>
                        <option value="WAVE">🌊 Wave</option>
                        <option value="ORANGE_MONEY">🍊 Orange Money</option>
                      </>
                    )}
                  </select>
                </div>

                <button
                  type="submit"
                  className="fs-submit"
                  disabled={statutChargement || totalCalculé === 0}
                  style={{ backgroundColor: accentColor }}
                >
                  {statutChargement ? '⏳ Validation…' :
                   ongletActif === 'ANONYME' ? '🚀 Encaisser' :
                   ongletActif === 'COMPTANT_CLIENT' ? '👤 Encaisser · Lier client' :
                   '📝 Enregistrer le crédit'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* ─── MODAL : REPERTOIRE & ENREGISTREMENT CLIENT ─── */}
      {estModalOuvert && (
        <div className="fs-modal-overlay" onClick={() => setEstModalOuvert(false)}>
          <div className="fs-modal" onClick={(e) => e.stopPropagation()}>
            <div className="fs-modal-header">
              <h3>Gestion des clients</h3>
              <button className="fs-modal-close" onClick={() => setEstModalOuvert(false)}>×</button>
            </div>
            
            {/* Onglets internes du Modal */}
            <div className="fs-modal-tabs">
              <button 
                type="button" 
                className={`fs-modal-tab${ongletModal === 'CREER' ? ' active' : ''}`}
                onClick={() => setOngletModal('CREER')}
              >
                ➕ Nouveau Client
              </button>
              <button 
                type="button" 
                className={`fs-modal-tab${ongletModal === 'LISTE' ? ' active' : ''}`}
                onClick={() => setOngletModal('LISTE')}
              >
                📋 Liste ({clientsBoutique.length})
              </button>
            </div>

            <div className="fs-modal-body">
              {ongletModal === 'CREER' ? (
                <form onSubmit={handleCreerClient} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div className="fs-field">
                    <label className="fs-label">Nom complet du client</label>
                    <input 
                      className="fs-input" 
                      type="text" 
                      placeholder="Ex: Amadou Diop"
                      value={nouveauClient.nom}
                      onChange={(e) => setNouveauClient({...nouveauClient, nom: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="fs-field">
                    <label className="fs-label">Numéro de téléphone</label>
                    <input 
                      className="fs-input" 
                      type="tel" 
                      placeholder="Ex: 77XXXXXXX"
                      value={nouveauClient.telephone}
                      onChange={(e) => setNouveauClient({...nouveauClient, telephone: e.target.value})}
                      required 
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="fs-submit" 
                    style={{ background: '#3498db', marginTop: '10px', boxShadow: 'none' }}
                  >
                    💾 Enregistrer et lier à la vente
                  </button>
                </form>
              ) : (
                <ul className="fs-client-list">
                  {clientsBoutique.map(c => (
                    <li key={c.id} className="fs-client-item">
                      <div className="fs-client-info">
                        <h4>{c.nom}</h4>
                        <p>📞 {c.telephone}</p>
                      </div>
                      <button 
                        type="button" 
                        className="fs-btn-new" 
                        style={{ background: '#3498db', padding: '5px 10px' }}
                        onClick={() => {
                          selectionnerClient(c);
                          setEstModalOuvert(false);
                        }}
                      >
                        Choisir
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default FreeSales;