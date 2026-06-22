import React, { useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { useSelector, useDispatch } from 'react-redux';
import { chargerBoutiquesUtilisateur, selectionnerBoutique } from '../features/shops/shopsSlice';
import { chargerStatistiquesBoutique } from '../features/shops/satisticsSlice';

/* ─────────── helpers ─────────── */
const formaterDevise = (valeur) =>
  valeur
    ? new Intl.NumberFormat('fr-FR').format(valeur) + '\u00a0FCFA'
    : '0\u00a0FCFA';

const getInitialesBoutique = (nom = '') =>
  nom.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2) || 'BT';

/* ─────────── composant KPI card ─────────── */
function KpiCard({ label, value, sub, accent, progress, icon, alert }) {
  return (
    <div className="kpi-card">
      <div className="kpi-header">
        <span className="kpi-icon" style={{ color: accent }}>{icon}</span>
        <span className="kpi-label">{label}</span>
        {alert && <span className="kpi-alert-dot" />}
      </div>
      <div className="kpi-value" style={{ color: '#2D3748' }}>{value}</div>
      {progress !== undefined && (
        <div className="kpi-bar-track">
          <div
            className="kpi-bar-fill"
            style={{
              width: `${Math.min(progress, 100)}%`,
              background: accent,
            }}
          />
        </div>
      )}
      <div className="kpi-sub">{sub}</div>
    </div>
  );
}

/* ─────────── composant list row ─────────── */
function ListRow({ rank, label, accent }) {
  return (
    <div className="list-row">
      <span className="list-rank" style={{ color: accent }}>{rank}</span>
      <span className="list-label">{label}</span>
    </div>
  );
}

/* ─────────── page ─────────── */
function DashboardPage() {
  const dispatch = useDispatch();

  const { boutiques, boutiqueSelectionnee, statutChargement } = useSelector((s) => s.shops);
  const { statistiques, statutChargement: chargementStats, erreurShops } = useSelector((s) => s.statistics);
  const { user } = useSelector((s) => s.auth || {});

  useEffect(() => {
    if (boutiques.length === 0) dispatch(chargerBoutiquesUtilisateur());
  }, [dispatch, boutiques.length]);

  useEffect(() => {
    if (boutiqueSelectionnee?.id) dispatch(chargerStatistiquesBoutique());
  }, [dispatch, boutiqueSelectionnee]);

  const handleBoutiqueChange = (e) => {
    const found = boutiques.find((b) => b.id === parseInt(e.target.value, 10));
    if (found) dispatch(selectionnerBoutique(found));
  };

  const nbRuptures = statistiques?.produits_rupture_stock?.length ?? 0;
  const stockTotal = statistiques?.stock_total ?? 0;
  const detteTotale = statistiques?.dette_totale ?? 0;
  const dettePartielle = statistiques?.dette_partielle ?? 0;
  const rupturePct = stockTotal > 0 ? Math.round((nbRuptures / stockTotal) * 100) : 0;
  const dettePct = detteTotale > 0 ? Math.round((dettePartielle / detteTotale) * 100) : 0;

  const username = user?.username || 'Moussa';
  const prenomAffiche = username.split(/[\s._]/)[0];

  return (
    <DashboardLayout>
      <style>{`
        @import url('https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css');

        /* ── PAGE SHELL ── */
        .dp-page {
          display: flex;
          flex-direction: column;
          gap: 20px;
          font-family: 'Inter', system-ui, sans-serif;
        }

        /* ── WELCOME BAR ── */
        .dp-welcome {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }

        .dp-welcome-text h2 {
          font-size: 17px;
          font-weight: 600;
          color: #2D3748;
          margin: 0 0 2px;
        }

        .dp-welcome-text p {
          font-size: 13px;
          color: #718096;
          margin: 0;
        }

        /* Boutique selector - style logiciel */
        .dp-shop-selector {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #fff;
          border: 1px solid #E2E8F0;
          padding: 6px 10px;
        }

        .dp-shop-icon {
          width: 30px;
          height: 30px;
          background: #EBF5FF;
          color: #4A90D9;
          font-size: 11px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .dp-shop-meta {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .dp-shop-meta label {
          font-size: 10px;
          font-weight: 500;
          color: #A0AEC0;
          margin-bottom: 2px;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .dp-shop-select {
          font-size: 13px;
          font-weight: 500;
          color: #2D3748;
          border: none;
          background: transparent;
          outline: none;
          cursor: pointer;
          padding: 0;
          font-family: inherit;
          max-width: 200px;
        }

        /* ── BANDEAUX STATUT ── */
        .dp-banner {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          font-size: 13px;
          font-weight: 500;
          border: 1px solid;
        }

        .dp-banner.info {
          background: #EBF5FF;
          color: #1A56DB;
          border-color: #BFDBFE;
        }

        .dp-banner.error {
          background: #FDF2F2;
          color: #9B1C1C;
          border-color: #FECACA;
        }

        /* ── KPI GRID ── */
        .dp-kpi-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
        }

        @media (max-width: 900px) {
          .dp-kpi-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }

        @media (max-width: 580px) {
          .dp-kpi-grid { grid-template-columns: 1fr; }
        }

        .kpi-card {
          background: #fff;
          border: 1px solid #E2E8F0;
          padding: 16px 18px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          position: relative;
        }

        .kpi-header {
          display: flex;
          align-items: center;
          gap: 7px;
          margin-bottom: 4px;
        }

        .kpi-icon {
          font-size: 16px;
          line-height: 1;
        }

        .kpi-label {
          font-size: 12px;
          font-weight: 500;
          color: #718096;
        }

        .kpi-alert-dot {
          width: 6px;
          height: 6px;
          background: #EF4444;
          margin-left: auto;
        }

        .kpi-value {
          font-size: 22px;
          font-weight: 700;
          letter-spacing: -0.5px;
          line-height: 1.1;
          margin-bottom: 6px;
        }

        .kpi-bar-track {
          height: 3px;
          background: #F7FAFC;
          overflow: hidden;
          margin-bottom: 6px;
        }

        .kpi-bar-fill {
          height: 100%;
          transition: width 0.6s ease;
        }

        .kpi-sub {
          font-size: 11.5px;
          color: #A0AEC0;
        }

        /* ── LISTS SECTION ── */
        .dp-lists {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }

        @media (max-width: 640px) {
          .dp-lists { grid-template-columns: 1fr; }
        }

        .dp-list-card {
          background: #fff;
          border: 1px solid #E2E8F0;
        }

        .dp-list-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          border-bottom: 1px solid #F7FAFC;
        }

        .dp-list-title {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 13px;
          font-weight: 600;
          color: #2D3748;
        }

        .dp-list-title i {
          font-size: 16px;
        }

        .dp-list-count {
          font-size: 11px;
          font-weight: 500;
          padding: 1px 8px;
          border: 1px solid;
        }

        .dp-list-count.danger {
          background: #FDF2F2;
          color: #9B1C1C;
          border-color: #FECACA;
        }

        .dp-list-count.success {
          background: #F0FDF4;
          color: #1A7A3A;
          border-color: #BBF7D0;
        }

        .dp-list-body {
          padding: 4px 0;
        }

        .list-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 16px;
          border-bottom: 1px solid #F7FAFC;
          transition: background 0.12s;
        }

        .list-row:last-child { border-bottom: none; }
        .list-row:hover { background: #F7FAFC; }

        .list-rank {
          font-size: 11.5px;
          font-weight: 700;
          min-width: 22px;
          text-align: center;
        }

        .list-label {
          font-size: 13px;
          color: #374151;
          font-weight: 500;
        }

        .dp-empty {
          padding: 24px 16px;
          text-align: center;
          color: #A0AEC0;
          font-size: 13px;
          font-style: italic;
        }
      `}</style>

      <div className="dp-page">

        {/* ── WELCOME + BOUTIQUE ── */}
        <div className="dp-welcome">
          <div className="dp-welcome-text">
            <h2>Bonjour, {prenomAffiche} 👋</h2>
            <p>Résumé d'activité — {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
          </div>

          {/* <div className="dp-shop-selector">
            <div className="dp-shop-icon">
              {getInitialesBoutique(boutiqueSelectionnee?.nom_boutique)}
            </div>
            <div className="dp-shop-meta">
              <label htmlFor="boutique-select">Point de vente</label>
              {statutChargement ? (
                <span style={{ fontSize: 13, color: '#A0AEC0' }}>Chargement…</span>
              ) : (
                <select
                  id="boutique-select"
                  className="dp-shop-select"
                  value={boutiqueSelectionnee?.id ?? ''}
                  onChange={handleBoutiqueChange}
                >
                  {boutiques.length === 0 && <option value="">Aucune boutique</option>}
                  {!boutiqueSelectionnee && boutiques.length > 0 && (
                    <option value="" disabled>Choisir…</option>
                  )}
                  {boutiques.map((b) => (
                    <option key={b.id} value={b.id}>{b.nom_boutique}</option>
                  ))}
                </select>
              )}
            </div>
          </div> */}
        </div>

        {/* ── BANDEAUX STATUT ── */}
        {chargementStats && (
          <div className="dp-banner info">
            <i className="ti ti-refresh" style={{ fontSize: 15 }} />
            Mise à jour des statistiques…
          </div>
        )}
        {erreurShops && (
          <div className="dp-banner error">
            <i className="ti ti-alert-triangle" style={{ fontSize: 15 }} />
            {erreurShops}
          </div>
        )}

        {/* ── KPI CARDS ── */}
        <div className="dp-kpi-grid">
          <KpiCard
            label="Chiffre d'affaires"
            value={formaterDevise(statistiques?.chiffre_affaires)}
            sub={boutiqueSelectionnee ? boutiqueSelectionnee.nom_boutique : 'Aucune boutique sélectionnée'}
            accent="#4A90D9"
            progress={68}
            icon={<i className="ti ti-cash" aria-hidden="true" />}
          />
          <KpiCard
            label="Ruptures de stock"
            value={`${nbRuptures} produit${nbRuptures > 1 ? 's' : ''}`}
            sub={`${stockTotal} articles en stock au total`}
            accent="#D97706"
            progress={rupturePct}
            icon={<i className="ti ti-package-off" aria-hidden="true" />}
            alert={nbRuptures > 0}
          />
          <KpiCard
            label="Dettes globales"
            value={formaterDevise(detteTotale)}
            sub={`Réglements partiels : ${formaterDevise(dettePartielle)}`}
            accent="#DC2626"
            progress={dettePct}
            icon={<i className="ti ti-credit-card" aria-hidden="true" />}
            alert={detteTotale > 0}
          />
        </div>

        {/* ── LISTES ── */}
        <div className="dp-lists">

          {/* Ruptures */}
          <div className="dp-list-card">
            <div className="dp-list-header">
              <span className="dp-list-title">
                <i className="ti ti-alert-triangle" style={{ color: '#DC2626' }} aria-hidden="true" />
                Ruptures de stock
              </span>
              {nbRuptures > 0 && (
                <span className="dp-list-count danger">{nbRuptures}</span>
              )}
            </div>
            <div className="dp-list-body">
              {nbRuptures > 0 ? (
                statistiques.produits_rupture_stock.map((produit, i) => (
                  <ListRow
                    key={i}
                    rank={`!`}
                    label={produit}
                    accent="#EF4444"
                  />
                ))
              ) : (
                <p className="dp-empty">Stock sain — aucune rupture détectée.</p>
              )}
            </div>
          </div>

          {/* Top ventes */}
          <div className="dp-list-card">
            <div className="dp-list-header">
              <span className="dp-list-title">
                <i className="ti ti-trending-up" style={{ color: '#4A90D9' }} aria-hidden="true" />
                Meilleures ventes
              </span>
              {statistiques?.produits_plus_vendus?.length > 0 && (
                <span className="dp-list-count success">
                  {statistiques.produits_plus_vendus.length}
                </span>
              )}
            </div>
            <div className="dp-list-body">
              {statistiques?.produits_plus_vendus?.length > 0 ? (
                statistiques.produits_plus_vendus.map((produit, i) => (
                  <ListRow
                    key={i}
                    rank={`#${i + 1}`}
                    label={produit}
                    accent="#4A90D9"
                  />
                ))
              ) : (
                <p className="dp-empty">Aucune donnée de vente disponible.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default DashboardPage;