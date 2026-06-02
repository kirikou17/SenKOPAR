import React, { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';

/* ─── STYLES GLOBAUX CSS ─── */
const CREDIT_CSS = `
  .cr-page { padding: 20px 16px; max-width: 1100px; margin: 0 auto; }
  @media (min-width: 640px) { .cr-page { padding: 28px 24px; } }

  /* Grille des indicateurs */
  .cr-stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; margin-bottom: 24px; }
  .cr-stat-card { background: #fff; border: 1px solid #e8edf2; border-radius: 10px; padding: 18px; display: flex; flex-direction: column; gap: 4px; }
  .cr-stat-label { font-size: 11px; text-transform: uppercase; color: #94a3b8; font-weight: 700; letter-spacing: 0.05em; }
  .cr-stat-value { font-size: 22px; font-weight: 800; color: #1e293b; }

  /* Structure des cartes */
  .cr-card { background: #fff; border-radius: 10px; border: 1px solid #e8edf2; padding: 20px; }
  .cr-card-title { font-size: 15px; font-weight: 700; color: #1e293b; margin: 0 0 16px 0; }

  /* Tableau des clients */
  .cr-table-wrapper { overflow-x: auto; }
  .cr-table { width: 100%; border-collapse: collapse; text-align: left; font-size: 13px; }
  .cr-table th { padding: 12px; border-bottom: 2px solid #f1f5f9; color: #64748b; font-weight: 600; }
  .cr-table td { padding: 14px 12px; border-bottom: 1px solid #f1f5f9; color: #334155; vertical-align: middle; }
  .cr-table tr:hover { background: #f8fafc; }

  /* Bouton d'action */
  .cr-btn { padding: 8px 14px; border: none; border-radius: 6px; font-size: 12px; font-weight: 700; cursor: pointer; transition: all 0.15s; }
  .cr-btn-primary { background: #3498db; color: #fff; }
  .cr-btn-primary:hover { background: #2980b9; }
  .cr-btn-success { background: #2ecc71; color: #fff; width: 100%; padding: 12px; font-size: 13px; border-radius: 8px; }
  .cr-btn-success:hover { background: #27ae60; }

  /* Volet Latéral (Drawer / Détails) */
  .cr-drawer-overlay {
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(2px);
    display: flex; justify-content: flex-end; z-index: 100;
  }
  .cr-drawer {
    width: 100%; max-width: 500px; background: #fff; height: 100%;
    box-shadow: -10px 0 25px -5px rgba(0,0,0,0.1); display: flex; flex-direction: column;
    animation: slideIn 0.2s ease-out;
  }
  @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
  
  .cr-drawer-header { padding: 20px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; }
  .cr-drawer-header h3 { margin: 0; font-size: 16px; font-weight: 700; color: #1e293b; }
  .cr-drawer-close { background: none; border: none; font-size: 22px; cursor: pointer; color: #94a3b8; }
  .cr-drawer-close:hover { color: #475569; }
  
  .cr-drawer-body { padding: 20px; flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 20px; }

  /* Mini listes internes */
  .cr-mini-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px; }
  .cr-mini-item { padding: 10px 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 12px; display: flex; justify-content: space-between; align-items: center; }

  /* Formulaire versement */
  .cr-form { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; display: flex; flex-direction: column; gap: 12px; }
  .cr-field { display: flex; flex-direction: column; gap: 4px; }
  .cr-label { font-size: 12px; font-weight: 600; color: #475569; }
  .cr-input, .cr-select { padding: 10px; border-radius: 6px; border: 1px solid #cbd5e1; font-size: 13px; outline: none; background: #fff; }
  .cr-input:focus, .cr-select:focus { border-color: #3498db; }
`;

/* ─── FAKE DATA JEU DE TEST TECHNIQUE ─── */
const FAKE_BOUTIQUES = [
  { id: 1, nom_boutique: 'Boutique Tambacounda Centre' },
  { id: 2, nom_boutique: 'Dépôt Bakel Commune' }
];

const FAKE_CLIENTS_ENDETTES = [
  { id: 101, prenom: 'Mamadou', nom: 'Diallo', telephone: 775213456, dette_totale: 45000 },
  { id: 102, prenom: 'Awa', nom: 'Ndiaye', telephone: 764889210, dette_totale: 17500 },
  { id: 103, prenom: 'Ousmane', nom: 'Sow', telephone: 708123477, dette_totale: 65000 },
  { id: 104, prenom: 'Khady', nom: 'Cissé', telephone: 771120988, dette_totale: 8000 }
];

const FAKE_FICHES_DETAILS = {
  101: {
    ventes_non_soldees: [
      { id: 1520, date: '2026-05-10', description: 'Sac de riz 50kg + Huile 5L', montant_total: 35000, montant_paye: 15000, reste_a_payer: 20000 },
      { id: 1582, date: '2026-05-22', description: 'Carton de lait', montant_total: 25000, montant_paye: 0, reste_a_payer: 25000 }
    ],
    historique_versements: [
      { id: 1, vente_id: 1520, montant_verse: 15000, mode_de_paiement: 'WAVE', date: '2026-05-10' }
    ]
  },
  102: {
    ventes_non_soldees: [
      { id: 1410, date: '2026-04-18', description: 'Fournitures diverses', montant_total: 17500, montant_paye: 0, reste_a_payer: 17500 }
    ],
    historique_versements: []
  },
  103: {
    ventes_non_soldees: [
      { id: 1601, date: '2026-05-25', description: 'Achat de gros marchandises', montant_total: 115000, montant_paye: 50000, reste_a_payer: 65000 }
    ],
    historique_versements: [
      { id: 2, vente_id: 1601, montant_verse: 50000, mode_de_paiement: 'OM', date: '2026-05-25' }
    ]
  },
  104: {
    ventes_non_soldees: [
      { id: 1599, date: '2026-05-24', description: 'Sucre et café', montant_total: 8000, montant_paye: 0, reste_a_payer: 8000 }
    ],
    historique_versements: []
  }
};

const CreditPage = () => {
  // Gestion des états simulés
  const [boutiques] = useState(FAKE_BOUTIQUES);
  const [boutiqueActive, setBoutiqueActive] = useState(FAKE_BOUTIQUES[0].id);
  const [clients, setClients] = useState(FAKE_CLIENTS_ENDETTES);
  
  const [clientSelectionne, setClientSelectionne] = useState(null);
  const [ficheActive, setFicheActive] = useState(null);
  
  const [nouveauVersement, setNouveauVersement] = useState({ venteId: '', montant_verse: '', mode_de_paiement: 'WAVE' });
  const [chargementSimule, setChargementSimule] = useState(false);

  // Simule l'ouverture de la fiche client
  const handleOuvrirFicheClient = (client) => {
    setClientSelectionne(client);
    setFicheActive(FAKE_FICHES_DETAILS[client.id]);
    setNouveauVersement({ venteId: '', montant_verse: '', mode_de_paiement: 'WAVE' });
  };

  // Somme globale des dettes affichées
  const totalDettesBoutique = clients.reduce((sum, c) => sum + c.dette_totale, 0);

  // Simulation locale de soumission d'un versement (Met à jour le State local à la volée)
  const handleSoumettreVersementLocal = (e) => {
    e.preventDefault();
    if (!nouveauVersement.venteId || !nouveauVersement.montant_verse) return;

    setChargementSimule(true);

    // Simulation d'un délai réseau de 600ms
    setTimeout(() => {
      const vId = Number(nouveauVersement.venteId);
      const montant = Number(nouveauVersement.montant_verse);

      // 1. Mettre à jour les ventes de la fiche active
      const ventesMisesAJour = ficheActive.ventes_non_soldees.map(v => {
        if (v.id === vId) {
          const nouveauReste = Math.max(0, v.reste_a_payer - montant);
          return { ...v, montant_paye: v.montant_paye + montant, reste_a_payer: nouveauReste };
        }
        return v;
      }).filter(v => v.reste_a_payer > 0); // On retire la facture si elle est soldée à 100%

      // 2. Ajouter le versement dans l'historique interne du client
      const nouvelHistoriqueVersement = [
        {
          id: Date.now(),
          vente_id: vId,
          montant_verse: montant,
          mode_de_paiement: nouveauVersement.mode_de_paiement,
          date: new Date().toISOString().split('T')[0]
        },
        ...ficheActive.historique_versements
      ];

      setFicheActive({
        ventes_non_soldees: ventesMisesAJour,
        historique_versements: nouvelHistoriqueVersement
      });

      // 3. Mettre à jour la dette totale du client dans la liste principale
      setClients(prevClients => prevClients.map(c => {
        if (c.id === clientSelectionne.id) {
          return { ...c, dette_totale: Math.max(0, c.dette_totale - montant) };
        }
        return c;
      }).filter(c => c.dette_totale > 0)); // Retire le client de la liste s'il n'a plus aucune dette

      // Réinitialisation du petit formulaire
      setNouveauVersement({ venteId: '', montant_verse: '', mode_de_paiement: 'WAVE' });
      setChargementSimule(false);
    }, 600);
  };

  return (
    <DashboardLayout>
      <style>{CREDIT_CSS}</style>

      {/* SÉLECTEUR DE BOUTIQUE SIMULÉ */}
      <div style={pageStyles.selectorCard}>
        <label htmlFor="boutique-select-credit" style={pageStyles.label}>🏪 Point de vente :</label>
        <select
          id="boutique-select-credit"
          value={boutiqueActive}
          onChange={(e) => setBoutiqueActive(Number(e.target.value))}
          style={pageStyles.select}
        >
          {boutiques.map((b) => <option key={b.id} value={b.id}>{b.nom_boutique}</option>)}
        </select>
      </div>

      <div className="cr-page">
        {/* EN-TÊTE SYNTHÈSE DES COMPTES */}
        <div className="cr-stats-grid">
          <div className="cr-stat-card" style={{ borderLeft: '4px solid #ef4444' }}>
            <span className="cr-stat-label">Total Arriérés Boutique</span>
            <span className="cr-stat-value" style={{ color: '#ef4444' }}>
              {totalDettesBoutique.toLocaleString()} F CFA
            </span>
          </div>
          <div className="cr-stat-card">
            <span className="cr-stat-label">Clients Débiteurs Actifs</span>
            <span className="cr-stat-value">{clients.length} {clients.length > 1 ? 'personnes' : 'personne'}</span>
          </div>
        </div>

        {/* TABLEAU PRINCIPAL DES ENCOURS */}
        <div className="cr-card">
          <p className="cr-card-title">Suivi des comptes et crédits accordés (Données de démonstration)</p>
          
          <div className="cr-table-wrapper">
            <table className="cr-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Téléphone</th>
                  <th>Dette Actuelle</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {clients.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', color: '#94a3b8', padding: '32px' }}>
                      Aucun crédit en cours. Tous les comptes clients sont à jour ! 🎉
                    </td>
                  </tr>
                ) : (
                  clients.map((client) => (
                    <tr key={client.id}>
                      <td style={{ fontWeight: '600', color: '#1e293b' }}>
                        {client.prenom} {client.nom}
                      </td>
                      <td style={{ color: '#64748b' }}>+221 {client.telephone}</td>
                      <td style={{ fontWeight: '700', color: '#ef4444' }}>
                        {client.dette_totale.toLocaleString()} F CFA
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button 
                          type="button" 
                          className="cr-btn cr-btn-primary"
                          onClick={() => handleOuvrirFicheClient(client)}
                        >
                          Encaisser un versement 💰
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ─── VOLET LATÉRAL (DRAWER) : INTERACTION FAKE DATA ─── */}
      {clientSelectionne && ficheActive && (
        <div className="cr-drawer-overlay" onClick={() => setClientSelectionne(null)}>
          <div className="cr-drawer" onClick={(e) => e.stopPropagation()}>
            
            <div className="cr-drawer-header">
              <div>
                <h3>{clientSelectionne.prenom} {clientSelectionne.nom}</h3>
                <span style={{ fontSize: '12px', color: '#64748b' }}>📞 +221 {clientSelectionne.telephone}</span>
              </div>
              <button type="button" className="cr-drawer-close" onClick={() => setClientSelectionne(null)}>×</button>
            </div>

            <div className="cr-drawer-body">
              
              {/* FORMULAIRE D'ENCAISSEMENT SIMULÉ */}
              <div className="cr-form">
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b' }}>💶 Enregistrer un versement</span>
                <form onSubmit={handleSoumettreVersementLocal} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  
                  <div className="cr-field">
                    <label className="cr-label">Sélectionner la facture concernée *</label>
                    <select 
                      required 
                      className="cr-select"
                      value={nouveauVersement.venteId}
                      onChange={(e) => setNouveauVersement({ ...nouveauVersement, venteId: e.target.value })}
                    >
                      <option value="">— Choisir une vente en cours —</option>
                      {ficheActive.ventes_non_soldees.map(v => (
                        <option key={v.id} value={v.id}>
                          Facture #{v.id} ({v.description}) - Reste: {v.reste_a_payer.toLocaleString()} F
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="cr-field">
                    <label className="cr-label">Montant versé (FCFA) *</label>
                    <input 
                      required 
                      type="number" 
                      min="1" 
                      className="cr-input"
                      placeholder="Ex: 10000"
                      value={nouveauVersement.montant_verse}
                      onChange={(e) => setNouveauVersement({ ...nouveauVersement, montant_verse: e.target.value })}
                    />
                  </div>

                  <div className="cr-field">
                    <label className="cr-label">Mode de règlement *</label>
                    <select 
                      className="cr-select"
                      value={nouveauVersement.mode_de_paiement}
                      onChange={(e) => setNouveauVersement({ ...nouveauVersement, mode_de_paiement: e.target.value })}
                    >
                      <option value="WAVE">🌊 Wave</option>
                      <option value="OM">🍊 Orange Money</option>
                      <option value="ESPECE">💵 Espèces</option>
                      <option value="FREE">📱 Free Money</option>
                    </select>
                  </div>

                  <button 
                    type="submit" 
                    className="cr-btn cr-btn-success"
                    disabled={chargementSimule || !nouveauVersement.venteId}
                  >
                    {chargementSimule ? 'Mise à jour des comptes...' : 'Enregistrer le Versement'}
                  </button>
                </form>
              </div>

              {/* FACTURES DU CLIENT */}
              <div>
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b', display: 'block', marginBottom: '8px' }}>
                  📌 Factures impayées ou partielles ({ficheActive.ventes_non_soldees.length})
                </span>
                <ul className="cr-mini-list">
                  {ficheActive.ventes_non_soldees.length === 0 ? (
                    <p style={{ fontSize: '12px', color: '#2ecc71', fontWeight: '600' }}>✅ Ce client a soldé toutes ses factures !</p>
                  ) : (
                    ficheActive.ventes_non_soldees.map(v => (
                      <li key={v.id} className="cr-mini-item">
                        <div>
                          <strong style={{ color: '#1e293b' }}>Facture #{v.id}</strong>
                          <div style={{ color: '#64748b', fontSize: '11px' }}>Fait le {v.date} · {v.description}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontWeight: '700', color: '#ef4444' }}>Reste : {v.reste_a_payer.toLocaleString()} F</div>
                          <div style={{ fontSize: '11px', color: '#94a3b8' }}>Total : {v.montant_total.toLocaleString()} F</div>
                        </div>
                      </li>
                    ))
                  )}
                </ul>
              </div>

              {/* HISTORIQUE COMPLET DE SES VERSEMENTS */}
              <div>
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b', display: 'block', marginBottom: '8px' }}>
                  📜 Historique des versements reçus ({ficheActive.historique_versements.length})
                </span>
                <ul className="cr-mini-list">
                  {ficheActive.historique_versements.length === 0 ? (
                    <p style={{ fontSize: '12px', color: '#94a3b8' }}>Aucun versement historique enregistré.</p>
                  ) : (
                    ficheActive.historique_versements.map(vers => (
                      <li key={vers.id} className="cr-mini-item" style={{ borderLeft: '3px solid #2ecc71' }}>
                        <div>
                          <span style={{ fontWeight: '600', color: '#27ae60' }}>+{vers.montant_verse.toLocaleString()} F CFA</span>
                          <div style={{ color: '#94a3b8', fontSize: '11px' }}>Sur Facture #{vers.vente_id} · Mode: {vers.mode_de_paiement}</div>
                        </div>
                        <span style={{ color: '#64748b' }}>{vers.date}</span>
                      </li>
                    ))
                  )}
                </ul>
              </div>

            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

/* ─── STYLES INLINE DU POINT DE VENTE ─── */
const pageStyles = {
  selectorCard: { background: '#fff', padding: '12px 24px', borderBottom: '1px solid #e8edf2', display: 'flex', alignItems: 'center', gap: '12px' },
  label: { fontSize: '13px', fontWeight: '700', color: '#334155' },
  select: { padding: '6px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', fontSize: '13px', fontWeight: '600', color: '#1e293b', outline: 'none', cursor: 'pointer' }
};

export default CreditPage;