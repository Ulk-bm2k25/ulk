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

    const handleLogin = () => setIsAuthenticated(true);
    const handleLogout = () => {
        setIsAuthenticated(false);
        setAuthMode('login');
        setCurrentPage('dashboard');
    };

    const renderPage = () => {
        switch (currentPage) {
            case 'dashboard':
                return <Dashboard />;
            case 'children':
                return <MyChildren />;
            case 'payments':
                return <Payments />;
            case 'grades':
                return <Grades />;
            case 'attendance':
                return <Attendance />;
            case 'notifications':
                return <Notifications />;
            case 'registration':
                return <Registration />;
            case 'settings':
                return <PlaceholderPage title="Settings" icon={Settings} />;
            default:
                return <Dashboard />;
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
            onNavigate={setCurrentPage}
            onLogout={handleLogout}
        >
            {renderPage()}
        </ParentLayout>
    );
};

export default ParentManager;
