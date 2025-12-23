import React from 'react';
import { Users, AlertCircle, TrendingUp, Bell, Download, ChevronRight, CheckCircle, Clock, FileText, Plus, Send } from 'lucide-react';

const DashboardPage = () => {
  // Données simulées
  const stats = [
    { label: 'Total Élèves', value: '1,248', sub: '+12% vs N-1', color: 'text-green-600', icon: Users },
    { label: 'Inscriptions en attente', value: '42', sub: 'Action requise', color: 'text-brand-primary', icon: Clock },
    { label: 'Taux de présence', value: '94%', sub: 'Moyenne globale', color: 'text-slate-500', icon: TrendingUp },
    { label: 'Alertes Classes Pleines', value: '5', sub: 'Critique', color: 'text-red-500', icon: AlertCircle },
  ];

  const inscriptions = [
    { id: 'INS-2025-001', name: 'Martin Dubois', class: 'Terminale C', status: 'Validé', complete: true, paid: true },
    { id: 'INS-2025-002', name: 'Sophie Moreau', class: '1ère D', status: 'Validé', complete: true, paid: true },
    { id: 'INS-2025-003', name: 'Lucas Bernard', class: 'Seconde A', status: 'En attente', complete: false, paid: false, note: 'Manque certificat' },
  ];

  return (
    <div className="space-y-6">
      {/* En-tête de page */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Vue d'ensemble</h1>
          <p className="text-slate-500 text-sm mt-1">Gérez les inscriptions, les classes et les alertes.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
          <Download size={16} />
          Exporter
        </button>
      </div>

      {/* 1. Cartes Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <div className="text-3xl font-bold text-slate-800">{stat.value}</div>
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">{stat.label}</div>
                </div>
                <div className={`p-2 rounded-lg bg-slate-50 ${stat.color}`}>
                    <stat.icon size={20} />
                </div>
            </div>
            <div className={`text-sm font-medium ${stat.color} flex items-center gap-1`}>
                {stat.sub}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 2. Alertes Importantes (2/3 largeur) */}
        <div className="lg:col-span-2 space-y-4">
             <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-800">Alertes Importantes</h2>
                <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-bold rounded-full">3 Urgent</span>
             </div>

             <div className="bg-white rounded-xl border border-slate-100 shadow-sm divide-y divide-slate-100">
                
                {/* Alerte 1 */}
                <div className="p-5 flex items-center gap-4 hover:bg-slate-50 transition-colors cursor-pointer group">
                    <div className="p-3 bg-orange-100 text-orange-600 rounded-lg">
                        <Users size={20} />
                    </div>
                    <div className="flex-1">
                        <div className="font-semibold text-slate-800">Nouvelles inscriptions en attente</div>
                        <div className="text-sm text-slate-500">15 dossiers complets prêts à être validés.</div>
                    </div>
                    <button className="text-sm font-medium text-brand-primary group-hover:underline">Voir</button>
                </div>

                {/* Alerte 2 */}
                <div className="p-5 flex items-center gap-4 hover:bg-slate-50 transition-colors cursor-pointer group">
                    <div className="p-3 bg-red-100 text-red-600 rounded-lg">
                        <Users size={20} />
                    </div>
                    <div className="flex-1">
                        <div className="font-semibold text-slate-800">Capacité dépassée - Terminale C</div>
                        <div className="text-sm text-slate-500">32/30 élèves inscrits. Action requise.</div>
                    </div>
                    <button className="text-sm font-medium text-brand-primary group-hover:underline">Gérer</button>
                </div>

                {/* Alerte 3 */}
                <div className="p-5 flex items-center gap-4 hover:bg-slate-50 transition-colors cursor-pointer group">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                        <Bell size={20} />
                    </div>
                    <div className="flex-1">
                        <div className="font-semibold text-slate-800">Notifications non envoyées</div>
                        <div className="text-sm text-slate-500">5 notifications d'absence n'ont pas abouti.</div>
                    </div>
                    <button className="text-sm font-medium text-brand-primary group-hover:underline">Réessayer</button>
                </div>

             </div>
        </div>

        {/* 3. Actions Rapides (1/3 largeur) */}
        <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-800">Actions Rapides</h2>
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm space-y-2">
                
                <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100 text-orange-600 rounded-md"><CheckCircle size={18}/></div>
                        <span className="font-medium text-slate-700">Valider inscriptions</span>
                    </div>
                    <ChevronRight size={16} className="text-slate-400 group-hover:text-brand-primary"/>
                </button>

                <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100 text-orange-600 rounded-md"><Plus size={18}/></div>
                        <span className="font-medium text-slate-700">Créer une classe</span>
                    </div>
                    <ChevronRight size={16} className="text-slate-400 group-hover:text-brand-primary"/>
                </button>

                <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100 text-orange-600 rounded-md"><Send size={18}/></div>
                        <span className="font-medium text-slate-700">Envoi rapide</span>
                    </div>
                    <ChevronRight size={16} className="text-slate-400 group-hover:text-brand-primary"/>
                </button>
                
                <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100 text-orange-600 rounded-md"><FileText size={18}/></div>
                        <span className="font-medium text-slate-700">Historique docs</span>
                    </div>
                    <ChevronRight size={16} className="text-slate-400 group-hover:text-brand-primary"/>
                </button>

            </div>
        </div>
      </div>

      {/* 4. Table Inscriptions Récentes */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-brand-dark text-white">
            <h2 className="font-semibold">Liste d'inscriptions récentes</h2>
            <span className="text-xs bg-white/20 px-2 py-1 rounded text-white">Terminale C</span>
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
                        <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4">
                                <div className="font-medium text-slate-900">{row.name}</div>
                                <div className="text-xs text-slate-400">{row.id}</div>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                    row.status === 'Validé' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
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

export default DashboardPage;