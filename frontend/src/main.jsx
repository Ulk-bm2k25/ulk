import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';

// --- GESTION D'ÉTAT & NOTIFICATIONS ---
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

// --- IMPORT DU MODULE 3 UNIQUEMENT ---
import Projet3App from './projet3/App';

// Initialisation du client React Query
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-right" reverseOrder={false} />

      <BrowserRouter>
        <Routes>
          {/* MODULE 3 : NOTES (Gestion des Notes) */}
          <Route path="/notes/*" element={<Projet3App />} />

          {/* Redirection par défaut vers le module Notes */}
          <Route path="*" element={<Navigate to="/notes" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
