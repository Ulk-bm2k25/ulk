import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, Eye, MoreHorizontal, Download, 
  CheckCircle, XCircle, Clock, Calendar, FileText, 
  Trash2, Mail, Loader2
} from 'lucide-react';

const InscriptionsList = ({ onViewDetails }) => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [openMenuId, setOpenMenuId] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // 1. État de chargement

  // Simulation chargement API
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Données simulées (MAPPED avec tes migrations Laravel)
  // Backend Mapping futur :
  // id -> inscriptions.id (formaté)
  // firstName -> users.prenom (via relation eleve)
  // lastName -> users.nom
  // class -> classes.nom (via relation demandée)
  // date -> inscriptions.date_inscription
  // status -> inscriptions.statut
  const mockInscriptions = [
    { 
      id: 'INS-2025-042', 
      firstName: 'Jean', 
      lastName: 'Dupont', 
      class: 'Seconde C', 
      date: '19 Déc 2025', 
      status: 'pending', 
      payment: 'partial',
      docs: 'complete',
      email: 'p.dupont@email.com'
    },
    { 
      id: 'INS-2025-041', 
      firstName: 'Amina', 
      lastName: 'Kone', 
      class: 'Terminale D', 
      date: '18 Déc 2025', 
      status: 'validated', 
      payment: 'paid', 
      docs: 'complete',
      email: 'kone.famille@email.com'
    },
    { 
      id: 'INS-2025-039', 
      firstName: 'Lucas', 
      lastName: 'Martin', 
      class: '1ère A', 
      date: '15 Déc 2025', 
      status: 'rejected', 
      payment: 'unpaid', 
      docs: 'missing',
      email: 'lucas.m@email.com'
    },
    { 
      id: 'INS-2025-038', 
      firstName: 'Sarah', 
      lastName: 'Bensoussan', 
      class: '6ème', 
      date: '14 Déc 2025', 
      status: 'pending', 
      payment: 'paid', 
      docs: 'missing',
      email: 's.bensoussan@email.com'
    },
    { 
      id: 'INS-2025-035', 
      firstName: 'Marc', 
      lastName: 'Evan', 
      class: '3ème', 
      date: '10 Déc 2025', 
      status: 'validated', 
      payment: 'paid', 
      docs: 'complete',
      email: 'marc.e@email.com'
    },
  ];

  // Filtrage
  const filteredData = mockInscriptions.filter(item => {
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    const matchesSearch = 
      item.lastName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const toggleMenu = (id, e) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const StatusBadge = ({ status }) => {
    const styles = {
      pending: { bg: 'bg-orange-100', text: 'text-orange-700', icon: Clock, label: 'En attente' },
      validated: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle, label: 'Validée' },
      rejected: { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle, label: 'Rejetée' },
    };
    const config = styles[status] || styles.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
        <Icon size={12} />
        {config.label}
      </span>
    );
  };

  // 2. Affichage Loader si chargement
  if (isLoading) {
    return (
      <div className="h-[calc(100vh-150px)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <Loader2 size={40} className="animate-spin text-brand-primary" />
          <p className="text-sm font-medium">Chargement des inscriptions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Gestion des Inscriptions</h1>
          <p className="text-slate-500 text-sm mt-1">
            Visualisez et traitez les demandes d'inscription entrantes.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
            <Download size={16} />
            <span className="hidden sm:inline">Exporter CSV</span>
          </button>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex bg-slate-100 p-1 rounded-lg w-full md:w-auto">
          {['all', 'pending', 'validated', 'rejected'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterStatus(tab)}
              className={`flex-1 md:flex-none px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                filterStatus === tab 
                  ? 'bg-white text-slate-800 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab === 'all' && 'Tout voir'}
              {tab === 'pending' && 'En attente'}
              {tab === 'validated' && 'Validées'}
              {tab === 'rejected' && 'Rejetées'}
            </button>
          ))}
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Rechercher nom, matricule..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
            />
          </div>
          <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Tableau */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden relative">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold tracking-wider">
                <th className="px-6 py-4 w-12">
                   <input type="checkbox" className="rounded border-slate-300 text-brand-primary focus:ring-brand-primary" />
                </th>
                <th className="px-6 py-4">Élève / Demandeur</th>
                <th className="px-6 py-4">Classe demandée</th>
                <th className="px-6 py-4">Date dépôt</th>
                <th className="px-6 py-4">État Dossier</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <input type="checkbox" className="rounded border-slate-300 text-brand-primary focus:ring-brand-primary" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs border border-slate-200">
                          {item.firstName[0]}{item.lastName[0]}
                        </div>
                        <div>
                          <div className="font-medium text-slate-900">{item.lastName} {item.firstName}</div>
                          <div className="text-xs text-slate-500">{item.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-1 rounded bg-slate-100 text-slate-600 text-xs font-medium">
                        {item.class}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Calendar size={14} className="text-slate-400"/>
                        {item.date}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-xs">
                          <span className={`w-1.5 h-1.5 rounded-full ${item.docs === 'complete' ? 'bg-green-500' : 'bg-orange-500'}`}></span>
                          <span className={item.docs === 'complete' ? 'text-slate-600' : 'text-orange-600 font-medium'}>
                            {item.docs === 'complete' ? 'Docs complets' : 'Docs manquants'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs">
                          <span className={`w-1.5 h-1.5 rounded-full ${item.payment === 'paid' ? 'bg-green-500' : (item.payment === 'partial' ? 'bg-blue-500' : 'bg-red-500')}`}></span>
                          <span className="text-slate-500">
                            {item.payment === 'paid' ? 'Payé' : (item.payment === 'partial' ? 'Avance versée' : 'Non payé')}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="px-6 py-4 text-right relative">
                      <div className="flex items-center justify-end gap-2">
                        
                        <button 
                          onClick={() => onViewDetails(item)}
                          className="p-1.5 text-slate-400 hover:text-brand-primary hover:bg-orange-50 rounded transition-colors" 
                          title="Voir détails"
                        >
                          <Eye size={18} />
                        </button>

                        <div className="relative">
                          <button 
                            onClick={(e) => toggleMenu(item.id, e)}
                            className={`p-1.5 rounded transition-colors ${
                              openMenuId === item.id 
                                ? 'bg-brand-primary text-white' 
                                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <MoreHorizontal size={18} />
                          </button>

                          {openMenuId === item.id && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-slate-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                              <div className="py-1">
                                <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                                  <CheckCircle size={16} className="text-green-600"/>
                                  Valider rapidement
                                </button>
                                <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                                  <Mail size={16} className="text-blue-600"/>
                                  Relancer parent
                                </button>
                                <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                                  <Download size={16} className="text-slate-500"/>
                                  Télécharger PDF
                                </button>
                              </div>
                              <div className="border-t border-slate-100 py-1">
                                <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                                  <Trash2 size={16} />
                                  Supprimer
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                        <Search size={24} className="text-slate-400" />
                      </div>
                      <p className="font-medium">Aucune inscription trouvée</p>
                      <p className="text-sm mt-1">Essayez de modifier vos filtres de recherche.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Affichage de <span className="font-medium text-slate-900">{filteredData.length}</span> sur <span className="font-medium text-slate-900">{mockInscriptions.length}</span> résultats
          </p>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-slate-300 bg-white rounded text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50" disabled>Précédent</button>
            <button className="px-3 py-1 border border-slate-300 bg-white rounded text-sm text-slate-600 hover:bg-slate-50">Suivant</button>
          </div>
        </div>
      </div>
      
      {/* 3. Overlay déplacé ICI pour couvrir tout l'écran correctement */}
      {openMenuId && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setOpenMenuId(null)}
        ></div>
      )}

    </div>
  );
};

export default InscriptionsList;