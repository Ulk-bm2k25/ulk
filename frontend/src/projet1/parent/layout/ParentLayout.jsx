import React from 'react';
import {
  LayoutGrid,
  Users,
  CreditCard,
  Star,
  CalendarCheck,
  Bell,
  Settings,
  LogOut,
  ChevronRight
} from 'lucide-react';
import '../styles/theme.css';

const ParentLayout = ({ children, currentPage, onNavigate, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutGrid },
    { id: 'children', label: 'Mes Enfants', icon: Users },
    { id: 'payments', label: 'Paiements & Frais', icon: CreditCard },
    { id: 'grades', label: 'Notes & Bulletins', icon: Star },
    { id: 'attendance', label: 'Présence', icon: CalendarCheck },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: 3 },
  ];

  const bottomMenuItems = [
    { id: 'settings', label: 'Paramètres', icon: Settings },
  ];

  return (
    <div className="parent-portal">
      {/* Sidebar */}
      <aside className="w-72 border-r border-white/5 p-6 flex flex-col bg-[#1a2035]">
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
                }`}
            >
              <div className="flex items-center gap-4">
                <item.icon size={22} strokeWidth={currentPage === item.id ? 2.5 : 2} />
                <span className={`text-[15px] ${currentPage === item.id ? 'font-semibold' : 'font-medium'}`}>
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
          {bottomMenuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${currentPage === item.id
                ? 'bg-[#eb8e3a] text-white'
                : 'text-white/50 hover:bg-white/5 hover:text-white'
                }`}
            >
              <item.icon size={22} />
              <span className="text-[15px] font-medium">{item.label}</span>
            </button>
          ))}

          {/* Profile Card */}
          <div className="bg-white/5 rounded-2xl p-4 flex items-center justify-between group cursor-pointer hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full ring-2 ring-[#eb8e3a] p-0.5">
                <img
                  src="https://i.pravatar.cc/150?u=marie"
                  alt="Marie Dupont"
                  className="w-full h-full rounded-full object-cover grayscale"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-[14px] font-bold text-white">Marie Dupont</span>
                <span className="text-[11px] text-white/40">Compte Parent</span>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onLogout();
              }}
              className="p-2 text-white/40 hover:text-white transition-colors"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-[#1a2035]">
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
