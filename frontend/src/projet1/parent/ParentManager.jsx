import React, { useState } from 'react';
import ParentLayout from './layout/ParentLayout';
import ParentLogin from './pages/ParentLogin';
import ParentRegister from './pages/ParentRegister';
import Dashboard from './pages/Dashboard';
import Registration from './pages/Registration';
import Notifications from './pages/Notifications';
import MyChildren from './pages/MyChildren';
import Payments from './pages/Payments';
import Grades from './pages/Grades';
import Attendance from './pages/Attendance';
import { Settings, ClipboardCheck, CreditCard, Bell } from 'lucide-react';
import SettingsPage from './pages/Settings';
import './styles/theme.css';

// Simple placeholder for unimplemented pages
const PlaceholderPage = ({ title, icon: Icon }) => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <div className="p-8 rounded-full bg-white/5 text-[#eb8e3a]">
            <Icon size={64} />
        </div>
        <h2 className="text-3xl font-bold">{title}</h2>
        <p className="text-white/40 max-w-md">
            Le module "{title}" est en cours de développement. Vous y retrouverez bientôt toutes les informations relatives à la scolarité de vos enfants.
        </p>
    </div>
);

const ParentManager = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
    const [currentPage, setCurrentPage] = useState('dashboard');
    const [registrationParams, setRegistrationParams] = useState({ mode: 'new', childData: null });

    // Centralized children data
    const [children] = useState([
        { id: 1, name: 'Jean Dupont', grade: '6ème', gender: 'Masculin', birthDate: '12/05/2012', photo: 'https://i.pravatar.cc/150?u=jean', registrationValidated: true, cardDelivered: true },
        { id: 2, name: 'Marie-Laure Dupont', grade: '3ème', gender: 'Féminin', birthDate: '05/09/2009', photo: 'https://i.pravatar.cc/150?u=marie-laure', registrationValidated: false, cardDelivered: false },
    ]);

    const [selectedChildId, setSelectedChildId] = useState(children[0]?.id || null);

    const handleLogin = () => setIsAuthenticated(true);
    const handleLogout = () => {
        setIsAuthenticated(false);
        setAuthMode('login');
        setCurrentPage('dashboard');
        setRegistrationParams({ mode: 'new', childData: null });
        setSelectedChildId(children[0]?.id || null);
    };

    const handleNavigate = (page, params = { mode: 'new', childData: null }) => {
        if (page === 'registration') {
            setRegistrationParams(params);
        }
        setCurrentPage(page);
    };

    const renderPage = () => {
        const commonProps = {
            children: children,
            selectedChildId: selectedChildId,
            setSelectedChildId: setSelectedChildId
        };

        switch (currentPage) {
            case 'dashboard':
                return <Dashboard {...commonProps} onNavigate={handleNavigate} />;
            case 'children':
                return <MyChildren children={children} onNavigate={handleNavigate} />;
            case 'payments':
                return <Payments {...commonProps} />;
            case 'grades':
                return <Grades {...commonProps} />;
            case 'attendance':
                return <Attendance {...commonProps} />;
            case 'notifications':
                return <Notifications />;
            case 'registration':
                return <Registration
                    mode={registrationParams.mode}
                    initialData={registrationParams.childData}
                    onComplete={() => handleNavigate('children')}
                />;
            case 'settings':
                return <SettingsPage onLogout={handleLogout} />;
            default:
                return <Dashboard {...commonProps} onNavigate={handleNavigate} />;
        }
    };

    if (!isAuthenticated) {
        return authMode === 'login'
            ? <ParentLogin onLogin={handleLogin} onNavigateToRegister={() => setAuthMode('register')} />
            : <ParentRegister onRegister={handleLogin} onNavigateToLogin={() => setAuthMode('login')} />;
    }

    return (
        <ParentLayout
            currentPage={currentPage}
            onNavigate={(page) => handleNavigate(page)}
            onLogout={handleLogout}
        >
            {renderPage()}
        </ParentLayout>
    );
};

export default ParentManager;
