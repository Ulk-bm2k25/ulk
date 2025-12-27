import React, { useState } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import {
  BookOpen, Calculator, FileText, CheckCircle2,
  BarChart3, Settings, Menu, X
} from 'lucide-react';
import MatieresManager from './pages/MatieresManager';
import SemestresManager from './pages/SemestresManager';
import NotesEntry from './pages/NotesEntry';
import NotesValidation from './pages/NotesValidation';
import Deliberation from './pages/Deliberation';
import Bulletins from './pages/Bulletins';
import NotesStats from './pages/NotesStats';

const NotesManager = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { path: '/admin/notes', label: 'Tableau de bord', icon: BarChart3 },
    { path: '/admin/notes/matieres', label: 'Matières & Coefficients', icon: BookOpen },
    { path: '/admin/notes/semestres', label: 'Semestres/Trimestres', icon: Settings },
    { path: '/admin/notes/saisie', label: 'Saisie des Notes', icon: Calculator },
    { path: '/admin/notes/validation', label: 'Validation', icon: CheckCircle2 },
    { path: '/admin/notes/deliberation', label: 'Délibération', icon: FileText },
    { path: '/admin/notes/bulletins', label: 'Bulletins', icon: FileText },
    { path: '/admin/notes/statistiques', label: 'Statistiques', icon: BarChart3 },
  ];

  const isActive = (path) => {
    if (path === '/admin/notes') {
      return location.pathname === '/admin/notes';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-0'} bg-white border-r border-slate-200 transition-all duration-300 overflow-hidden`}>
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <BookOpen className="text-orange-600" size={24} />
            <span className={sidebarOpen ? 'block' : 'hidden'}>Gestion Notes</span>
          </h2>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 hover:bg-slate-100 rounded"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="p-2 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-orange-50 text-orange-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon size={20} />
                <span className={sidebarOpen ? 'block' : 'hidden'}>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Routes>
          <Route index element={<Navigate to="/admin/notes/saisie" replace />} />
          <Route path="matieres" element={<MatieresManager />} />
          <Route path="semestres" element={<SemestresManager />} />
          <Route path="saisie" element={<NotesEntry />} />
          <Route path="validation" element={<NotesValidation />} />
          <Route path="deliberation" element={<Deliberation />} />
          <Route path="bulletins" element={<Bulletins />} />
          <Route path="statistiques" element={<NotesStats />} />
        </Routes>
      </main>
    </div>
  );
};

export default NotesManager;

