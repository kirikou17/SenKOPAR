import React, { useState } from 'react';

const ClientManagerModal = ({ isOpen, onClose, clients, onAddClient, onSelectClient }) => {
  const [ongletModal, setOngletModal] = useState('CREER'); // 'CREER' ou 'LISTE'
  const [nouveauClient, setNouveauClient] = useState({ nom: '', telephone: '' });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nouveauClient.nom || !nouveauClient.telephone) return;
    
    const nvClientObj = {
      id: Date.now(),
      nom: nouveauClient.nom,
      telephone: nouveauClient.telephone
    };
    
    onAddClient(nvClientObj);
    onSelectClient(nvClientObj);
    setNouveauClient({ nom: '', telephone: '' });
    onClose();
  };

  return (
    <div className="fs-modal-overlay" onClick={onClose}>
      <div className="fs-modal" onClick={(e) => e.stopPropagation()}>
        <div className="fs-modal-header">
          <h3>Gestion des clients</h3>
          <button type="button" className="fs-modal-close" onClick={onClose}>×</button>
        </div>
        
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
            📋 Liste ({clients.length})
          </button>
        </div>

        <div className="fs-modal-body">
          {ongletModal === 'CREER' ? (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
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
              <button type="submit" className="fs-submit" style={{ background: '#3498db', marginTop: '10px', boxShadow: 'none' }}>
                💾 Enregistrer et lier
              </button>
            </form>
          ) : (
            <ul className="fs-client-list">
              {clients.map(c => (
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
                      onSelectClient(c);
                      onClose();
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
  );
};

export default ClientManagerModal;