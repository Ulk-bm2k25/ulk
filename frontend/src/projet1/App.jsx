import React, { useState } from 'react';
import LoginPage from './pages/admin/LoginPage';
import DashboardPage from './pages/admin/DashboardPage';
import AdminLayout from './layout/AdminLayout';
import PlaceholderPage from './pages/admin/PlaceholderPage';
import InscriptionsList from './pages/admin/inscriptions/InscriptionsList';
import { FileText, Users, School, FileCheck, Bell, Settings } from 'lucide-react';

// App principal
const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Initialisé à true pour le développement
  const [currentPage, setCurrentPage] = useState('dashboard');

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage('dashboard');
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'inscriptions':
        return <InscriptionsList />;
      case 'eleves':
        return <PlaceholderPage title="Élèves" icon={Users} />;
      case 'classes':
        return <PlaceholderPage title="Classes" icon={School} />;
      case 'documents':
        return <PlaceholderPage title="Documents" icon={FileCheck} />;
      case 'notifications':
        return <PlaceholderPage title="Notifications" icon={Bell} />;
      case 'parametres':
        return <PlaceholderPage title="Paramètres" icon={Settings} />;
      default:
        return <DashboardPage />;
    }
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

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

export default App