import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import authService from '../authService';
import { styles } from './RegisterWizard.styles'; // Importation des styles nettoyés

const RegisterWizard = () => {
  const navigate = useNavigate();

  // --- RÉCUPÉRATION DES CHOIX DEPUIS REDUX TOOLKIT ---
  const { regions, roles, loading: loadingChoices } = useSelector((state) => state.core);

  // État unique pour les données du formulaire
  const [formData, setFormData] = useState({
    utilisateur: {
      username: '',
      password: '',
      prenom: '',
      nom: '',
      tel_utilisateur: '',
      role: ''
    },
    boutique: {
      nom_boutique: '',
      region: '',
      devise_monetaire: 'XOF',
      pays: 'Sénégal'
    },
    plan_id: 1
  });

  // États locaux de l'interface
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Gestionnaires de changements dynamiques
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

  const nextStep = () => setCurrentStep(prev => prev + 1);
  const prevStep = () => setCurrentStep(prev => prev - 1);

  // Soumission du formulaire via le service Axios
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const data = await authService.register(formData);
      setMessage({ type: 'success', text: 'Inscription réussie ! Bienvenue sur SenKOPAR.' });
      console.log('Succès:', data);

      // Redirection vers le tableau de bord ou la connexion après succès
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (error) {
      const errorMsg = error.response?.data?.message || "Impossible de joindre le serveur local.";
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>SenKOPAR</h2>
      <p style={styles.subtitle}>Créez votre écosystème en 3 étapes</p>

      {/* --- BARRE DE PROGRESSION --- */}
      <div style={styles.progressBarContainer}>
        <div style={styles.progressTrack}></div>
        <div style={{ ...styles.progressFill, width: `${((currentStep - 1) / 2) * 100}%` }}></div>

        {[1, 2, 3].map((step) => (
          <div 
            key={step} 
            style={{ 
              ...styles.stepCircle, 
              backgroundColor: currentStep >= step ? '#2ecc71' : '#fff', 
              color: currentStep >= step ? '#fff' : '#7f8c8d',
              borderColor: currentStep >= step ? '#2ecc71' : '#b2bec3'
            }}
          >
            {step}
          </div>
        ))}
      </div>

      {/* Messages de notification */}
      {message.text && (
        <div style={{ 
          ...styles.alert, 
          backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da', 
          color: message.type === 'success' ? '#155724' : '#721c24' 
        }}>
          {message.text}
        </div>
      )}

      {/* --- FORMULAIRE --- */}
      <form onSubmit={handleSubmit}>
        
        {/* ÉTAPE 1 : Compte Utilisateur */}
        {currentStep === 1 && (
          <div>
            <h3 style={styles.stepTitle}>Informations personnelles</h3>
            <div style={styles.inputGroup}>
              <label>Prénom</label>
              <input type="text" name="prenom" value={formData.utilisateur.prenom} onChange={handleUtilisateurChange} required style={styles.input} placeholder="Ex: Moussa" />
            </div>
            <div style={styles.inputGroup}>
              <label>Nom</label>
              <input type="text" name="nom" value={formData.utilisateur.nom} onChange={handleUtilisateurChange} required style={styles.input} placeholder="Ex: Diop" />
            </div>
           
            <div style={styles.inputGroup}>
              <label>Nom d'utilisateur (Identifiant)</label>
              <input type="text" name="username" value={formData.utilisateur.username} onChange={handleUtilisateurChange} required style={styles.input} placeholder="Ex: moussa_dev" />
            </div>
            <div style={styles.inputGroup}>
              <label>Numéro de Téléphone</label>
              <input type="tel" name="tel_utilisateur" value={formData.utilisateur.tel_utilisateur} onChange={handleUtilisateurChange} required style={styles.input} placeholder="Ex: 771234567" />
            </div>
            <div style={styles.inputGroup}>
              <label>Mot de passe</label>
              <input type="password" name="password" value={formData.utilisateur.password} onChange={handleUtilisateurChange} required style={styles.input} placeholder="••••••••" />
            </div>
            
            <button type="button" onClick={nextStep} style={styles.primaryButton}>Suivant : Ma Boutique →</button>
          </div>
        )}

        {/* ÉTAPE 2 : Informations Boutique */}
        {currentStep === 2 && (
          <div>
            <h3 style={styles.stepTitle}>Votre Boutique</h3>
            <div style={styles.inputGroup}>
              <label>Nom de la boutique</label>
              <input type="text" name="nom_boutique" value={formData.boutique.nom_boutique} onChange={handleBoutiqueChange} required style={styles.input} placeholder="Ex: Kopar Boutique Tamba" />
            </div>
            <div style={styles.inputGroup}>
              <label>Région d'implantation</label>
              <select name="region" value={formData.boutique.region} onChange={handleBoutiqueChange} required style={styles.input} disabled={loadingChoices}>
                <option value="">{loadingChoices ? 'Chargement des régions...' : '-- Choisir une région du Sénégal --'}</option>
                {regions.map(reg => (
                  <option key={reg.value} value={reg.value}>{reg.label}</option>
                ))}
              </select>
            </div>
            <div style={styles.inputGroup}>
              <label>Pays</label>
              <input type="text" name="pays" value={formData.boutique.pays} disabled style={{...styles.input, backgroundColor: '#f5f6fa'}} />
            </div>
            <div style={styles.inputGroup}>
              <label>Devise</label>
              <input type="text" name="devise_monetaire" value={formData.boutique.devise_monetaire} disabled style={{...styles.input, backgroundColor: '#f5f6fa'}} />
            </div>

            <div style={styles.buttonGroup}>
              <button type="button" onClick={prevStep} style={styles.secondaryButton}>Retour</button>
              <button type="button" onClick={nextStep} style={styles.primaryButton}>Suivant : Choisir un plan →</button>
            </div>
          </div>
        )}

        {/* ÉTAPE 3 : Choix du Plan d'abonnement & Validation */}
        {currentStep === 3 && (
          <div>
            <h3 style={styles.stepTitle}>Sélectionnez un Plan</h3>
            
            <div style={styles.planList}>
              <div 
                onClick={() => handlePlanSelect(1)} 
                style={{...styles.planCard, borderColor: formData.plan_id === 1 ? '#2ecc71' : '#ddd', backgroundColor: formData.plan_id === 1 ? '#fafffa' : '#fff'}}
              >
                <span style={{ fontWeight: 'bold' }}>Plan Standard (Gratuit / Test)</span>
                <span style={{ fontSize: '12px', color: '#7f8c8d' }}>Idéal pour tester le multiservice à l'université</span>
              </div>

              <div 
                onClick={() => handlePlanSelect(2)} 
                style={{...styles.planCard, borderColor: formData.plan_id === 2 ? '#2ecc71' : '#ddd', backgroundColor: formData.plan_id === 2 ? '#fafffa' : '#fff'}}
              >
                <span style={{ fontWeight: 'bold' }}>Plan Pro (Multi-boutique & Dettes)</span>
                <span style={{ fontSize: '12px', color: '#7f8c8d' }}>Pour débloquer le carnet de dettes complet</span>
              </div>
            </div>

            <div style={styles.buttonGroup}>
              <button type="button" onClick={prevStep} disabled={loading} style={styles.secondaryButton}>Retour</button>
              <button type="submit" disabled={loading} style={{...styles.primaryButton, backgroundColor: '#2ecc71'}}>
                {loading ? 'Configuration en cours...' : 'Finaliser mon inscription 🚀'}
              </button>
            </div>
          </div>
        )}

      </form>
    </div>
  );
};

export default RegisterWizard;