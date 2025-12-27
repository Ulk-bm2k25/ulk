import React, { useState, useEffect } from 'react';
import { Users, AlertCircle, TrendingUp, Bell, Download, ChevronRight, CheckCircle, Clock, FileText, Plus, Send, Loader2, IdCard } from 'lucide-react';

const DashboardPage = ({ onNavigate }) => {
  const [isLoading, setIsLoading] = useState(true);

  // Données initiales (Vides pour l'intégration Backend)
  const [inscriptions] = useState([]);

  const [kpis] = useState({
    totalEleves: 0,
    inscriptionsAttente: 0,
    tauxPresence: 0,
    classesSaturees: 0
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const generateAlerts = () => {
    const activeAlerts = [];

    if (kpis.inscriptionsAttente > 0) {
      activeAlerts.push({
        id: 'alert-insc',
        type: 'warning',
        icon: Users,
        title: 'Nouvelles inscriptions en attente',
        message: `${kpis.inscriptionsAttente} dossiers complets prêts à être validés.`,
        actionLabel: 'Voir',
        targetPage: 'inscriptions'
      });
    }

    if (kpis.classesSaturees > 0) {
      activeAlerts.push({
        id: 'alert-class',
        type: 'critical',
        icon: Users,
        title: `Capacité dépassée - ${kpis.classesSaturees} Classe(s)`,
        message: 'Le seuil maximum d\'élèves est atteint.',
        actionLabel: 'Gérer',
        targetPage: 'classes'
      });
    }

    const notifsFailed = 0;
    if (notifsFailed > 0) {
      activeAlerts.push({
        id: 'alert-notif',
        type: 'info',
        icon: Bell,
        title: 'Notifications non envoyées',
        message: `${notifsFailed} notifications d'absence n'ont pas abouti.`,
        actionLabel: 'Réessayer',
        targetPage: 'notifications'
      });
    }

    return activeAlerts;
  };

  const alerts = generateAlerts();

  const getAlertStyles = (type) => {
    switch (type) {
      case 'critical': return { bgIcon: 'bg-red-100', textIcon: 'text-red-600' };
      case 'info': return { bgIcon: 'bg-blue-100', textIcon: 'text-blue-600' };
      default: return { bgIcon: 'bg-orange-100', textIcon: 'text-orange-600' };
    }
  };

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-150px)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <Loader2 size={40} className="animate-spin text-brand-primary" />
          <p className="text-sm font-medium">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">

      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Vue d'ensemble</h1>
          <p className="text-slate-500 text-sm mt-1">Gérez les inscriptions, les classes et les alertes.</p>
        </div>
        <button
          onClick={() => alert(`Exportation du rapport global pour l'année 2024-2025...\nLe fichier PDF sera téléchargé sous peu.`)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm"
        >
          <Download size={16} />
          Exporter Rapport
        </button>
      </div>

      {/* 1. Cartes Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Élèves"
          value={kpis.totalEleves.toLocaleString()}
          sub="+12% vs N-1"
          color="text-green-600"
          icon={Users}
        />
        <StatCard
          label="Inscriptions en attente"
          value={kpis.inscriptionsAttente}
          sub="Action requise"
          color="text-brand-primary"
          icon={Clock}
        />
        <StatCard
          label="Taux de présence"
          value={`${kpis.tauxPresence}%`}
          sub="Moyenne globale"
          color="text-slate-500"
          icon={TrendingUp}
        />
        <StatCard
          label="Alertes Classes"
          value={kpis.classesSaturees}
          sub={kpis.classesSaturees > 0 ? "Critique" : "Normal"}
          color={kpis.classesSaturees > 0 ? "text-red-500" : "text-green-500"}
          icon={AlertCircle}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* 2. Alertes Importantes */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800">Alertes Importantes</h2>
            {alerts.length > 0 && (
              <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-bold rounded-full animate-pulse">
                {alerts.length} Urgent
              </span>
            )}
          </div>

          <div className="bg-white rounded-xl border border-slate-100 shadow-sm divide-y divide-slate-100">
            {alerts.length > 0 ? (
              alerts.map((alert) => {
                const style = getAlertStyles(alert.type);
                return (
                  <div key={alert.id} className="p-5 flex items-center gap-4 hover:bg-slate-50 transition-colors group">
                    <div className={`p-3 rounded-lg ${style.bgIcon} ${style.textIcon}`}>
                      <alert.icon size={20} />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-slate-800">{alert.title}</div>
                      <div className="text-sm text-slate-500">{alert.message}</div>
                    </div>
                    <button
                      onClick={() => onNavigate(alert.targetPage)}
                      className="text-sm font-medium text-brand-primary group-hover:underline"
                    >
                      {alert.actionLabel}
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-slate-500">
                <CheckCircle className="mx-auto mb-2 text-green-500" size={32} />
                <p>Aucune alerte pour le moment. Tout va bien !</p>
              </div>
            )}
          </div>
        </div>

        {/* 3. Actions Rapides */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-800">Actions Rapides</h2>
          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm space-y-2">
            <QuickAction icon={CheckCircle} label="Valider inscriptions" color="text-orange-600" bg="bg-orange-100" onClick={() => onNavigate('inscriptions')} />
            <QuickAction icon={Plus} label="Créer une classe" color="text-blue-600" bg="bg-blue-100" onClick={() => onNavigate('classes')} />
            <QuickAction icon={Send} label="Envoi rapide" color="text-green-600" bg="bg-green-100" onClick={() => onNavigate('notifications')} />
            {/* CORRECTION ICI : 'cartes' au lieu de 'qr' */}
            <QuickAction icon={IdCard} label="Cartes scolaires" color="text-red-600" bg="bg-red-100" onClick={() => onNavigate('cartes')} />
            <QuickAction icon={FileText} label="Historique docs" color="text-purple-600" bg="bg-purple-100" onClick={() => onNavigate('documents')} />
          </div>
        </div>
      </div>

      {/* 4. Table Inscriptions Récentes */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-brand-dark text-white">
          <h2 className="font-semibold">Liste d'inscriptions récentes</h2>
          <button
            onClick={() => onNavigate('inscriptions')}
            className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded text-white transition-colors flex items-center gap-1"
          >
            Tout voir <ChevronRight size={12} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-6 py-3">Élève</th>
                <th className="px-6 py-3">Statut</th>
                <th className="px-6 py-3 text-center">Dossier Complet</th>
                <th className="px-6 py-3 text-center">Frais Payés</th>
                <th className="px-6 py-3">Remarques</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {inscriptions.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => onNavigate('inscriptions')}
                  className="hover:bg-slate-50 transition-colors cursor-pointer"
                  title="Cliquez pour gérer les inscriptions"
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{row.name}</div>
                    <div className="text-xs text-slate-400">{row.id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${row.status === 'Validé' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className={`inline-flex items-center justify-center w-6 h-6 rounded ${row.complete ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-300'}`}>
                      <CheckCircle size={14} />
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className={`inline-flex items-center justify-center w-6 h-6 rounded ${row.paid ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-300'}`}>
                      <CheckCircle size={14} />
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500 italic">
                    {row.note || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

const StatCard = ({ label, value, sub, color, icon: Icon }) => (
  <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div>
        <div className="text-3xl font-bold text-slate-800">{value}</div>
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">{label}</div>
      </div>
      <div className={`p-2 rounded-lg bg-slate-50 ${color}`}>
        <Icon size={20} />
      </div>
    </div>
    <div className={`text-sm font-medium ${color} flex items-center gap-1`}>
      {sub}
    </div>
  </div>
);

const QuickAction = ({ icon: Icon, label, color, bg, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group"
  >
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-md ${bg} ${color}`}><Icon size={18} /></div>
      <span className="font-medium text-slate-700">{label}</span>
    </div>
    <ChevronRight size={16} className="text-slate-400 group-hover:text-brand-primary" />
  </button>
);

export default DashboardPage;