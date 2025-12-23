import React, { useState } from 'react';
import { Home, FileText, Users, School, FileCheck, Bell, Settings, LogOut, Menu, X, Search, ChevronRight } from 'lucide-react';

const AdminLayout = ({ children, currentPage, onNavigate, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: Home, available: true },
    { id: 'inscriptions', label: 'Inscriptions', icon: FileText, available: true },
    { id: 'eleves', label: 'Élèves', icon: Users, available: true },
    { id: 'classes', label: 'Classes', icon: School, available: true },
    { id: 'notifications', label: 'Notifications', icon: Bell, available: true },
    { id: 'parametres', label: 'Paramètres', icon: Settings, available: false }
  ];

  const SidebarContent = () => (
    <div className="h-full flex flex-col text-white">
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="font-bold text-2xl tracking-tight">SchoolHub<span className="text-brand-primary">+</span></div>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-3 space-y-1 mt-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => item.available && onNavigate(item.id)}
            disabled={!item.available}
            className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-lg transition-all duration-200 group ${currentPage === item.id
                ? 'bg-brand-primary text-white shadow-lg shadow-orange-500/20'
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
              } ${!item.available && 'opacity-50 cursor-not-allowed'}`}
          >
            <item.icon size={20} strokeWidth={currentPage === item.id ? 2.5 : 2} />
            {(isSidebarOpen || isMobileMenuOpen) && (
              <span className="font-medium text-sm">{item.label}</span>
            )}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={onLogout}
          className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <LogOut size={20} />
          {(isSidebarOpen || isMobileMenuOpen) && <span className="font-medium text-sm">Déconnexion</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-brand-bg font-sans">
      {/* Sidebar Desktop */}
      <aside
        className={`hidden md:block fixed h-full z-10 transition-all duration-300 bg-brand-dark ${isSidebarOpen ? 'w-64' : 'w-20'
          }`}
      >
        <SidebarContent />
      </aside>

      {/* Sidebar Mobile */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-brand-dark shadow-2xl">
            <div className="absolute top-4 right-4">
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-white"><X size={24} /></button>
            </div>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content Wrapper */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>

        {/* Header (Top bar) */}
        <header className="bg-white sticky top-0 z-20 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden text-slate-600">
              <Menu size={24} />
            </button>
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="hidden md:block text-slate-400 hover:text-brand-dark">
              <Menu size={24} />
            </button>

            {/* Breadcrumb (Fil d'ariane) */}
            <div className="hidden sm:flex items-center text-sm text-slate-400 gap-2">
              <Home size={14} />
              <ChevronRight size={14} />
              <span>Admin</span>
              <ChevronRight size={14} />
              <span className="font-medium text-slate-800">{currentPage}</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="text" placeholder="Rechercher..." className="pl-10 pr-4 py-2 bg-slate-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 w-64 text-slate-800" />
            </div>

            <button className="relative text-slate-500 hover:text-brand-dark">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-bold text-slate-800">Admin Principal</div>
                <div className="text-xs text-slate-500">Direction</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold shadow-md shadow-orange-500/20">
                AD
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;