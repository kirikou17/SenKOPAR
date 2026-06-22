import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createPortal } from 'react-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import { enregistrerNouvelleVente, nettoyerStatutVente } from '../features/sales/salesSlices';
import { chargerProduitsBoutique } from '../features/stocks/stocksSlice';
import { chargerClientsBoutique, ajouterClient } from '../features/sales/clientsSlice';

/* ─── STYLES MODERNES ET ÉPURÉS ─── */
const GLOBAL_CSS = `
  .fs-app {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
    color: #1A202C;
  }

  .fs-page {
    max-width: 1200px;
    margin: 0 auto;
  }

  .fs-tabs {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 4px;
    background: #F7FAFC;
    border: 1px solid #E2E8F0;
    padding: 4px;
    margin-bottom: 24px;
  }
  .fs-tab {
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
  .fs-tab:hover {
    background: rgba(74,144,217,0.05);
  }
  .fs-tab.active {
    background: #FFFFFF;
    border: 1px solid #E2E8F0;
    color: #2D3748;
  }
  .fs-tab .icon { font-size: 18px; }

  .fs-header {
    margin-bottom: 24px;
  }
  .fs-header h1 {
    font-size: 24px;
    font-weight: 700;
    color: #1A202C;
    margin: 0 0 4px 0;
  }
  .fs-header p {
    font-size: 14px;
    color: #718096;
    margin: 0;
  }

  .fs-alert {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px 20px;
    border: 1px solid;
    margin-bottom: 24px;
  }
  .fs-alert.success {
    background: #F0FDF4;
    border-color: #BBF7D0;
    color: #1A7A3A;
  }
  .fs-alert.error {
    background: #FDF2F2;
    border-color: #FECACA;
    color: #9B1C1C;
  }
  .fs-alert .icon { font-size: 24px; }
  .fs-alert .body { flex: 1; }
  .fs-alert .body strong { display: block; font-size: 14px; }
  .fs-alert .body span { font-size: 13px; opacity: 0.8; }
  .fs-alert .action-btn {
    padding: 8px 16px;
    background: #1A7A3A;
    color: #fff;
    border: none;
    font-weight: 600;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s;
    font-family: inherit;
  }
  .fs-alert .action-btn:hover {
    background: #156B33;
  }

  .fs-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 24px;
  }
  @media (min-width: 1024px) {
    .fs-grid {
      grid-template-columns: 1fr 340px;
      align-items: start;
    }
  }

  .fs-card {
    background: #FFFFFF;
    border: 1px solid #E2E8F0;
    overflow: hidden;
  }
  .fs-card-header {
    padding: 16px 20px;
    background: #F7FAFC;
    border-bottom: 1px solid #E2E8F0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
  }
  .fs-card-title {
    font-size: 14px;
    font-weight: 600;
    color: #2D3748;
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0;
  }
  .fs-card-title .count {
    background: #EDF2F7;
    padding: 0 10px;
    font-size: 12px;
    font-weight: 600;
    color: #718096;
  }
  .fs-card-subtitle {
    font-size: 13px;
    color: #718096;
  }
  .fs-card-body {
    padding: 20px;
  }

  .fs-field {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .fs-field .label {
    font-size: 13px;
    font-weight: 600;
    color: #4A5568;
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .fs-field .label .required {
    color: #EF4444;
  }
  .fs-field .label .hint {
    font-weight: 400;
    font-size: 12px;
    color: #A0AEC0;
    margin-left: auto;
  }
  .fs-field .input,
  .fs-field .select {
    width: 100%;
    padding: 10px 14px;
    border: 1.5px solid #E2E8F0;
    font-size: 14px;
    color: #2D3748;
    background: #FFFFFF;
    transition: all 0.2s;
    font-family: inherit;
  }
  .fs-field .input:hover,
  .fs-field .select:hover {
    border-color: #CBD5E1;
  }
  .fs-field .input:focus,
  .fs-field .select:focus {
    border-color: #4A90D9;
    box-shadow: 0 0 0 3px rgba(74,144,217,0.1);
    outline: none;
  }
  .fs-field .input::placeholder {
    color: #A0AEC0;
  }
  .fs-field .select {
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%234A5568' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    padding-right: 36px;
  }

  .fs-grid-2 {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
  }
  @media (min-width: 600px) {
    .fs-grid-2 {
      grid-template-columns: 1fr 1fr;
    }
  }

  /* ── RECHERCHE CLIENT AVEC POSITIONNEMENT CORRIGÉ ── */
  .fs-search-wrapper {
    position: relative;
    width: 100%;
  }
  
  .fs-search {
    display: flex;
    gap: 8px;
    width: 100%;
  }
  .fs-search .input { 
    flex: 1; 
  }
  .fs-search .btn-add {
    padding: 0 16px;
    background: #F7FAFC;
    border: 1.5px solid #E2E8F0;
    cursor: pointer;
    font-size: 20px;
    font-weight: 600;
    color: #4A5568;
    transition: all 0.2s;
    min-width: 44px;
    font-family: inherit;
    flex-shrink: 0;
  }
  .fs-search .btn-add:hover {
    background: #EDF2F7;
    border-color: #CBD5E1;
  }

  /* Dropdown avec positionnement absolu et z-index maximum */
  .fs-dropdown-portal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    z-index: 99999;
  }
  
  .fs-dropdown {
    position: absolute;
    background: #FFFFFF;
    border: 1.5px solid #E2E8F0;
    border-top: none;
    box-shadow: 0 8px 32px rgba(0,0,0,0.2);
    max-height: 240px;
    overflow-y: auto;
    list-style: none;
    padding: 4px 0;
    margin: 0;
    pointer-events: auto;
    min-width: 200px;
  }
  .fs-dropdown .item {
    padding: 10px 14px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #F7FAFC;
    transition: background 0.15s;
  }
  .fs-dropdown .item:last-child {
    border-bottom: none;
  }
  .fs-dropdown .item:hover {
    background: #F7FAFC;
  }
  .fs-dropdown .item .name { 
    font-weight: 500;
    color: #2D3748;
  }
  .fs-dropdown .item .phone { 
    font-size: 12px; 
    color: #A0AEC0;
    margin-left: 12px;
  }
  .fs-dropdown .empty {
    padding: 14px;
    text-align: center;
    color: #A0AEC0;
    font-size: 13px;
  }
  .fs-dropdown .item.selected {
    background: #EBF5FF;
  }

  .fs-articles-header {
    display: none;
  }
  @media (min-width: 768px) {
    .fs-articles-header {
      display: grid;
      grid-template-columns: 80px 1fr 70px 100px 80px 40px;
      gap: 12px;
      padding: 0 4px 10px;
      border-bottom: 1.5px solid #EDF2F7;
      margin-bottom: 8px;
    }
    .fs-articles-header span {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #A0AEC0;
    }
  }

  .fs-article {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 16px;
    background: #F7FAFC;
    border: 1px solid #E2E8F0;
    margin-bottom: 12px;
    transition: all 0.2s;
  }
  .fs-article:hover {
    border-color: #CBD5E1;
  }
  @media (min-width: 768px) {
    .fs-article {
      display: grid;
      grid-template-columns: 80px 1fr 70px 100px 80px 40px;
      align-items: center;
      padding: 8px 4px;
      background: transparent;
      border: none;
      border-bottom: 1px solid #EDF2F7;
      margin-bottom: 0;
      gap: 12px;
    }
    .fs-article:hover {
      background: #FAFBFC;
    }
  }

  .fs-article .type-badge {
    font-size: 12px;
    font-weight: 600;
    padding: 4px 10px;
    border: 1px solid;
    text-align: center;
    white-space: nowrap;
  }
  .fs-article .type-badge.stock {
    background: #EBF5FF;
    border-color: #BFDBFE;
    color: #1A56DB;
  }
  .fs-article .type-badge.free {
    background: #FEF3C7;
    border-color: #FDE68A;
    color: #92400E;
  }

  .fs-article .field-group {
    display: flex;
    flex-direction: column;
    gap: 4px;
    width: 100%;
  }
  .fs-article .field-group .label-sm {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    color: #718096;
  }
  .fs-article .field-group .input-sm,
  .fs-article .field-group .select-sm {
    padding: 6px 10px;
    font-size: 13px;
    border: 1.5px solid #E2E8F0;
    background: #FFFFFF;
    font-family: inherit;
    transition: all 0.2s;
    width: 100%;
  }
  .fs-article .field-group .input-sm:focus,
  .fs-article .field-group .select-sm:focus {
    border-color: #4A90D9;
    box-shadow: 0 0 0 3px rgba(74,144,217,0.1);
    outline: none;
  }
  .fs-article .field-group .select-sm {
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10'%3E%3Cpath fill='%234A5568' d='M5 7L1 3h8z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 8px center;
    padding-right: 28px;
  }

  @media (min-width: 768px) {
    .fs-article .field-group .label-sm {
      display: none;
    }
  }

  .fs-article .subtotal {
    font-weight: 700;
    font-size: 15px;
    color: #2D3748;
    text-align: right;
  }
  .fs-article .subtotal .currency {
    font-weight: 400;
    font-size: 12px;
    color: #718096;
  }

  .fs-article .actions {
    display: flex;
    justify-content: flex-end;
  }
  .fs-article .btn-delete {
    padding: 6px 12px;
    border: 1.5px solid #FECACA;
    background: #FDF2F2;
    color: #EF4444;
    cursor: pointer;
    font-weight: 600;
    font-size: 13px;
    transition: all 0.2s;
    font-family: inherit;
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .fs-article .btn-delete:hover {
    background: #FECACA;
    border-color: #EF4444;
  }
  @media (min-width: 768px) {
    .fs-article .btn-delete {
      width: 32px;
      height: 32px;
      padding: 0;
      justify-content: center;
      font-size: 16px;
    }
    .fs-article .btn-delete .txt {
      display: none;
    }
  }

  .fs-btn-add {
    width: 100%;
    padding: 12px;
    background: #F7FAFC;
    border: 1.5px dashed #CBD5E1;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    color: #4A5568;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.2s;
    font-family: inherit;
    margin-top: 4px;
  }
  .fs-btn-add:hover {
    background: #EDF2F7;
    border-color: #4A90D9;
    color: #4A90D9;
  }

  .fs-recap {
    background: #1A202C;
    padding: 24px;
    color: #FFFFFF;
    display: flex;
    flex-direction: column;
    gap: 16px;
    border: 1px solid #2D3748;
  }
  .fs-recap .total {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 12px;
    border-bottom: 1px solid rgba(255,255,255,0.08);
  }
  .fs-recap .total .label {
    font-size: 13px;
    color: #A0AEC0;
    font-weight: 500;
  }
  .fs-recap .total .value {
    font-size: 28px;
    font-weight: 800;
    letter-spacing: -0.5px;
  }
  .fs-recap .total .value .curr {
    font-size: 14px;
    font-weight: 500;
    opacity: 0.6;
    margin-left: 4px;
  }

  .fs-recap .field {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .fs-recap .field .label {
    font-size: 12px;
    color: #A0AEC0;
    font-weight: 500;
  }
  .fs-recap .field .input-dark {
    padding: 10px 14px;
    border: 1px solid rgba(255,255,255,0.12);
    background: rgba(255,255,255,0.06);
    color: #FFFFFF;
    font-size: 16px;
    font-weight: 600;
    font-family: inherit;
    transition: all 0.2s;
    width: 100%;
    box-sizing: border-box;
  }
  .fs-recap .field .input-dark:focus {
    border-color: rgba(255,255,255,0.25);
    background: rgba(255,255,255,0.12);
    outline: none;
  }
  .fs-recap .field .input-dark::placeholder {
    color: rgba(255,255,255,0.3);
  }
  .fs-recap .field .select-dark {
    padding: 10px 14px;
    border: 1px solid rgba(255,255,255,0.12);
    background: rgba(255,255,255,0.06);
    color: #FFFFFF;
    font-size: 14px;
    font-weight: 500;
    font-family: inherit;
    cursor: pointer;
    width: 100%;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23A0AEC0' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
  }
  .fs-recap .field .select-dark option {
    color: #2D3748;
    background: #FFFFFF;
  }

  .fs-recap .debt-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background: rgba(255,118,117,0.1);
    border: 1px solid rgba(255,118,117,0.15);
  }
  .fs-recap .debt-box .label {
    font-size: 13px;
    font-weight: 600;
    color: #FC8181;
  }
  .fs-recap .debt-box .value {
    font-size: 18px;
    font-weight: 800;
    color: #FC8181;
  }

  .fs-recap .btn-submit {
    width: 100%;
    padding: 14px;
    border: none;
    color: #FFFFFF;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
    font-family: inherit;
    box-shadow: 0 4px 14px rgba(0,0,0,0.2);
  }
  .fs-recap .btn-submit:hover:not(:disabled) {
    filter: brightness(1.05);
    transform: translateY(-1px);
  }
  .fs-recap .btn-submit:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  .fs-sep {
    border: none;
    border-top: 1px solid rgba(255,255,255,0.08);
    margin: 0;
  }

  .fs-modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(15, 23, 42, 0.5);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100000;
    padding: 20px;
  }
  .fs-modal {
    background: #FFFFFF;
    width: 100%;
    max-width: 520px;
    border: 1px solid #E2E8F0;
    box-shadow: 0 24px 48px -12px rgba(0,0,0,0.25);
    max-height: 90vh;
    display: flex;
    flex-direction: column;
  }
  .fs-modal-header {
    padding: 16px 24px;
    background: #F7FAFC;
    border-bottom: 1px solid #E2E8F0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-shrink: 0;
  }
  .fs-modal-header h3 {
    font-size: 16px;
    font-weight: 700;
    color: #2D3748;
    margin: 0;
  }
  .fs-modal-header .close {
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
  .fs-modal-header .close:hover {
    color: #2D3748;
    background: #EDF2F7;
  }
  .fs-modal-body {
    padding: 24px;
    overflow-y: auto;
    flex: 1;
  }
  .fs-modal-tabs {
    display: flex;
    border-bottom: 1px solid #E2E8F0;
    margin-bottom: 20px;
    flex-shrink: 0;
  }
  .fs-modal-tab {
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
  .fs-modal-tab:hover {
    color: #4A90D9;
  }
  .fs-modal-tab.active {
    color: #4A90D9;
    border-bottom-color: #4A90D9;
  }

  .fs-client-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 0;
    margin: 0;
    list-style: none;
  }
  .fs-client-list .item {
    padding: 12px 16px;
    background: #F7FAFC;
    border: 1px solid #E2E8F0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: all 0.2s;
  }
  .fs-client-list .item:hover {
    background: #EDF2F7;
  }
  .fs-client-list .item .info h4 {
    margin: 0 0 2px 0;
    font-size: 14px;
    font-weight: 600;
    color: #2D3748;
  }
  .fs-client-list .item .info p {
    margin: 0;
    font-size: 13px;
    color: #718096;
  }
  .fs-client-list .item .btn-select {
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
  .fs-client-list .item .btn-select:hover {
    background: #3A7BC8;
  }
  .fs-client-list .empty {
    text-align: center;
    color: #A0AEC0;
    font-size: 14px;
    padding: 20px 0;
  }

  @media (max-width: 480px) {
    .fs-page { padding: 16px; }
    .fs-tab .label { display: none; }
    .fs-tab { padding: 10px; }
    .fs-card-body { padding: 16px; }
    .fs-recap { padding: 16px; }
  }
`;

const FreeSales = () => {
  const dispatch = useDispatch();
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  const { statutChargement, erreurVente, venteReussie } = useSelector((s) => s.sales);
  const { modes_paiement = [] } = useSelector((s) => s.core);
  const { produits = [] } = useSelector((s) => s.stocks);
  const { clients = [] } = useSelector((s) => s.clients);
  const { boutiqueSelectionnee } = useSelector((s) => s.shops);

  const [activeTab, setActiveTab] = useState('ANONYME');
  const [paymentMode, setPaymentMode] = useState('ESPECE');
  const [description, setDescription] = useState('Vente comptant - Client anonyme');
  const [clientId, setClientId] = useState('');
  const [clientSearch, setClientSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState('CREER');
  const [newClient, setNewClient] = useState({ first_name: '', last_name: '', phone: '' });
  const [downPayment, setDownPayment] = useState(0);
  const [items, setItems] = useState([
    { id: 1, type: 'stock', productId: '', designation: '', qty: 1, price: 0 }
  ]);

  const getProduct = (id) => produits.find(p => p.id === Number(id));

  const filteredClients = useMemo(() => {
    const term = clientSearch.toLowerCase().trim();
    if (!term) return clients;
    return clients.filter(c => {
      const full = `${c.first_name_client || ''} ${c.last_name_client || ''} ${c.number_call_client || ''}`.toLowerCase();
      return full.includes(term);
    });
  }, [clients, clientSearch]);

  const total = useMemo(() => {
    return items.reduce((sum, item) => sum + (Number(item.qty) || 0) * (Number(item.price) || 0), 0);
  }, [items]);

  const remaining = activeTab === 'DETTE' ? Math.max(0, total - (Number(downPayment) || 0)) : 0;

  const accentColor = activeTab === 'ANONYME' ? '#2ECC71' : activeTab === 'COMPTANT_CLIENT' ? '#4A90D9' : '#E67E22';

  useEffect(() => {
    if (boutiqueSelectionnee?.id) {
      dispatch(chargerProduitsBoutique());
      dispatch(chargerClientsBoutique());
    }
  }, [dispatch, boutiqueSelectionnee]);

  // Calcul de la position du dropdown
  const updateDropdownPosition = useCallback(() => {
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
  }, []);

  // Gestion du clic en dehors du dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Mise à jour de la position du dropdown quand il s'ouvre
  useEffect(() => {
    if (showDropdown) {
      updateDropdownPosition();
      // Recalculer la position au scroll et resize
      window.addEventListener('scroll', updateDropdownPosition);
      window.addEventListener('resize', updateDropdownPosition);
      return () => {
        window.removeEventListener('scroll', updateDropdownPosition);
        window.removeEventListener('resize', updateDropdownPosition);
      };
    }
  }, [showDropdown, updateDropdownPosition]);

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
    setClientId('');
    setClientSearch('');
    setDownPayment(0);
    if (tab === 'ANONYME') setDescription('Vente comptant - Client anonyme');
    else if (tab === 'COMPTANT_CLIENT') setDescription('Vente comptant - Client identifié');
    else setDescription('Vente à crédit - En attente de règlement');
  }, []);

  const handleItemChange = useCallback((index, field, value) => {
    const updated = [...items];
    if (field === 'type') {
      updated[index] = { ...updated[index], type: value, productId: '', designation: '', price: 0 };
    } else if (field === 'productId') {
      const product = getProduct(value);
      updated[index].productId = value;
      updated[index].designation = product?.nom_produit || '';
      updated[index].price = product?.prix_de_vente || 0;
    } else {
      updated[index][field] = value;
    }
    setItems(updated);
  }, [items]);

  const addItem = useCallback(() => {
    setItems([...items, { id: Date.now(), type: 'stock', productId: '', designation: '', qty: 1, price: 0 }]);
  }, [items]);

  const removeItem = useCallback((index) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  }, [items]);

  const selectClient = useCallback((client) => {
    setClientId(client.id);
    setClientSearch(`${client.first_name_client || ''} ${client.last_name_client || ''} · ${client.number_call_client || ''}`);
    setShowDropdown(false);
  }, []);

  const handleCreateClient = useCallback(async (e) => {
    e.preventDefault();
    const { first_name, last_name, phone } = newClient;
    if (!first_name || !last_name || !phone) {
      alert('Veuillez remplir tous les champs');
      return;
    }
    await dispatch(ajouterClient({
      first_name_client: first_name,
      last_name_client: last_name,
      number_call_client: Number(phone),
      boutique: Number(boutiqueSelectionnee?.id || 1)
    }));
    dispatch(chargerClientsBoutique());
    setNewClient({ first_name: '', last_name: '', phone: '' });
    setModalOpen(false);
  }, [newClient, boutiqueSelectionnee, dispatch]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if ((activeTab === 'DETTE' || activeTab === 'COMPTANT_CLIENT') && !clientId) {
      alert('Veuillez sélectionner un client');
      return;
    }
    const lines = items.map(item => {
      if (item.type === 'stock') {
        return { produit: Number(item.productId), quantite: Number(item.qty), prix_unitaire: Number(item.price) };
      } else {
        return { designation: item.designation, quantite: Number(item.qty), prix_unitaire: Number(item.price) };
      }
    });
    dispatch(enregistrerNouvelleVente({
      boutique: Number(boutiqueSelectionnee?.id || 1),
      type_de_vente: activeTab === 'DETTE' ? 'DETTE' : 'COMPTANT',
      montant_paye: activeTab === 'DETTE' ? Number(downPayment) : total,
      mode_de_paiement: paymentMode,
      description_vente: description,
      client: activeTab === 'ANONYME' ? null : Number(clientId),
      lignes: lines
    }));
  }, [activeTab, clientId, items, paymentMode, description, downPayment, total, boutiqueSelectionnee, dispatch]);

  const resetForm = useCallback(() => {
    setItems([{ id: Date.now(), type: 'stock', productId: '', designation: '', qty: 1, price: 0 }]);
    setPaymentMode('ESPECE');
    setClientId('');
    setClientSearch('');
    setDownPayment(0);
    handleTabChange('ANONYME');
    dispatch(nettoyerStatutVente());
  }, [dispatch, handleTabChange]);

  const tabs = [
    { key: 'ANONYME', icon: '🛒', label: 'Comptant anonyme', desc: 'Saisie rapide sans identification' },
    { key: 'COMPTANT_CLIENT', icon: '👤', label: 'Comptant client', desc: 'Vente avec suivi client' },
    { key: 'DETTE', icon: '📝', label: 'À crédit', desc: 'Enregistrement de dette client' },
  ];

  const activeTabData = tabs.find(t => t.key === activeTab);

  // Composant Dropdown avec Portal
  const DropdownPortal = () => {
    if (!showDropdown) return null;
    
    return createPortal(
      <div className="fs-dropdown-portal">
        <div 
          ref={dropdownRef}
          className="fs-dropdown"
          style={{
            top: dropdownPosition.top,
            left: dropdownPosition.left,
            width: dropdownPosition.width,
          }}
        >
          {filteredClients.length > 0 ? (
            filteredClients.map(c => (
              <li 
                key={c.id} 
                className={`item ${c.id === clientId ? 'selected' : ''}`}
                onMouseDown={() => selectClient(c)}
              >
                <span className="name">
                  {c.first_name_client} {c.last_name_client}
                </span>
                <span className="phone">📞 {c.number_call_client}</span>
              </li>
            ))
          ) : (
            <li className="empty">
              Aucun client trouvé. Cliquez sur <strong>+</strong> pour en ajouter.
            </li>
          )}
        </div>
      </div>,
      document.body
    );
  };

  return (
    <DashboardLayout>
      <style>{GLOBAL_CSS}</style>

      <div className="fs-app">
        <div className="fs-page">
          {/* TABS */}
          <div className="fs-tabs">
            {tabs.map(tab => (
              <button
                key={tab.key}
                className={`fs-tab ${activeTab === tab.key ? 'active' : ''}`}
                onClick={() => handleTabChange(tab.key)}
                style={activeTab === tab.key ? { color: tab.key === 'ANONYME' ? '#2ECC71' : tab.key === 'COMPTANT_CLIENT' ? '#4A90D9' : '#E67E22' } : {}}
              >
                <span className="icon">{tab.icon}</span>
                <span className="label">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* HEADER */}
          <div className="fs-header">
            <h1>{activeTabData?.label}</h1>
            <p>{activeTabData?.desc}</p>
          </div>

          {/* ALERTS */}
          {venteReussie && (
            <div className="fs-alert success">
              <span className="icon">✅</span>
              <div className="body">
                <strong>Vente enregistrée</strong>
                <span>Montant : {total.toLocaleString()} FCFA</span>
              </div>
              <button className="action-btn" onClick={resetForm}>+ Nouvelle vente</button>
            </div>
          )}
          {erreurVente && (
            <div className="fs-alert error">
              <span className="icon">⚠️</span>
              <div className="body">
                <strong>Erreur</strong>
                <span>{erreurVente}</span>
              </div>
            </div>
          )}

          {/* MAIN FORM */}
          <form onSubmit={handleSubmit}>
            <div className="fs-grid">
              {/* LEFT COLUMN */}
              <div>
                {/* Contexte Card */}
                <div className="fs-card" style={{ marginBottom: '24px' }}>
                  <div className="fs-card-header">
                    <h3 className="fs-card-title">📋 Contexte</h3>
                  </div>
                  <div className="fs-card-body">
                    <div className="fs-grid-2">
                      <div className="fs-field">
                        <label className="label">
                          Description
                          <span className="hint">optionnel</span>
                        </label>
                        <input
                          className="input"
                          type="text"
                          placeholder="Ex: Vente du matin"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                        />
                      </div>

                      {activeTab !== 'ANONYME' && (
                        <div className="fs-field">
                          <label className="label">
                            Client <span className="required">*</span>
                            <span className="hint">recherche</span>
                          </label>
                          <div className="fs-search-wrapper">
                            <div className="fs-search">
                              <input
                                ref={inputRef}
                                className="input"
                                type="text"
                                placeholder="Nom ou téléphone..."
                                value={clientSearch}
                                required={!clientId}
                                onFocus={() => {
                                  setShowDropdown(true);
                                  setTimeout(updateDropdownPosition, 10);
                                }}
                                onChange={(e) => {
                                  setClientSearch(e.target.value);
                                  setClientId('');
                                  setShowDropdown(true);
                                  setTimeout(updateDropdownPosition, 10);
                                }}
                              />
                              <button 
                                type="button" 
                                className="btn-add" 
                                onClick={() => setModalOpen(true)}
                                title="Gérer les clients"
                              >
                                +
                              </button>
                            </div>
                            {clientId && (
                              <div style={{ 
                                fontSize: '12px', 
                                color: '#1A7A3A', 
                                marginTop: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}>
                                ✅ Client sélectionné
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Articles Card */}
                <div className="fs-card">
                  <div className="fs-card-header">
                    <h3 className="fs-card-title">
                      🛍️ Articles
                      <span className="count">{items.length}</span>
                    </h3>
                    <span className="fs-card-subtitle">{total.toLocaleString()} FCFA</span>
                  </div>
                  <div className="fs-card-body">
                    <div className="fs-articles-header">
                      <span>Type</span>
                      <span>Désignation</span>
                      <span style={{ textAlign: 'center' }}>Qté</span>
                      <span>Prix</span>
                      <span style={{ textAlign: 'right' }}>Sous-total</span>
                      <span></span>
                    </div>

                    {items.map((item, index) => {
                      const product = item.type === 'stock' ? getProduct(item.productId) : null;
                      return (
                        <div key={item.id || index} className="fs-article">
                          <div className="field-group">
                            <span className="label-sm">Type</span>
                            <select
                              className="select-sm"
                              value={item.type}
                              onChange={(e) => handleItemChange(index, 'type', e.target.value)}
                            >
                              <option value="stock">📦 Stocké</option>
                              <option value="free">🛍️ Libre</option>
                            </select>
                          </div>

                          <div className="field-group">
                            <span className="label-sm">Désignation</span>
                            {item.type === 'stock' ? (
                              <select
                                className="select-sm"
                                value={item.productId}
                                required
                                onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                              >
                                <option value="">Sélectionner...</option>
                                {produits.map(p => (
                                  <option key={p.id} value={p.id}>
                                    {p.nom_produit} ({p.stock_quantite})
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <input
                                className="input-sm"
                                type="text"
                                placeholder="Nom de l'article"
                                value={item.designation}
                                required
                                onChange={(e) => handleItemChange(index, 'designation', e.target.value)}
                              />
                            )}
                          </div>

                          <div className="field-group">
                            <span className="label-sm">Qté</span>
                            <input
                              className="input-sm"
                              type="number"
                              min="1"
                              value={item.qty}
                              required
                              onChange={(e) => handleItemChange(index, 'qty', e.target.value)}
                            />
                          </div>

                          <div className="field-group">
                            <span className="label-sm">Prix</span>
                            <input
                              className="input-sm"
                              type="number"
                              placeholder="0"
                              value={item.price}
                              required
                              onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                            />
                          </div>

                          <div className="subtotal">
                            {((Number(item.qty) * Number(item.price)) || 0).toLocaleString()}
                            <span className="currency"> FCFA</span>
                          </div>

                          <div className="actions">
                            {items.length > 1 && (
                              <button type="button" className="btn-delete" onClick={() => removeItem(index)}>
                                ✕ <span className="txt">Supprimer</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    <button type="button" className="fs-btn-add" onClick={addItem}>
                      <span style={{ fontSize: '20px' }}>+</span> Ajouter un article
                    </button>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN - RECAP */}
              <div>
                <div className="fs-recap">
                  <div className="total">
                    <span className="label">Total</span>
                    <span className="value">
                      {total.toLocaleString()}
                      <span className="curr">FCFA</span>
                    </span>
                  </div>

                  {activeTab === 'DETTE' && (
                    <>
                      <hr className="fs-sep" />
                      <div className="field">
                        <label className="label">Acompte versé</label>
                        <input
                          className="input-dark"
                          type="number"
                          min="0"
                          max={total}
                          placeholder="0"
                          value={downPayment}
                          onChange={(e) => {
                            const val = Number(e.target.value) || 0;
                            setDownPayment(val > total ? total : val);
                          }}
                        />
                      </div>
                      <div className="debt-box">
                        <span className="label">Reste à payer</span>
                        <span className="value">{remaining.toLocaleString()} FCFA</span>
                      </div>
                    </>
                  )}

                  <hr className="fs-sep" />

                  <div className="field">
                    <label className="label">
                      {activeTab === 'DETTE' ? 'Mode de paiement' : 'Règlement'}
                    </label>
                    <select
                      className="select-dark"
                      value={paymentMode}
                      onChange={(e) => setPaymentMode(e.target.value)}
                    >
                      {modes_paiement.length > 0 ? (
                        modes_paiement.map(m => <option key={m.value} value={m.value}>{m.label}</option>)
                      ) : (
                        <>
                          <option value="ESPECE">💵 Espèce</option>
                          <option value="ORANGE_MONEY">🍊 Orange Money</option>
                          <option value="WAVE">🌊 Wave</option>
                        </>
                      )}
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="btn-submit"
                    style={{ background: accentColor }}
                    disabled={
                      statutChargement ||
                      items.some(i => i.type === 'stock' ? !i.productId : !i.designation)
                    }
                  >
                    {statutChargement ? '⏳ Enregistrement...' : '✅ Valider la vente'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* DROPDOWN PORTAL */}
      <DropdownPortal />

      {/* MODAL CLIENTS */}
      {modalOpen && (
        <div className="fs-modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="fs-modal" onClick={(e) => e.stopPropagation()}>
            <div className="fs-modal-header">
              <h3>👥 Gestion des clients</h3>
              <button className="close" onClick={() => setModalOpen(false)}>✕</button>
            </div>
            <div className="fs-modal-tabs">
              <button
                className={`fs-modal-tab ${modalTab === 'CREER' ? 'active' : ''}`}
                onClick={() => setModalTab('CREER')}
              >
                ➕ Nouveau
              </button>
              <button
                className={`fs-modal-tab ${modalTab === 'LISTE' ? 'active' : ''}`}
                onClick={() => setModalTab('LISTE')}
              >
                📋 Sélectionner ({clients.length})
              </button>
            </div>
            <div className="fs-modal-body">
              {modalTab === 'CREER' ? (
                <form onSubmit={handleCreateClient} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="fs-field">
                    <label className="label">Prénom <span className="required">*</span></label>
                    <input
                      className="input"
                      type="text"
                      placeholder="Ex: Amadou"
                      required
                      value={newClient.first_name}
                      onChange={(e) => setNewClient({ ...newClient, first_name: e.target.value })}
                    />
                  </div>
                  <div className="fs-field">
                    <label className="label">Nom <span className="required">*</span></label>
                    <input
                      className="input"
                      type="text"
                      placeholder="Ex: Diallo"
                      required
                      value={newClient.last_name}
                      onChange={(e) => setNewClient({ ...newClient, last_name: e.target.value })}
                    />
                  </div>
                  <div className="fs-field">
                    <label className="label">Téléphone <span className="required">*</span></label>
                    <input
                      className="input"
                      type="tel"
                      placeholder="77 123 45 67"
                      required
                      value={newClient.phone}
                      onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                    />
                  </div>
                  <button
                    type="submit"
                    style={{
                      background: '#4A90D9',
                      padding: '12px',
                      border: 'none',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      color: '#fff',
                      fontFamily: 'inherit'
                    }}
                  >
                    ➕ Enregistrer
                  </button>
                </form>
              ) : (
                <ul className="fs-client-list">
                  {clients.length > 0 ? (
                    clients.map(c => (
                      <li key={c.id} className="item">
                        <div className="info">
                          <h4>{c.first_name_client} {c.last_name_client}</h4>
                          <p>📞 {c.number_call_client}</p>
                        </div>
                        <button className="btn-select" onClick={() => { selectClient(c); setModalOpen(false); }}>
                          Choisir
                        </button>
                      </li>
                    ))
                  ) : (
                    <li className="empty">Aucun client enregistré</li>
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

export default FreeSales;