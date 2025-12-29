import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// --- GESTION D'ÉTAT & NOTIFICATIONS ---
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

// --- IMPORT DES SOUS-APPLICATIONS (PORTAILS) ---
import PortalSelector from './App';
import Projet1App from './projet1/App';
import Projet2App from './projet2/App';
import Projet3App from './projet3/App';
import Projet4App from './projet4/App';

// Initialisation du client React Query
const queryClient = new QueryClient();

// --- COMPOSANTS UTILITAIRES ---
const ScolariteRedirect = () => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  if (!token) return <Navigate to="/notes/login" replace />;
  return <Navigate to={role === 'admin' ? '/gestion-scolarite/admin' : '/gestion-scolarite/student'} replace />;
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-right" reverseOrder={false} />

      <BrowserRouter>
        <Routes>
          {/* ACCUEIL : SÉLECTEUR DE MODULES */}
          <Route path="/" element={<PortalSelector />} />

          {/* MODULE 1 : INSCRIPTION */}
          <Route path="/admin/*" element={<Projet1App />} />

          {/* MODULE 2 : SCOLARITÉ */}
          <Route path="/gestion-scolarite/*" element={<Projet2App />} />

          {/* MODULE 3 : NOTES (Votre Module) */}
          <Route path="/notes/*" element={<Projet3App />} />

          {/* MODULE 4 : PRÉSENCES */}
          <Route path="/vie-scolaire/*" element={<Projet4App />} />

          {/* Redirection par défaut */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
