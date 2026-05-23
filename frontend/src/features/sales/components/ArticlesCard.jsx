import React from 'react';

const ArticlesCard = ({ lignes, produits, onLigneChange, onAjouterLigne, onSupprimerLigne }) => {
  return (
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
          {/* Type */}
          <div className="fs-ligne-cell">
            <label>Type</label>
            <select
              className="fs-select"
              value={ligne.estProduitStocke}
              onChange={(e) => onLigneChange(index, 'estProduitStocke', e.target.value === 'true')}
            >
              <option value="true">Stocké</option>
              <option value="false">Libre</option>
            </select>
          </div>

          {/* Désignation */}
          <div className="fs-ligne-cell">
            <label>Désignation</label>
            {ligne.estProduitStocke ? (
              <select
                className="fs-select"
                value={ligne.produit}
                required
                onChange={(e) => onLigneChange(index, 'produit', e.target.value)}
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
                onChange={(e) => onLigneChange(index, 'designation', e.target.value)}
              />
            )}
          </div>

          {/* Quantité */}
          <div className="fs-ligne-cell">
            <label>Qté</label>
            <input
              className="fs-input"
              type="number"
              min="1"
              value={ligne.quantite}
              required
              style={{ textAlign: 'center' }}
              onChange={(e) => onLigneChange(index, 'quantite', e.target.value)}
            />
          </div>

          {/* Prix unitaire */}
          <div className="fs-ligne-cell">
            <label>Prix unit.</label>
            <input
              className="fs-input"
              type="number"
              placeholder="0"
              value={ligne.prix_unitaire}
              required
              onChange={(e) => onLigneChange(index, 'prix_unitaire', e.target.value)}
            />
          </div>

          {/* Sous-total */}
          <div className="fs-ligne-total">
            {((Number(ligne.quantite) * Number(ligne.prix_unitaire)) || 0).toLocaleString()} F
          </div>

          {/* Bouton supprimer */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            {lignes.length > 1 && (
              <button type="button" className="fs-del-btn" onClick={() => onSupprimerLigne(index)}>×</button>
            )}
          </div>
        </div>
      ))}

      <button type="button" className="fs-add-btn" onClick={onAjouterLigne}>
        <span>+</span> Ajouter un article
      </button>
    </div>
  );
};

export default ArticlesCard;