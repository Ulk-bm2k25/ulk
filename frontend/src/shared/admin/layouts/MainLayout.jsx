import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  GraduationCap, 
  Users,         
  School,        
  FileText,      
  DollarSign,    
  CalendarCheck, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Bell,
  Home,
  ArrowLeft
} from 'lucide-react';

const MainLayout = ({ children, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Définition du menu
  const menuItems = [
    { path: '/admin/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    
    // Projet 1 : Scolarité
    { section: 'Scolarité' },
    { path: '/admin/dashboard/inscriptions', label: 'Inscriptions', icon: FileText },
    { path: '/admin/dashboard/eleves', label: 'Élèves', icon: Users },
    { path: '/admin/dashboard/classes', label: 'Classes', icon: School },

    // Projet 2 : Finance
    { section: 'Gestion' },
    { path: '/admin/dashboard/finance', label: 'Finance & Compta.', icon: DollarSign },

    // Projet 3 : Pédagogie
    { section: 'Pédagogie' },
    { path: '/admin/dashboard/notes', label: 'Notes & Bulletins', icon: GraduationCap },

    // Projet 4 : Vie Scolaire
    { section: 'Vie Scolaire' },
    { path: '/admin/dashboard/vie-scolaire', label: 'Présence & Perm.', icon: CalendarCheck },

    // Système
    { section: 'Système' },
    { path: '/admin/dashboard/parametres', label: 'Paramètres', icon: Settings },
  ];

  // COULEURS DE LA MARQUE
  const brandDark = "bg-[#1a2035]"; // Bleu Nuit
  const brandGold = "bg-[#eb8e3a]"; // Doré SchoolHub
  const textGold = "text-[#eb8e3a]";

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans">
      
      {/* --- SIDEBAR --- */}
      <aside className={`fixed inset-y-0 left-0 z-50 ${brandDark} text-white transition-all duration-300 ease-in-out flex flex-col ${isSidebarOpen ? 'w-64' : 'w-20'} ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-white/10">
          <div className="font-bold text-xl tracking-tight flex items-center gap-2">
            <div className={`w-8 h-8 ${brandGold} rounded-lg flex items-center justify-center text-[#1a2035]`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c3 3 9 3 12 0v-5" />
                </svg>
            </div>
            {isSidebarOpen && <span>School<span className={textGold}>Hub</span></span>}
          </div>
        </div>

        {/* Boutons de navigation rapide */}
        {isSidebarOpen && (
          <div className="px-3 py-3 border-b border-white/10 space-y-2">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
              title="Retour aux portails"
            >
              <Home size={18} />
              <span className="text-sm font-medium">Tous les portails</span>
            </button>
            
            <button
              onClick={() => navigate('/admin')}
              className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
              title="Accueil du module"
            >
              <ArrowLeft size={18} />
              <span className="text-sm font-medium">Accueil module</span>
            </button>
          </div>
        )}
        
        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {menuItems.map((item, index) => {
            if (item.section) {
              return isSidebarOpen ? (
                <div key={index} className="px-3 mt-6 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {item.section}
                </div>
              ) : <div key={index} className="h-4"></div>;
            }

            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${
                  isActive 
                    ? `${brandGold} text-[#1a2035] font-bold shadow-md` // Actif : Fond Doré, Texte Bleu
                    : 'text-slate-400 hover:bg-white/5 hover:text-white' // Inactif
                }`}
                title={!isSidebarOpen ? item.label : ''}
              >
                <Icon size={20} className={isActive ? 'text-[#1a2035]' : 'text-slate-400 group-hover:text-white'} />
                {isSidebarOpen && <span className="font-medium text-sm">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer Sidebar */}
        <div className="p-4 border-t border-white/10">
          <button 
            onClick={onLogout}
            className="flex items-center gap-3 w-full px-3 py-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            {isSidebarOpen && <span className="text-sm font-medium">Déconnexion</span>}
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
        
        {/* Header Global */}
        <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-40 flex items-center justify-between px-4 sm:px-6 shadow-sm">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
              <Menu size={20} />
            </button>
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="hidden md:block p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
              <Menu size={20} />
            </button>
            
            {/* Fil d'ariane simplifié */}
            <div className="hidden sm:flex items-center text-sm text-slate-400">
               <span className="font-medium text-slate-800 capitalize">
                 {menuItems.find(i => i.path === location.pathname)?.label || 'Administration'}
               </span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Cloche de Notification (Cliquable) */}
            <button 
                onClick={() => navigate('/admin/dashboard/notifications')}
                className={`p-2 rounded-full relative transition-all ${
                    location.pathname === '/admin/dashboard/notifications'
                    ? 'bg-orange-50 text-[#eb8e3a] ring-2 ring-orange-100'
                    : 'text-slate-500 hover:bg-slate-100'
                }`}
            >
              <Bell size={20} fill={location.pathname === '/admin/dashboard/notifications' ? "currentColor" : "none"} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-bold text-slate-800">Admin Principal</div>
                <div className="text-xs text-slate-500">Direction</div>
              </div>
              <div className={`w-10 h-10 rounded-full ${brandGold} text-[#1a2035] flex items-center justify-center font-bold text-sm shadow-md shadow-orange-500/20`}>
                AD
              </div>
            </div>
          </div>
        </header>

        {/* Zone de contenu dynamique */}
        <main className="flex-1 p-6 overflow-x-hidden">
          {children}
        </main>

      </div>

      {/* Overlay Mobile */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}
    </div>
  );
};

export default MainLayout;