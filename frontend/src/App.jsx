import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, Link } from 'react-router-dom';

// --- LAYOUTS & GLOBAL ---
// Note : Je garde vos chemins d'imports "shared/admin" tels que vous les avez définis
import MainLayout from './shared/layouts/MainLayout';
import GlobalDashboard from './shared/admin/pages/GlobalDashboard';
import ForgotPassword from './shared/admin/pages/auth/ForgotPassword';
import LoginPage from './shared/admin/pages/auth/LoginPage';

// --- PROJET 1 (Admin & Scolarité) ---
import InscriptionsList from './projet1/admin/pages/inscriptions/InscriptionsList';
import InscriptionDetail from './projet1/admin/pages/inscriptions/InscriptionDetail';
import StudentsList from './projet1/admin/pages/eleves/StudentsList';
import StudentProfile from './projet1/admin/pages/eleves/StudentProfile';
import StudentCardsPage from './projet1/admin/pages/eleves/StudentCardsPage';
import StudentFormModal from './projet1/admin/pages/eleves/StudentFormModal';
import ClassesList from './projet1/admin/pages/classes/ClassesList';
import ClassDetail from './projet1/admin/pages/classes/ClassDetail';
import ClassFormModal from './projet1/admin/pages/classes/ClassFormModal';
import AffectationsManager from './projet1/admin/pages/classes/AffectationsManager';
import SystemSettings from './projet1/admin/pages/SystemSettings';
import DocumentsHistory from './projet1/admin/pages/documents/DocumentsHistory';

// --- PROJET 2 (Finance) ---
import FinancialDashboard from './projet2/admin/FinancialDashboard';

// --- PROJET 3 (Pédagogie) ---

// --- PROJET 4 (Vie Scolaire) ---
import PermissionsManager from './projet4/Permissions';

// --- PAGE D'ACCUEIL (Landing Page) ---
const Home = () => (
  <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-[#1a2035] text-white font-sans">
    <div className="max-w-md w-full p-10 text-center space-y-8 bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10 shadow-2xl">
      <div className="w-20 h-20 bg-[#eb8e3a] rounded-2xl flex items-center justify-center mx-auto text-[#1a2035] shadow-lg shadow-orange-500/20">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
      </div>
      
      <div>
        <h1 className="text-4xl font-black tracking-tight mb-2">School<span className="text-[#eb8e3a]">Hub</span></h1>
        <p className="text-white/40 font-medium">Plateforme de gestion scolaire unifiée.</p>
      </div>

      <div className="space-y-4 pt-4">
        {/* Lien vers l'espace Parent (Futur) */}
        <Link
          to="/parent" 
          className="block w-full py-4 px-6 bg-[#eb8e3a] text-[#1a2035] font-bold rounded-2xl hover:bg-[#d67e2a] hover:scale-[1.02] transition-all shadow-lg shadow-orange-950/20"
        >
          Accéder à l'Espace Parent
        </Link>
        
        {/* Lien vers l'espace Admin */}
        <Link
          to="/admin"
          className="block w-full py-4 px-6 bg-white/5 text-white font-bold rounded-2xl hover:bg-white/10 hover:scale-[1.02] transition-all border border-white/10"
        >
          Portail Administration
        </Link>
      </div>
      
      <div className="pt-8 text-xs text-white/20">
        © 2025 SchoolHub Inc. v1.0
      </div>
    </div>
  </div>
);

// --- PROTECTED ROUTE COMPONENT ---
const ProtectedRoute = ({ isAuthenticated, children }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  // --- ÉTAT GLOBAL (AUTH) ---
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('token') !== null || sessionStorage.getItem('token') !== null;
  });

  const handleLogin = (token, rememberMe) => {
    setIsAuthenticated(true);
    if (rememberMe) localStorage.setItem('token', token);
    else sessionStorage.setItem('token', token);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
  };

  // --- ÉTAT GLOBAL (DONNÉES MÉTIER) ---
  const [inscriptions, setInscriptions] = useState([
    { id: 'INS-2025-042', firstName: 'Jean', lastName: 'Dupont', class: '2nde C', date: '19 Déc 2025', status: 'pending', payment: 'partial', docs: 'complete', email: 'p.dupont@email.com' },
    { id: 'INS-2025-041', firstName: 'Amina', lastName: 'Kone', class: 'Terminale D', date: '18 Déc 2025', status: 'validated', payment: 'paid', docs: 'complete', email: 'kone.famille@email.com' },
    { id: 'INS-2025-039', firstName: 'Lucas', lastName: 'Martin', class: '1ère A', date: '15 Déc 2025', status: 'rejected', payment: 'unpaid', docs: 'missing', email: 'lucas.m@email.com' },
  ]);

  const [studentsData, setStudentsData] = useState([
    { id: 'MAT-25-041', firstName: 'Amina', lastName: 'Kone', class: 'Terminale D', gender: 'F', parent: 'Mme Kone', phone: '96554433', status: 'active', level: 'Lycée', birthDate: '03/08/2009' },
    { id: 'MAT-25-035', firstName: 'Marc', lastName: 'Evan', class: '3ème A', gender: 'M', parent: 'Luc Evan', phone: '94778899', status: 'active', level: 'Collège', birthDate: '20/01/2013' },
  ]);

  const [classesData, setClassesData] = useState([
    { id: 1, name: '6ème A', level: 'Collège', root: '6ème', series: null, studentCount: 45, capacity: 50, mainTeacher: 'M. Kpoton' },
    { id: 2, name: '3ème A', level: 'Collège', root: '3ème', series: 'A', studentCount: 38, capacity: 40, mainTeacher: 'M. Mensah' },
    { id: 3, name: 'Tle D', level: 'Lycée', root: 'Terminale', series: 'D', studentCount: 30, capacity: 35, mainTeacher: 'Mme. Dupont' },
  ]);

  // --- MODALS GLOBAUX ---
  const [modalState, setModalState] = useState({ type: null, data: null });
  
  const openStudentModal = (student = null) => setModalState({ type: 'student', data: student });
  const openClassModal = (cls = null) => setModalState({ type: 'class', data: cls });
  const closeModal = () => setModalState({ type: null, data: null });

  // --- HANDLERS MÉTIER ---
  const handleSaveClass = (classForm) => {
    let baseName = `${classForm.root} ${classForm.series || ''}`.trim();
    let finalName = baseName;
    let counter = 2;
    const otherClasses = modalState.data 
        ? classesData.filter(c => c.id !== modalState.data.id) 
        : classesData;

    while (otherClasses.some(c => c.name === finalName)) {
        finalName = `${baseName}${counter}`;
        counter++;
    }

    const finalClassData = { ...classForm, name: finalName, series: classForm.series || null };

    if (modalState.data) {
      setClassesData(prev => prev.map(c => c.id === modalState.data.id ? { ...finalClassData, id: modalState.data.id, studentCount: c.studentCount } : c));
    } else {
      setClassesData(prev => [...prev, { ...finalClassData, id: Date.now(), studentCount: 0 }]);
    }
    closeModal();
  };

  const handleSaveStudent = (studentForm) => {
    if (modalState.data) {
      setStudentsData(prev => prev.map(s => s.id === modalState.data.id ? studentForm : s));
    } else {
      setStudentsData(prev => [studentForm, ...prev]);
    }
    closeModal();
  };

  const handleValidateInscription = (id) => {
    const inscription = inscriptions.find(i => i.id === id);
    if (!inscription) return;

    setInscriptions(prev => prev.map(item => item.id === id ? { ...item, status: 'validated' } : item));
    
    setStudentsData(prev => [...prev, {
      id: `MAT-25-${id.split('-')[2]}`, 
      firstName: inscription.firstName,
      lastName: inscription.lastName,
      class: inscription.class, 
      gender: 'M',
      parent: 'Parent Inconnu',
      phone: '00000000',
      status: 'active',
      birthDate: '--/--/----'
    }]);
  };

  return (
    <BrowserRouter>
      <Routes>
        
        {/* === ROUTE PUBLIQUE : ACCUEIL === */}
        <Route path="/" element={<Home />} />

        {/* AUTHENTIFICATION */}
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* === ESPACE ADMIN (PROTÉGÉ) === */}
        <Route path="/admin" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <MainLayout onLogout={handleLogout}>
              <Outlet />
            </MainLayout>
          </ProtectedRoute>
        }>
          
          <Route index element={<GlobalDashboard />} />

          <Route path="inscriptions" element={
            <InscriptionsList 
              inscriptions={inscriptions} 
              onQuickValidate={handleValidateInscription}
              onViewDetails={(item) => console.log("Voir détail", item)}
            />
          } />

          <Route path="eleves" element={
            <StudentsList 
              students={studentsData} 
              classes={classesData}
              onAddStudent={() => openStudentModal(null)}
              onEditStudent={(s) => openStudentModal(s)}
              onViewProfile={(s) => console.log("Profil", s)}
            />
          } />
          <Route path="cartes" element={<StudentCardsPage students={studentsData} />} />

          <Route path="classes" element={
            <ClassesList 
              classes={classesData}
              onAddClass={() => openClassModal(null)}
              onViewDetails={(cls) => console.log("Voir classe", cls.id)}
            />
          } />
          <Route path="affectations" element={<AffectationsManager onBack={() => window.history.back()} />} />

          <Route path="documents" element={<DocumentsHistory />} />
          <Route path="parametres" element={<SystemSettings />} />

          {/* Placeholders pour les modules futurs */}
          <Route path="finance" element={<FinancialDashboard />} />
          <Route path="notes" element={<div className="p-10 text-center text-slate-500">Module Pédagogie (Projet 3) en cours d'intégration...</div>} />
          <Route path="vie-scolaire" element={<PermissionsManager />} />

        </Route>

        {/* === ESPACE PARENT (FUTUR) === */}
        <Route path="/parent/*" element={
          <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-600">
            Interface Parent en construction...
          </div>
        } />

      </Routes>

      {/* MODALS GLOBAUX (ADMIN) */}
      <ClassFormModal 
        isOpen={modalState.type === 'class'} 
        onClose={closeModal} 
        initialData={modalState.data} 
        onSubmit={handleSaveClass} 
      />
      
      <StudentFormModal 
        isOpen={modalState.type === 'student'} 
        onClose={closeModal} 
        initialData={modalState.data} 
        availableClasses={classesData} 
        onSubmit={handleSaveStudent} 
      />

    </BrowserRouter>
  );
}
import { useState, useEffect } from 'react';
import ApiService from './utils/api';

function App() {
    const [remboursements, setRemboursements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statistiques, setStatistiques] = useState({});

    // Charger les données
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            // Test de connexion API
            const test = await ApiService.testConnection();
            console.log('API Test:', test);

            // Charger les remboursements
            const result = await ApiService.getRemboursements({
                statut: 'tous',
                per_page: 50
            });

            if (result.success) {
                setRemboursements(result.data.data);
                setStatistiques(result.data.statistiques);
            } else {
                setError(result.message);
            }

            // Charger les statistiques
            const stats = await ApiService.getStatistiques();
            if (stats.success) {
                setStatistiques(stats.data);
            }

        } catch (err) {
            setError('Erreur de connexion au serveur');
            console.error('Erreur:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleChangeStatut = async (id, newStatut) => {
        try {
            const result = await ApiService.changeStatut(id, newStatut);
            
            if (result.success) {
                // Mettre à jour localement
                setRemboursements(prev => 
                    prev.map(item => 
                        item.id === id ? result.data : item
                    )
                );
                alert('Statut mis à jour avec succès');
            } else {
                alert('Erreur: ' + result.message);
            }
        } catch (err) {
            alert('Erreur lors de la mise à jour');
        }
    };

    const formatMontant = (montant) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'XAF',
            minimumFractionDigits: 0
        }).format(montant);
    };

    if (loading) {
        return React.createElement('div', { className: 'loading' },
            React.createElement('div', null, 'Chargement des données...')
        );
    }

    if (error) {
        return React.createElement('div', { className: 'error' },
            React.createElement('h2', null, 'Erreur'),
            React.createElement('p', null, error),
            React.createElement('button', { onClick: loadData }, 'Réessayer')
        );
    }

    return React.createElement('div', { className: 'app' },
        // En-tête
        React.createElement('header', null,
            React.createElement('h1', null, 'Gestion des Remboursements'),
            React.createElement('div', { className: 'stats' },
                React.createElement('div', { className: 'stat' },
                    React.createElement('span', null, 'Total:'),
                    React.createElement('strong', null, statistiques.total || 0)
                ),
                React.createElement('div', { className: 'stat' },
                    React.createElement('span', null, 'Montant total:'),
                    React.createElement('strong', null, formatMontant(statistiques.montant_total || 0))
                )
            )
        ),

        // Tableau
        React.createElement('table', null,
            React.createElement('thead', null,
                React.createElement('tr', null,
                    ['N° Dossier', 'Étudiant', 'Montant', 'Motif', 'Date', 'Statut', 'Actions'].map(header =>
                        React.createElement('th', { key: header }, header)
                    )
                )
            ),
            React.createElement('tbody', null,
                remboursements.map(item =>
                    React.createElement('tr', { key: item.id },
                        React.createElement('td', null, item.numero_dossier),
                        React.createElement('td', null,
                            React.createElement('div', null,
                                React.createElement('strong', null, item.etudiant?.nom_complet),
                                React.createElement('small', null, item.etudiant?.matricule)
                            )
                        ),
                        React.createElement('td', null, formatMontant(item.montant)),
                        React.createElement('td', null, item.motif_label),
                        React.createElement('td', null, new Date(item.date_demande).toLocaleDateString()),
                        React.createElement('td', null,
                            React.createElement('span', {
                                className: `status status-${item.statut}`
                            }, item.statut_label)
                        ),
                        React.createElement('td', null,
                            item.statut === 'en_attente' && React.createElement('div', null,
                                React.createElement('button', {
                                    className: 'btn btn-success',
                                    onClick: () => handleChangeStatut(item.id, 'approuve')
                                }, 'Approuver'),
                                React.createElement('button', {
                                    className: 'btn btn-danger',
                                    onClick: () => handleChangeStatut(item.id, 'refuse')
                                }, 'Refuser')
                            ),
                            React.createElement('button', {
                                className: 'btn btn-info',
                                onClick: () => alert(`Détails: ${item.numero_dossier}`)
                            }, 'Détails')
                        )
                    )
                )
            )
        ),

        // Formulaire de nouveau remboursement (simplifié)
        React.createElement('div', { className: 'new-remboursement' },
            React.createElement('h2', null, 'Nouveau Remboursement'),
            React.createElement('button', {
                className: 'btn btn-primary',
                onClick: () => {
                    // Ouvrir formulaire modal
                    const etudiantId = prompt('ID Étudiant:');
                    const paiementId = prompt('ID Paiement:');
                    const montant = prompt('Montant:');
                    const motif = prompt('Motif:');
                    
                    if (etudiantId && paiementId && montant && motif) {
                        ApiService.createRemboursement({
                            etudiant_id: parseInt(etudiantId),
                            paiement_id: parseInt(paiementId),
                            montant: parseFloat(montant),
                            motif: motif
                        }).then(result => {
                            if (result.success) {
                                alert('Remboursement créé!');
                                loadData();
                            } else {
                                alert('Erreur: ' + result.message);
                            }
                        });
                    }
                }
            }, 'Créer un nouveau remboursement')
        )
    );
}

// Styles
const styles = `
    .app {
        padding: 20px;
        font-family: Arial, sans-serif;
    }
    
    header {
        background: #1976d2;
        color: white;
        padding: 20px;
        border-radius: 8px;
        margin-bottom: 20px;
    }
    
    .stats {
        display: flex;
        gap: 20px;
        margin-top: 10px;
    }
    
    .stat {
        background: rgba(255,255,255,0.2);
        padding: 10px 20px;
        border-radius: 4px;
    }
    
    table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 20px;
    }
    
    th, td {
        padding: 12px;
        text-align: left;
        border-bottom: 1px solid #ddd;
    }
    
    th {
        background: #f5f5f5;
        font-weight: bold;
    }
    
    .status {
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: bold;
    }
    
    .status-en_attente {
        background: #ff9800;
        color: white;
    }
    
    .status-approuve {
        background: #4caf50;
        color: white;
    }
    
    .status-refuse {
        background: #f44336;
        color: white;
    }
    
    .btn {
        padding: 6px 12px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        margin-right: 5px;
    }
    
    .btn-success {
        background: #4caf50;
        color: white;
    }
    
    .btn-danger {
        background: #f44336;
        color: white;
    }
    
    .btn-info {
        background: #2196f3;
        color: white;
    }
    
    .btn-primary {
        background: #1976d2;
        color: white;
        padding: 10px 20px;
    }
    
    .new-remboursement {
        background: #f9f9f9;
        padding: 20px;
        border-radius: 8px;
    }
    
    .loading, .error {
        padding: 40px;
        text-align: center;
    }
    
    .error {
        color: #d32f2f;
    }
`;

// Ajouter les styles au document
const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);



export default App;