import React, { useState } from 'react';

const ContextCard = ({ 
  ongletActif, 
  descriptionVente, 
  setDescriptionVente, 
  accentColor, 
  clients, 
  clientId,
  onSelectClient, 
  onOpenModal 
}) => {
  const [rechercheClient, setRechercheClient] = useState('');
  const [afficherDropdown, setAfficherDropdown] = useState(false);

  const clientsFiltrés = clients.filter(c =>
    c.nom.toLowerCase().includes(rechercheClient.toLowerCase()) ||
    c.telephone.includes(rechercheClient)
  );

  const handleSelect = (client) => {
    onSelectClient(client.id);
    setRechercheClient(`${client.nom} · ${client.telephone}`);
    setAfficherDropdown(false);
  };

  return (
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
                  if (!e.target.value) onSelectClient('');
                  setAfficherDropdown(true);
                }}
              />
              <button type="button" className="fs-btn-action" onClick={onOpenModal} title="Gérer les clients">
                👤+
              </button>

              {afficherDropdown && (
                <ul className="fs-search-dropdown">
                  {clientsFiltrés.length > 0 ? (
                    clientsFiltrés.map(c => (
                      <li key={c.id} className="fs-search-item" onClick={() => handleSelect(c)}>
                        <strong>{c.nom}</strong> · {c.telephone}
                      </li>
                    ))
                  ) : (
                    <li className="fs-search-empty">Aucun client trouvé.</li>
                  )}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContextCard;