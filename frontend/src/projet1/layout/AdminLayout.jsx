import React, { useState } from 'react';
import { Home, FileText, Users, School, FileCheck, Bell, Settings, LogOut, Menu, X } from 'lucide-react';

const AdminLayout = ({ children, currentPage, onNavigate, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, available: true },
    { id: 'inscriptions', label: 'Inscriptions', icon: FileText, available: true },
    { id: 'eleves', label: 'Élèves', icon: Users, available: true },
    { id: 'classes', label: 'Classes', icon: School, available: false },
    { id: 'documents', label: 'Documents', icon: FileCheck, available: false },
    { id: 'notifications', label: 'Notifications', icon: Bell, available: false },
    { id: 'parametres', label: 'Paramètres', icon: Settings, available: false }
  ];

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#f5f5f5' }}>
      {/* Sidebar Desktop */}
      <aside
        className={`hidden md:block transition-all duration-300 ${
          isSidebarOpen ? 'w-64' : 'w-20'
        }`}
        style={{ backgroundColor: '#3d4365' }}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-6 flex items-center justify-between">
            {isSidebarOpen && (
              <h1 className="text-2xl font-bold text-white">École+</h1>
            )}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
            >
              <Menu size={20} />
            </button>
          </div>

          {/* Menu */}
          <nav className="flex-1 px-4 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => item.available && onNavigate(item.id)}
                disabled={!item.available}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  currentPage === item.id
                    ? 'text-white'
                    : item.available
                    ? 'text-gray-300 hover:bg-white/10'
                    : 'text-gray-500 cursor-not-allowed'
                }`}
                style={
                  currentPage === item.id
                    ? { backgroundColor: '#f59e42' }
                    : {}
                }
              >
                <item.icon size={20} />
                {isSidebarOpen && (
                  <span className="font-medium">{item.label}</span>
                )}
              </button>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-4">
            <button
              onClick={onLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-red-500/20 transition-colors"
            >
              <LogOut size={20} />
              {isSidebarOpen && <span className="font-medium">Déconnexion</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Sidebar Mobile */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          <aside
            className="absolute left-0 top-0 bottom-0 w-64"
            style={{ backgroundColor: '#3d4365' }}
          >
            <div className="h-full flex flex-col">
              <div className="p-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white">École+</h1>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-white hover:bg-white/10 p-2 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>

              <nav className="flex-1 px-4 space-y-2">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.available) {
                        onNavigate(item.id);
                        setIsMobileMenuOpen(false);
                      }
                    }}
                    disabled={!item.available}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      currentPage === item.id
                        ? 'text-white'
                        : item.available
                        ? 'text-gray-300 hover:bg-white/10'
                        : 'text-gray-500 cursor-not-allowed'
                    }`}
                    style={
                      currentPage === item.id
                        ? { backgroundColor: '#f59e42' }
                        : {}
                    }
                  >
                    <item.icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
              </nav>

              <div className="p-4">
                <button
                  onClick={onLogout}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-red-500/20 transition-colors"
                >
                  <LogOut size={20} />
                  <span className="font-medium">Déconnexion</span>
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="px-6 py-4 flex items-center justify-between">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu size={24} style={{ color: '#3d4365' }} />
            </button>

            <div className="flex-1"></div>

            <div className="flex items-center space-x-4">
              <button className="relative p-2 rounded-lg hover:bg-gray-100">
                <Bell size={20} style={{ color: '#3d4365' }} />
                <span
                  className="absolute top-1 right-1 w-2 h-2 rounded-full"
                  style={{ backgroundColor: '#f59e42' }}
                ></span>
              </button>

              <div className="flex items-center space-x-3 pl-4 border-l">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium"
                  style={{ backgroundColor: '#f59e42' }}
                >
                  AD
                </div>
                <div className="hidden sm:block">
                  <p className="font-medium" style={{ color: '#3d4365' }}>
                    Admin Principal
                  </p>
                  <p className="text-sm text-gray-600">admin@ecole.com</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;