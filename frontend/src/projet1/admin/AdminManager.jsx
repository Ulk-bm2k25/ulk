import React, { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import InscriptionsList from './pages/inscriptions/InscriptionsList';
import InscriptionDetail from './pages/inscriptions/InscriptionDetail';
import StudentsList from './pages/eleves/StudentsList';
import StudentProfile from './pages/eleves/StudentProfile';
import ClassesList from './pages/classes/ClassesList';
import ClassDetail from './pages/classes/ClassDetail';
import ClassFormModal from './pages/classes/ClassFormModal';
import AffectationsManager from './pages/classes/AffectationsManager';
import AdminLayout from './layout/AdminLayout';
import PlaceholderPage from './pages/PlaceholderPage';
import SendNotification from './pages/SendNotification';
import SystemSettings from './pages/SystemSettings';
import DocumentsHistory from './pages/documents/DocumentsHistory';
import StudentCardsPage from './pages/eleves/StudentCardsPage';
import { FileText, Users, School, FileCheck, Bell, Settings } from 'lucide-react';

const AdminManager = () => {
  // 1. INITIALISATION INTELLIGENTE
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('auth_token') === 'true' || sessionStorage.getItem('auth_token') === 'true';
  });

  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedInscription, setSelectedInscription] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [isAffectationMode, setIsAffectationMode] = useState(false);
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);

  // Données initiales pour les inscriptions (Mock)
  const [inscriptions, setInscriptions] = useState([
    { id: 'INS-2025-042', firstName: 'Jean', lastName: 'Dupont', class: 'Seconde C', date: '19 Déc 2025', status: 'pending', payment: 'partial', docs: 'complete', email: 'p.dupont@email.com' },
    { id: 'INS-2025-041', firstName: 'Amina', lastName: 'Kone', class: 'Terminale D', date: '18 Déc 2025', status: 'validated', payment: 'paid', docs: 'complete', email: 'kone.famille@email.com' },
    { id: 'INS-2025-039', firstName: 'Lucas', lastName: 'Martin', class: '1ère A', date: '15 Déc 2025', status: 'rejected', payment: 'unpaid', docs: 'missing', email: 'lucas.m@email.com' },
    { id: 'INS-2025-038', firstName: 'Sarah', lastName: 'Bensoussan', class: '6ème', date: '14 Déc 2025', status: 'pending', payment: 'paid', docs: 'missing', email: 's.bensoussan@email.com' },
    { id: 'INS-2025-035', firstName: 'Marc', lastName: 'Evan', class: '3ème', date: '10 Déc 2025', status: 'validated', payment: 'paid', docs: 'complete', email: 'marc.e@email.com' },
  ]);

  const [students, setStudents] = useState([
    { id: 'MAT-25-041', firstName: 'Amina', lastName: 'Kone', class: 'Terminale D', gender: 'F', parent: 'Mme Kone', phone: '96554433', status: 'active', level: 'Lycée', birthDate: '03/08/2009' },
    { id: 'MAT-25-035', firstName: 'Marc', lastName: 'Evan', class: '3ème', gender: 'M', parent: 'Luc Evan', phone: '94778899', status: 'active', level: 'Collège', birthDate: '20/01/2013' },
  ]);

  // 2. MODIFICATION DE LA FONCTION LOGIN
  // Elle accepte maintenant le paramètre "rememberMe"
  const handleLogin = (rememberMe = false) => {
    setIsAuthenticated(true);

    // Si "Se souvenir de moi", on stocke dans localStorage (persistant même après fermeture)
    // Sinon, on stocke dans sessionStorage (persistant au refresh, mais effacé à la fermeture)
    if (rememberMe) {
      localStorage.setItem('auth_token', 'true');
    } else {
      sessionStorage.setItem('auth_token', 'true');
    }
  };

  // 3. MODIFICATION DU LOGOUT
  // On nettoie tout
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('auth_token');
    sessionStorage.removeItem('auth_token');
    setCurrentPage('dashboard');
    setSelectedInscription(null);
    setSelectedStudent(null);
    setSelectedClass(null);
    setIsAffectationMode(false);
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
    setSelectedInscription(null);
    setSelectedStudent(null);
    setSelectedClass(null);
    setIsAffectationMode(false);
  };

  const handleViewInscriptionDetails = (inscriptionData) => {
    // On s'assure de passer l'objet le plus à jour venant du state
    const freshData = inscriptions.find(i => i.id === inscriptionData.id) || inscriptionData;
    setSelectedInscription(freshData);
  };

  const handleBackToInscriptionsList = () => {
    setSelectedInscription(null);
  };

  // --- NOUVEAU : Logique de validation ---
  const handleValidateInscription = (id) => {
    const inscription = inscriptions.find(i => i.id === id);
    if (!inscription) return;

    // 1. Mettre à jour le statut de l'inscription
    setInscriptions(prev => prev.map(item =>
      item.id === id ? { ...item, status: 'validated' } : item
    ));

    // 2. Créer automatiquement l'élève (Simulation d'écriture en base)
    const newStudent = {
      id: `MAT-25-${id.split('-')[2]}`, // On garde la fin de l'ID inscription pour le matricule
      firstName: inscription.firstName,
      lastName: inscription.lastName,
      class: inscription.class,
      gender: 'M', // Par défaut pour la démo
      parent: inscription.lastName + ' Parent',
      phone: '0102030405',
      status: 'active',
      level: inscription.class.includes('ème') ? 'Collège' : 'Lycée',
      birthDate: '01/01/2010'
    };

    setStudents(prev => [...prev, newStudent]);
    setSelectedInscription(null); // Retour à la liste après validation
  };

  const handleRejectInscription = (id) => {
    setInscriptions(prev => prev.map(item =>
      item.id === id ? { ...item, status: 'rejected' } : item
    ));
    setSelectedInscription(null); // Retour à la liste après rejet
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage onNavigate={handleNavigate} />;

      case 'inscriptions':
        if (selectedInscription) {
          // On s'assure de passer l'objet le plus à jour
          const currentInscription = inscriptions.find(i => i.id === selectedInscription.id);
          return (
            <InscriptionDetail
              data={currentInscription}
              onBack={handleBackToInscriptionsList}
              onValidate={handleValidateInscription}
              onReject={handleRejectInscription}
              onNavigate={handleNavigate}
            />
          );
        }
        return (
          <InscriptionsList
            inscriptions={inscriptions}
            onViewDetails={handleViewInscriptionDetails}
          />
        );

      case 'eleves':
        if (selectedStudent) {
          return (
            <StudentProfile
              student={selectedStudent}
              onBack={() => setSelectedStudent(null)}
            />
          );
        }
        return (
          <StudentsList
            students={students}
            onViewProfile={(student) => setSelectedStudent(student)}
            onNavigate={handleNavigate}
          />
        );
      case 'classes':
        if (isAffectationMode) {
          return <AffectationsManager onBack={() => setIsAffectationMode(false)} />;
        }
        if (selectedClass) {
          return (
            <ClassDetail
              classData={selectedClass}
              onBack={() => setSelectedClass(null)}
              onEdit={(cls) => {
                setEditingClass(cls);
                setIsClassModalOpen(true);
              }}
            />
          );
        }
        return (
          <ClassesList
            onViewDetails={(cls) => setSelectedClass(cls)}
            onManageAffectations={() => setIsAffectationMode(true)}
            onAddClass={() => {
              setEditingClass(null);
              setIsClassModalOpen(true);
            }}
          />
        );
      case 'qr':
        return <StudentCardsPage students={students} />;
      case 'documents':
        return <DocumentsHistory />;
      case 'notifications':
        return <SendNotification />;
      case 'parametres':
        return <SystemSettings />;
      default:
        return <DashboardPage />;
    }
  };

  if (!isAuthenticated) return <LoginPage onLogin={handleLogin} />;

  return (
    <>
      <AdminLayout
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      >
        {renderPage()}
      </AdminLayout>

      <ClassFormModal
        isOpen={isClassModalOpen}
        onClose={() => setIsClassModalOpen(false)}
        initialData={editingClass}
        onSubmit={(data) => {
          console.log("Submit Class Data:", data);
          // Simulation : Si on modifie la classe actuellement sélectionnée, on la met à jour
          if (selectedClass && selectedClass.id === data.id) {
            setSelectedClass(data);
          }
          setIsClassModalOpen(false);
          alert(`Classe "${data.name}" ${editingClass ? 'modifiée' : 'créée'} avec succès !`);
        }}
      />
    </>
  );
};

export default AdminManager;