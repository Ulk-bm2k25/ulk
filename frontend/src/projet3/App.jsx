import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';

import DashboardNotes from './DashboardNotes.jsx';
import SaisieNotes from './SaisieNotes.jsx';
import NotesParMatiere from './NotesParMatiere.jsx';
import BulletinEleve from './BulletinEleve.jsx';
import AjoutEleve from "./AjoutEleve.jsx";
import ChangePassword from './ChangePassword.jsx';
import ConsulterBulletin from "./ConsulterBulletin.jsx";
import Statistiques from "./Statistiques.jsx";
import Deliberation from "./Deliberation.jsx";
import NotificationLogs from "./NotificationLogs.jsx";
import ConfigAdmin from "./ConfigAdmin.jsx";
import GestionEnseignants from "./GestionEnseignants.jsx";
import Login from "./Login.jsx";

import Sidebar from './components/Common/Sidebar.jsx';

const Projet3App = () => {
    const location = useLocation();
    const isLoginPage = location.pathname.endsWith('/login');

    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const mustChangePassword = user && parseInt(user.doit_changer_mdp) === 1;

    // TEMPORAIRE : Authentification désactivée pour les tests
    // if (!user && !isLoginPage) {
    //     return <Navigate to="/notes/login" replace />;
    // }

    // if (mustChangePassword && !location.pathname.includes('/profil/securite') && !isLoginPage) {
    //     return <Navigate to="/notes/profil/securite" replace />;
    // }

    return (
        <div className="app-wrapper">
            {!isLoginPage && <Sidebar />}
            <main className="main-content" style={{ padding: isLoginPage ? '0' : '40px' }}>
                <Routes>
                    <Route path="login" element={<Login />} />
                    <Route path="saisie" element={<SaisieNotes />} />
                    <Route path="matieres" element={<NotesParMatiere />} />
                    <Route path="bulletin/:id" element={<BulletinEleve />} />
                    <Route path="ajouter-eleve" element={<AjoutEleve />} />
                    <Route path="profil/securite" element={<ChangePassword />} />
                    <Route path="bulletins" element={<ConsulterBulletin />} />
                    <Route path="stats" element={<Statistiques />} />
                    <Route path="deliberation" element={<Deliberation />} />
                    <Route path="notifications" element={<NotificationLogs />} />
                    <Route path="config" element={<ConfigAdmin />} />
                    <Route path="config/enseignants" element={<GestionEnseignants />} />
                    <Route path="/" element={<DashboardNotes />} />
                </Routes>
            </main>
        </div>
    );
};

export default Projet3App;
