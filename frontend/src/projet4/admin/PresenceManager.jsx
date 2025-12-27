import React, { useState } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import {
  CalendarCheck, Clock, FileText, AlertTriangle,
  QrCode, Menu, X, BarChart3
} from 'lucide-react';
import AttendanceRegister from './pages/AttendanceRegister';
import CoursesSchedule from './pages/CoursesSchedule';
import QRScanner from './pages/QRScanner';
import AttendanceReports from './pages/AttendanceReports';
import AbsenceAlerts from './pages/AbsenceAlerts';
import PermissionRequests from './pages/PermissionRequests';

const PresenceManager = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { path: '/admin/vie-scolaire', label: 'Tableau de bord', icon: BarChart3 },
    { path: '/admin/vie-scolaire/register', label: 'Registre de Présence', icon: CalendarCheck },
    { path: '/admin/vie-scolaire/qr-scanner', label: 'Scanner QR', icon: QrCode },
    { path: '/admin/vie-scolaire/schedule', label: 'Programme des Cours', icon: Clock },
    { path: '/admin/vie-scolaire/permissions', label: 'Demandes Permission', icon: FileText },
    { path: '/admin/vie-scolaire/alerts', label: 'Alertes Absences', icon: AlertTriangle },
    { path: '/admin/vie-scolaire/reports', label: 'Rapports PDF', icon: FileText },
  ];

  const isActive = (path) => {
    if (path === '/admin/vie-scolaire') {
      return location.pathname === '/admin/vie-scolaire';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-0'} bg-white border-r border-slate-200 transition-all duration-300 overflow-hidden`}>
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <CalendarCheck className="text-orange-600" size={24} />
            <span className={sidebarOpen ? 'block' : 'hidden'}>Vie Scolaire</span>
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
          <Route index element={<Navigate to="/admin/vie-scolaire/register" replace />} />
          <Route path="register" element={<AttendanceRegister />} />
          <Route path="qr-scanner" element={<QRScanner />} />
          <Route path="schedule" element={<CoursesSchedule />} />
          <Route path="permissions" element={<PermissionRequests />} />
          <Route path="alerts" element={<AbsenceAlerts />} />
          <Route path="reports" element={<AttendanceReports />} />
        </Routes>
      </main>
    </div>
  );
};

export default PresenceManager;

