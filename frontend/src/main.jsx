import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import 'react-toastify/dist/ReactToastify.css';

// Page d'accueil - sélecteur de portails
import PortalSelector from './App';

// Projets (portails)
import Projet1App from './projet1/App';
import Projet2App from './projet2/App';
// import Projet3App from './projet3/App';
import Projet4App from './projet4/App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Page d'accueil - Sélecteur de portails */}
        <Route path="/" element={<PortalSelector />} />
        
        {/* Les 4 portails */}
        <Route path="/admin/*" element={<Projet1App />} />
        <Route path="/finance/*" element={<Projet2App />} />
        {/* <Route path="/notes/*" element={<Projet3App />} /> */}
        <Route path="/vie-scolaire/*" element={<Projet4App />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);