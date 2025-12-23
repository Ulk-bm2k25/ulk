import React, { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import InscriptionsList from './pages/inscriptions/InscriptionsList';
import InscriptionDetail from './pages/inscriptions/InscriptionDetail';
import StudentsList from './pages/eleves/StudentsList';
import StudentProfile from './pages/eleves/StudentProfile';
import ClassesList from './pages/classes/ClassesList';
import ClassDetail from './pages/classes/ClassDetail';
import AffectationsManager from './pages/classes/AffectationsManager';
import AdminLayout from './layout/AdminLayout';
import PlaceholderPage from './pages/PlaceholderPage';
import { FileText, Users, School, FileCheck, Bell, Settings } from 'lucide-react';

const AdminManager = () => {
  // 1. INITIALISATION INTELLIGENTE
  // On vérifie directement dans le stockage si l'utilisateur était connecté
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('auth_token') === 'true' || sessionStorage.getItem('auth_token') === 'true';
  });

  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedInscription, setSelectedInscription] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [isAffectationMode, setIsAffectationMode] = useState(false);

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
    setSelectedInscription(inscriptionData);
  };

  const handleBackToInscriptionsList = () => {
    setSelectedInscription(null);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage onNavigate={handleNavigate} />;
        
      case 'inscriptions':
        if (selectedInscription) {
          return (
            <InscriptionDetail 
              data={selectedInscription} 
              onBack={handleBackToInscriptionsList} 
            />
          );
        }
        return (
          <InscriptionsList 
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
            onViewProfile={(student) => setSelectedStudent(student)} 
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
            />
          );
        }
        return (
          <ClassesList 
            onViewDetails={(cls) => setSelectedClass(cls)} // <--- Connection ici
            onManageAffectations={() => setIsAffectationMode(true)} 
          />
        );
      case 'qr':
        return <PlaceholderPage title="QR Codes" icon={FileCheck} />;
      case 'notifications':
        return <PlaceholderPage title="Notifications" icon={Bell} />;
      case 'parametres':
        return <PlaceholderPage title="Paramètres" icon={Settings} />;
      default:
        return <DashboardPage />;
    }
  };

  if (!isAuthenticated) return <LoginPage onLogin={handleLogin} />;

  return (
    <AdminLayout
      currentPage={currentPage}
      onNavigate={handleNavigate}
      onLogout={handleLogout}
    >
      {renderPage()}
    </AdminLayout>
  );
};

export default AdminManager;