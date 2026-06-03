import React, { useState, useEffect } from 'react';

const RegisterWizard = () => {
  // 1. État unique regroupant toutes les données du JSON
  const [formData, setFormData] = useState({
    utilisateur: {
      username: '',
      password: '',
      prenom: '',
      nom: '',
      tel_utilisateur: '',
      role: '' // Ajout du rôle pour l'utilisateur
    },
    boutique: {
      nom_boutique: '',
      region: '', // Sera mis à jour via le select
      devise_monetaire: 'XOF', // Valeur par défaut
      pays: 'Sénégal' // Valeur par défaut
    },
    plan_id: 1 // Plan standard par défaut
  });

  // --- ÉTAT POUR STOCKER LES CHOIX VENANT DE L'API ---
  const [apiChoices, setApiChoices] = useState({
    regions: [],
    roles: []
  });

  // Gestion des étapes (1: Utilisateur, 2: Boutique, 3: Plan & Validation)
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingChoices, setLoadingChoices] = useState(true); // Loader spécifique pour l'API choices
  const [message, setMessage] = useState({ type: '', text: '' });

  // --- CHARGEMENT DES CHOIX DEPUIS L'API ---
  const fetchChoices = async () => {
  try {
    # Détermination dynamique de l'URL
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const url = isLocal ? 'http://127.0.0.1:8000/api/core/choices/' : '/api/core/choices/';

    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      setApiChoices({ regions: data.regions || [], roles: data.roles || [] });
    } else {
      console.error("Impossible de récupérer les options de configuration.");
    }
  } catch (error) {
    console.error("Erreur réseau lors de la récupération des choix:", error);
  } finally {
    setLoadingChoices(false);
  }
};

    fetchChoices();
  }, []);

  // 2. Gestionnaires de changements dynamiques pour les objets imbriqués
  const handleUtilisateurChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      utilisateur: { ...prev.utilisateur, [name]: value }
    }));
  };

  const handleBoutiqueChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      boutique: { ...prev.boutique, [name]: value }
    }));
  };

  const handlePlanSelect = (id) => {
    setFormData(prev => ({ ...prev, plan_id: id }));
  };

  // Navigations entre les étapes
  const nextStep = () => setCurrentStep(prev => prev + 1);
  const prevStep = () => setCurrentStep(prev => prev - 1);

  // 3. Soumission finale vers ton API locale
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('http://127.0.0.1:8000/api/users/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Inscription réussie ! Bienvenue sur SenKOPAR.' });
        console.log('Succès:', data);
      } else {
        setMessage({ type: 'error', text: data.message || "Une erreur est survenue lors de la validation." });
      }
    } catch (error) {
      setMessage({ type: 'error', text: "Impossible de joindre le serveur local." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '40px auto', padding: '20px', fontFamily: 'Arial, sans-serif', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      
      <h2 style={{ textAlign: 'center', color: '#2c3e50', marginBottom: '5px' }}>SenKOPAR</h2>
      <p style={{ textAlign: 'center', color: '#7f8c8d', fontSize: '14px', marginBottom: '25px' }}>Créez votre écosystème en 3 étapes</p>

      {/* --- BARRE DE PROGRESSION --- */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '2px', backgroundColor: '#e0e0e0', zIndex: 1 }}></div>
        <div style={{ position: 'absolute', top: '50%', left: 0, width: `${((currentStep - 1) / 2) * 100}%`, height: '2px', backgroundColor: '#2ecc71', zIndex: 1, transition: '0.3s ease' }}></div>

        {[1, 2, 3].map((step) => (
          <div 
            key={step} 
            style={{ 
              width: '35px', 
              height: '35px', 
              borderRadius: '50%', 
              backgroundColor: currentStep >= step ? '#2ecc71' : '#fff', 
              color: currentStep >= step ? '#fff' : '#7f8c8d',
              border: `2px solid ${currentStep >= step ? '#2ecc71' : '#b2bec3'}`,
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              fontWeight: 'bold',
              zIndex: 2,
              transition: '0.3s'
            }}
          >
            {step}
          </div>
        ))}
      </div>

      {/* Affichage des messages d'erreur ou succès */}
      {message.text && (
        <div style={{ padding: '10px', borderRadius: '4px', marginBottom: '15px', textAlign: 'center', backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da', color: message.type === 'success' ? '#155724' : '#721c24' }}>
          {message.text}
        </div>
      )}

      {/* --- FORMULAIRE --- */}
      <form onSubmit={handleSubmit}>
        
        {/* ÉTAPE 1 : Compte Utilisateur */}
        {currentStep === 1 && (
          <div>
            <h3 style={{ color: '#34495e', marginBottom: '15px' }}>Informations personnelles</h3>
            <div style={inputGroupStyle}>
              <label>Prénom</label>
              <input type="text" name="prenom" value={formData.utilisateur.prenom} onChange={handleUtilisateurChange} required style={inputStyle} placeholder="Ex: Moussa" />
            </div>
            <div style={inputGroupStyle}>
              <label>Nom</label>
              <input type="text" name="nom" value={formData.utilisateur.nom} onChange={handleUtilisateurChange} required style={inputStyle} placeholder="Ex: Diop" />
            </div>
            
           

            <div style={inputGroupStyle}>
              <label>Nom d'utilisateur (Identifiant)</label>
              <input type="text" name="username" value={formData.utilisateur.username} onChange={handleUtilisateurChange} required style={inputStyle} placeholder="Ex: moussa_dev" />
            </div>
            <div style={inputGroupStyle}>
              <label>Numéro de Téléphone</label>
              <input type="tel" name="tel_utilisateur" value={formData.utilisateur.tel_utilisateur} onChange={handleUtilisateurChange} required style={inputStyle} placeholder="Ex: 771234567" />
            </div>
            <div style={inputGroupStyle}>
              <label>Mot de passe</label>
              <input type="password" name="password" value={formData.utilisateur.password} onChange={handleUtilisateurChange} required style={inputStyle} placeholder="••••••••" />
            </div>
            
            <button type="button" onClick={nextStep} style={primaryButtonStyle}>Suivant : Ma Boutique →</button>
          </div>
        )}

        {/* ÉTAPE 2 : Informations Boutique */}
        {currentStep === 2 && (
          <div>
            <h3 style={{ color: '#34495e', marginBottom: '15px' }}>Votre Boutique</h3>
            <div style={inputGroupStyle}>
              <label>Nom de la boutique</label>
              <input type="text" name="nom_boutique" value={formData.boutique.nom_boutique} onChange={handleBoutiqueChange} required style={inputStyle} placeholder="Ex: Kopar Boutique Tamba" />
            </div>

            {/* --- MODIFICATION : SELECT RÉGION DYNAMIQUE --- */}
            <div style={inputGroupStyle}>
              <label>Région d'implantation</label>
              <select 
                name="region" 
                value={formData.boutique.region} 
                onChange={handleBoutiqueChange} 
                required 
                style={inputStyle}
                disabled={loadingChoices}
              >
                <option value="">{loadingChoices ? 'Chargement des régions...' : '-- Choisir une région du Sénégal --'}</option>
                {apiChoices.regions.map(reg => (
                  <option key={reg.value} value={reg.value}>{reg.label}</option>
                ))}
              </select>
            </div>

            <div style={inputGroupStyle}>
              <label>Pays</label>
              <input type="text" name="pays" value={formData.boutique.pays} disabled style={{...inputStyle, backgroundColor: '#f5f6fa'}} />
            </div>
            <div style={inputGroupStyle}>
              <label>Devise</label>
              <input type="text" name="devise_monetaire" value={formData.boutique.devise_monetaire} disabled style={{...inputStyle, backgroundColor: '#f5f6fa'}} />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="button" onClick={prevStep} style={secondaryButtonStyle}>Retour</button>
              <button type="button" onClick={nextStep} style={primaryButtonStyle}>Suivant : Choisir un plan →</button>
            </div>
          </div>
        )}

        {/* ÉTAPE 3 : Choix du Plan d'abonnement & Validation */}
        {currentStep === 3 && (
          <div>
            <h3 style={{ color: '#34495e', marginBottom: '15px' }}>Sélectionnez un Plan</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              <div 
                onClick={() => handlePlanSelect(1)} 
                style={{...planCardStyle, borderColor: formData.plan_id === 1 ? '#2ecc71' : '#ddd', backgroundColor: formData.plan_id === 1 ? '#fafffa' : '#fff'}}
              >
                <span style={{ fontWeight: 'bold' }}>Plan Standard (Gratuit / Test)</span>
                <span style={{ fontSize: '12px', color: '#7f8c8d' }}>Idéal pour tester le multiservice à l'université</span>
              </div>

              <div 
                onClick={() => handlePlanSelect(2)} 
                style={{...planCardStyle, borderColor: formData.plan_id === 2 ? '#2ecc71' : '#ddd', backgroundColor: formData.plan_id === 2 ? '#fafffa' : '#fff'}}
              >
                <span style={{ fontWeight: 'bold' }}>Plan Pro (Multi-boutique & Dettes)</span>
                <span style={{ fontSize: '12px', color: '#7f8c8d' }}>Pour débloquer le carnet de dettes complet</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="button" onClick={prevStep} disabled={loading} style={secondaryButtonStyle}>Retour</button>
              <button type="submit" disabled={loading} style={{...primaryButtonStyle, backgroundColor: '#2ecc71'}}>
                {loading ? 'Configuration en cours...' : 'Finaliser mon inscription 🚀'}
              </button>
            </div>
          </div>
        )}

      </form>
    </div>
  );
};

// Styles inchangés
const inputGroupStyle = { marginBottom: '15px', display: 'flex', flexDirection: 'column' };
const inputStyle = { padding: '10px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px', marginTop: '5px', outline: 'none' };
const primaryButtonStyle = { width: '100%', padding: '12px', backgroundColor: '#3498db', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' };
const secondaryButtonStyle = { width: '40%', padding: '12px', backgroundColor: '#95a5a6', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' };
const planCardStyle = { padding: '15px', border: '2px solid #ddd', borderRadius: '6px', cursor: 'pointer', display: 'flex', flexDirection: 'column', transition: '0.2s' };

export default RegisterWizard;
