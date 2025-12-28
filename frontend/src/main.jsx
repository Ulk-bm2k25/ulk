<<<<<<< HEAD
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { APP_CONFIG } from './config/appConfig';

// --- GESTION D'ÉTAT & NOTIFICATIONS ---
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

// --- IMPORT DES SOUS-APPLICATIONS (PORTAILS) ---
import PortalSelector from './App';       // Page d'accueil (Choix du portail)
import Projet1App from './projet1/App';   // Administration Globale
import Projet2App from './projet2/App';   // Gestion Scolarité / Finance
//import Projet3App from './projet3/App';   // Pédagogie (Notes, Bulletins)
import Projet4App from './projet4/App';   // Vie Scolaire (Absences, Sanctions)

// Initialisation du client React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// --- COMPOSANTS UTILITAIRES POUR LE DÉVELOPPEMENT ---

// Sélecteur de rôle pour le mode Simulation (Projet 2)
const DevRolePicker = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-100 p-6 font-sans">
    <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Mode Développement</h2>
      <p className="text-slate-500 mb-8 text-sm">Choisissez une interface à modifier :</p>
      <div className="grid gap-4">
        <button 
          onClick={() => window.location.href = '/gestion-scolarite/admin'}
          className="p-4 border-2 border-orange-500 text-orange-600 rounded-xl font-bold hover:bg-orange-50 transition-all active:scale-95"
        >
          Interface Administration
        </button>
        <button 
          onClick={() => window.location.href = '/gestion-scolarite/student'}
          className="p-4 border-2 border-blue-500 text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-all active:scale-95"
        >
          Interface Étudiant / Parent
        </button>
      </div>
    </div>
  </div>
);

// Logique de redirection intelligente pour le module Scolarité
const ScolariteRedirect = () => {
  if (APP_CONFIG.USE_SIMULATION) return <DevRolePicker />;

  const token = localStorage.getItem(APP_CONFIG.STORAGE_KEYS.TOKEN);
  const role = localStorage.getItem(APP_CONFIG.STORAGE_KEYS.ROLE);

  // Si pas de token, redirection vers le Login Central (Projet 1)
  // Note: Assurez-vous que la route /admin/login existe bien dans Projet1App
  if (!token) return <Navigate to="/admin/login" replace />;

  return <Navigate to={role === 'admin' ? '/gestion-scolarite/admin' : '/gestion-scolarite/student'} replace />;
};

// --- RENDU DE L'APPLICATION ---
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-right" reverseOrder={false} />
      
      <BrowserRouter>
        <Routes>
          {/* === PORTAIL 0 : SÉLECTEUR D'ACCUEIL === */}
          <Route path="/" element={<PortalSelector />} />

          {/* === PORTAIL 1 : ADMINISTRATION (Global) === */}
          {/* Gère /admin/dashboard, /admin/login, /admin/eleves... */}
          <Route path="/admin/*" element={<Projet1App />} />

          {/* === PORTAIL 2 : GESTION SCOLARITÉ / FINANCE === */}
          <Route path="/gestion-scolarite">
            <Route index element={<ScolariteRedirect />} />
            <Route path="*" element={<Projet2App />} />
          </Route>

          {/* === PORTAIL 3 : PÉDAGOGIE (NOTES) === */}
          {/* Gère /notes/saisie, /notes/bulletins... */}
          {/* <Route path="/notes/*" element={<Projet3App />} /> */}

          {/* === PORTAIL 4 : VIE SCOLAIRE === */}
          {/* Gère /vie-scolaire/absences, /vie-scolaire/sanctions... */}
          <Route path="/vie-scolaire/*" element={<Projet4App />} />

          {/* Redirection par défaut pour les liens cassés */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
=======
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
>>>>>>> groupe3
