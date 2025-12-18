import React from 'react';
import { FileText, Users, FileCheck, Bell } from 'lucide-react';

const DashboardPage = () => {
  const stats = [
    { label: 'Total Élèves', value: '1,248', icon: Users, trend: '+12% vs N-1', trendColor: 'text-green-500' },
    { label: 'Inscriptions en attente', value: '42', icon: FileCheck, trend: 'Action requise', trendColor: 'text-orange-500' },
    { label: 'Taux de présence', value: '94%', icon: FileText, trend: 'Moyenne globale', trendColor: 'text-slate-400' },
    { label: 'Alertes Classes Pleines', value: '5', icon: Bell, trend: 'Critique', trendColor: 'text-red-500' },
  ];

  const recentActivities = [
    { action: 'Nouvelle inscription', student: 'Jean Dupont', class: 'Terminale C', time: 'Il y a 2h' },
    { action: 'Inscription validée', student: 'Marie Claire', class: '1ère D', time: 'Il y a 3h' },
    { action: 'Nouvelle inscription', student: 'Paul Martin', class: 'Seconde A', time: 'Il y a 5h' },
    { action: 'Document ajouté', student: 'Sophie Laurent', class: 'Terminale C', time: 'Il y a 6h' },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Vue d'ensemble</h1>
        <p className="text-slate-500 mt-1">Gérez les inscriptions, les classes et les alertes.</p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-card-dark rounded-xl shadow-sm border-l-4 border-primary p-5 flex flex-col justify-between h-32 transition-transform hover:-translate-y-1"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-3xl font-bold text-slate-800 dark:text-white">{stat.value}</h3>
                <p className="text-xs uppercase tracking-wider text-slate-500 mt-1 font-semibold">
                  {stat.label}
                </p>
              </div>
              <stat.icon className="text-primary" size={22} />
            </div>
            <div className={`text-sm font-medium ${stat.trendColor}`}>{stat.trend}</div>
          </div>
        ))}
      </div>

      {/* Activités récentes */}
      <div className="bg-white dark:bg-card-dark rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
        <div className="p-5 border-b border-slate-100 dark:border-slate-700">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">Activités récentes</h2>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          {recentActivities.map((activity, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <span className="h-2 w-2 rounded-full bg-primary"></span>
                <div>
                  <p className="font-semibold text-slate-800 dark:text-white">{activity.action}</p>
                  <p className="text-sm text-slate-500">
                    {activity.student} – {activity.class}
                  </p>
                </div>
              </div>
              <span className="text-xs text-slate-400">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
