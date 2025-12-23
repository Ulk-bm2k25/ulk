import React, { useState } from 'react';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import InscriptionsList from './pages/inscriptions/InscriptionsList';
import InscriptionDetail from './pages/inscriptions/InscriptionDetail';
import StudentsList from './pages/eleves/StudentsList';
import StudentProfile from './pages/eleves/StudentProfile';
import AdminLayout from './layout/AdminLayout';
import PlaceholderPage from './pages/PlaceholderPage';
import { FileText, Users, School, FileCheck, Bell, Settings } from 'lucide-react';

const AdminManager = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentPage, setCurrentPage] = useState('dashboard');

    // Nouvel état pour stocker l'élève sélectionné
    const [selectedInscription, setSelectedInscription] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);

    const handleLogin = () => setIsAuthenticated(true);

    const handleLogout = () => {
        setIsAuthenticated(false);
        setCurrentPage('dashboard');
        setSelectedInscription(null);
    };

    const handleNavigate = (page) => {
        setCurrentPage(page);
        setSelectedInscription(null);
        setSelectedStudent(null);
    };

    // Fonction pour aller vers les détails
    const handleViewInscriptionDetails = (inscriptionData) => {
        setSelectedInscription(inscriptionData);
    };

    // Fonction pour revenir à la liste
    const handleBackToInscriptionsList = () => {
        setSelectedInscription(null);
    };

    const renderPage = () => {
        switch (currentPage) {
            case 'dashboard':
                return <DashboardPage onNavigate={handleNavigate} />;

            case 'inscriptions':
                // Logique conditionnelle ici :
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
                return <PlaceholderPage title="Classes" icon={School} />;
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
