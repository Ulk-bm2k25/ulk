import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, Outlet, Link } from 'react-router-dom';

// --- LAYOUTS & GLOBAL ---
import MainLayout from '../shared/admin/layouts/MainLayout';
import GlobalDashboard from '../shared/admin/pages/GlobalDashboard';
import ForgotPassword from '../shared/admin/pages/auth/ForgotPassword';
import LoginPage from '../shared/admin/pages/auth/LoginPage';

// --- PROJET 1 (Admin & Scolarité) ---
import InscriptionsList from './admin/pages/inscriptions/InscriptionsList';
import InscriptionDetail from './admin/pages/inscriptions/InscriptionDetail';
import StudentsList from './admin/pages/eleves/StudentsList';
import StudentProfile from './admin/pages/eleves/StudentProfile';
import StudentCardsPage from './admin/pages/eleves/StudentCardsPage';
import StudentFormModal from './admin/pages/eleves/StudentFormModal';
import ClassesList from './admin/pages/classes/ClassesList';
import ClassDetail from './admin/pages/classes/ClassDetail';
import ClassFormModal from './admin/pages/classes/ClassFormModal';
import AffectationsManager from './admin/pages/classes/AffectationsManager';
import SystemSettings from './admin/pages/SystemSettings';
import DocumentsHistory from './admin/pages/documents/DocumentsHistory';

// --- PROJET 2 (Finance) ---
import FinancialDashboard from '../projet2/admin/FinancialDashboard';
// --- PROJET 3 (Pédagogie) ---
import NotesManager from '../projet3/admin/NotesManager';
// --- PROJET 4 (Vie Scolaire) ---
import PresenceManager from '../projet4/admin/PresenceManager';

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
        <p className="text-white/40 font-medium">Module Inscription & Réinscription</p>
      </div>

      <div className="space-y-4 pt-4">
        {/* Bouton retour vers sélecteur de portails */}
        <Link
          to="/" 
          className="block w-full py-4 px-6 bg-white/5 text-white font-bold rounded-2xl hover:bg-white/10 hover:scale-[1.02] transition-all border border-white/10"
        >
          ← Retour aux Portails
        </Link>
        
        {/* Lien vers l'espace Parent (Futur) */}
        <Link
          to="/admin/parent" 
          className="block w-full py-4 px-6 bg-[#eb8e3a] text-[#1a2035] font-bold rounded-2xl hover:bg-[#d67e2a] hover:scale-[1.02] transition-all shadow-lg shadow-orange-950/20"
        >
          Accéder à l'Espace Parent
        </Link>
        
        {/* Lien vers l'espace Admin */}
        <Link
          to="/admin/dashboard"
          className="block w-full py-4 px-6 bg-[#eb8e3a] text-[#1a2035] font-bold rounded-2xl hover:bg-[#d67e2a] hover:scale-[1.02] transition-all shadow-lg shadow-orange-950/20"
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
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

function App() {
  // --- ÉTAT GLOBAL (AUTH) ---
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('APP_CONFIG.STORAGE_KEYS.TOKEN') !== null ;
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
  <>
    <Routes>
      {/* === PAGE D'ACCUEIL DU MODULE === */}
      <Route path="/" element={<Home />} />

      {/* AUTHENTIFICATION */}
      <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* === ESPACE ADMIN (PROTÉGÉ) === */}
      <Route 
        path="/dashboard/*" 
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <MainLayout onLogout={handleLogout}>
              <Outlet />
            </MainLayout>
          </ProtectedRoute>
        }
      >
        {/* Dashboard principal */}
        <Route index element={<GlobalDashboard />} />

        {/* Inscriptions */}
        <Route 
          path="inscriptions" 
          element={
            <InscriptionsList 
              inscriptions={inscriptions} 
              onQuickValidate={handleValidateInscription}
              onViewDetails={(item) => console.log("Voir détail", item)}
            />
          } 
        />

        {/* Élèves */}
        <Route 
          path="eleves" 
          element={
            <StudentsList 
              students={studentsData} 
              classes={classesData}
              onAddStudent={() => openStudentModal(null)}
              onEditStudent={(s) => openStudentModal(s)}
              onViewProfile={(s) => console.log("Profil", s)}
            />
          } 
        />
        <Route path="cartes" element={<StudentCardsPage students={studentsData} />} />

        {/* Classes */}
        <Route 
          path="classes" 
          element={
            <ClassesList 
              classes={classesData}
              onAddClass={() => openClassModal(null)}
              onViewDetails={(cls) => console.log("Voir classe", cls.id)}
            />
          } 
        />
        <Route path="affectations" element={<AffectationsManager onBack={() => window.history.back()} />} />

        {/* Autres */}
        <Route path="documents" element={<DocumentsHistory />} />
        <Route path="parametres" element={<SystemSettings />} />

        {/* Modules futurs */}
        <Route path="finance" element={<FinancialDashboard />} />
        <Route path="notes/*" element={<NotesManager />} />
        <Route path="vie-scolaire/*" element={<PresenceManager />} />
      </Route>

      {/* === ESPACE PARENT (FUTUR) === */}
      <Route 
        path="/parent/*" 
        element={
          <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-600">
            Interface Parent en construction...
          </div>
        } 
      />
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
  </>
);
}

export default App;