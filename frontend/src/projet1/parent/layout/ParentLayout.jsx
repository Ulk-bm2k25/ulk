import React from 'react';
import {
  LayoutGrid,
  Users,
  Star,
  CalendarCheck,
  Bell,
  Settings,
  LogOut,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import '../styles/theme.css';

const ParentLayout = ({ children, currentPage, onNavigate, onLogout, user }) => {
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutGrid },
    { id: 'children', label: 'Mes Enfants', icon: Users },
    { id: 'grades', label: 'Notes & Bulletins', icon: Star },
    { id: 'attendance', label: 'Présence', icon: CalendarCheck },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];


  return (
    <div className="parent-portal bg-parent-portal">
      {/* Sidebar */}
      <aside className="w-72 border-r border-white/5 p-6 flex flex-col bg-black/20 backdrop-blur-xl">
        {/* Logo */}
        <div className="mb-10 px-2">
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#eb8e3a] flex items-center justify-center text-[#1a2035]">
              <SchoolIcon />
            </div>
            <span>School<span className="text-[#eb8e3a]">Hub</span></span>
          </h1>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all group ${currentPage === item.id
                ? 'bg-[#eb8e3a] text-white shadow-lg shadow-orange-950/20'
                : 'text-white/50 hover:bg-white/5 hover:text-white'
                } `}
            >
              <div className="flex items-center gap-4">
                <item.icon size={22} strokeWidth={currentPage === item.id ? 2.5 : 2} />
                <span className={`text-[15px] ${currentPage === item.id ? 'font-black' : 'font-bold'} `}>
                  {item.label}
                </span>
              </div>
              {item.badge && (
                <span className="bg-[#e53e3e] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] flex items-center justify-center ring-2 ring-[#1a2035]">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="mt-auto space-y-4 pt-6 border-t border-white/5">
          <div className="space-y-1">
            <button
              onClick={() => setSettingsOpen(!settingsOpen)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${currentPage === 'settings'
                ? 'bg-[#eb8e3a] text-white shadow-lg shadow-orange-950/20'
                : 'text-white/50 hover:bg-white/5 hover:text-white'
                } `}
            >
              <div className="flex items-center gap-4">
                <Settings size={22} strokeWidth={currentPage === 'settings' ? 2.5 : 2} />
                <span className="text-[15px] font-bold">Paramètres</span>
              </div>
              <ChevronDown size={16} className={`transition-transform duration-300 ${settingsOpen ? 'rotate-180' : ''} `} />
            </button>

            <div className={`overflow-hidden transition-all duration-300 ${settingsOpen ? 'max-h-32 opacity-100 mt-1' : 'max-h-0 opacity-0'} `}>
              <div className="pl-12 space-y-1">
                <button
                  onClick={() => onNavigate('settings')}
                  className="w-full text-left py-2 text-[14px] font-bold text-white/40 hover:text-white transition-colors"
                >
                  Tous les paramètres
                </button>
                <button
                  onClick={onLogout}
                  className="w-full text-left py-2 text-[14px] font-bold text-white/40 hover:text-red-400 transition-colors flex items-center gap-2"
                >
                  <LogOut size={14} />
                  Se déconnecter
                </button>
              </div>
            </div>
          </div>

          {/* User Profile Card */}
          <div className="mt-4 p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#eb8e3a]/20 flex items-center justify-center text-[#eb8e3a] font-black">
              {user ? `${user.prenom[0]}${user.nom[0]} ` : '??'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">
                {user ? `${user.prenom} ${user.nom} ` : 'Utilisateur'}
              </p>
              <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">
                Parent
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-transparent">
        <div className="p-10 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

// Simple School Icon to match the image
const SchoolIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c3 3 9 3 12 0v-5" />
  </svg>
);

export default ParentLayout;
