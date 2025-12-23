import React, { useState } from 'react';
import { 
  Search, Filter, Eye, MoreHorizontal, Download, UserPlus, 
  Users, School, IdCard, FileText, ChevronDown, CheckSquare, X
} from 'lucide-react';

const StudentsList = ({ onViewProfile }) => { // Prop pour aller vers le profil (à venir)
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('active'); // active, excluded, left
  
  // Gestion de la sélection multiple (Cocher des cases)
  const [selectedIds, setSelectedIds] = useState([]);

  // Données simulées (Mock Data)
  const mockStudents = [
    { id: 'MAT-25-001', firstName: 'Jean', lastName: 'Dupont', class: '2nde C', gender: 'M', parent: 'Paul Dupont', phone: '97001122', status: 'active' },
    { id: 'MAT-25-002', firstName: 'Amina', lastName: 'Kone', class: 'Tle D', gender: 'F', parent: 'Mme Kone', phone: '96554433', status: 'active' },
    { id: 'MAT-25-003', firstName: 'Lucas', lastName: 'Martin', class: '1ère A', gender: 'M', parent: 'Jean Martin', phone: '66889900', status: 'excluded' },
    { id: 'MAT-25-004', firstName: 'Sarah', lastName: 'Bensoussan', class: '6ème', gender: 'F', parent: 'Eric Ben', phone: '95123456', status: 'active' },
    { id: 'MAT-25-005', firstName: 'Marc', lastName: 'Evan', class: '3ème', gender: 'M', parent: 'Luc Evan', phone: '94778899', status: 'active' },
    { id: 'MAT-25-006', firstName: 'Chloe', lastName: 'Dubois', class: '2nde C', gender: 'F', parent: 'Marie Dubois', phone: '97887766', status: 'active' },
  ];

  // Logique de filtrage
  const filteredStudents = mockStudents.filter(student => {
    const matchSearch = 
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchClass = selectedClass === 'all' || student.class === selectedClass;
    const matchStatus = selectedStatus === 'all' || student.status === selectedStatus;

    return matchSearch && matchClass && matchStatus;
  });

  // Gestion des cases à cocher
  const toggleSelectAll = () => {
    if (selectedIds.length === filteredStudents.length) {
      setSelectedIds([]); // Tout décocher
    } else {
      setSelectedIds(filteredStudents.map(s => s.id)); // Tout cocher
    }
  };

  const toggleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(itemId => itemId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Liste unique des classes pour le filtre
  const classesList = [...new Set(mockStudents.map(s => s.class))].sort();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* 1. Header & Actions Principales */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Users className="text-brand-primary" size={28} />
            Annuaire des Élèves
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Gérez les {mockStudents.length} élèves inscrits pour l'année scolaire en cours.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 text-sm font-medium hover:bg-slate-50 shadow-sm">
            <Download size={16} />
            Exporter Liste
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-brand-dark text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10">
            <UserPlus size={16} />
            Nouvel Élève
          </button>
        </div>
      </div>

      {/* 2. Barre d'outils de Filtrage */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-4">
        
        {/* Recherche (5 cols) */}
        <div className="md:col-span-5 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher par nom, matricule..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
          />
        </div>

        {/* Filtre Classe (3 cols) */}
        <div className="md:col-span-3 relative">
            <School className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <select 
                className="w-full pl-10 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary cursor-pointer"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
            >
                <option value="all">Toutes les classes</option>
                {classesList.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
        </div>

        {/* Filtre Statut (2 cols) */}
        <div className="md:col-span-2 relative">
            <select 
                className="w-full pl-3 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary cursor-pointer"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
            >
                <option value="all">Tous status</option>
                <option value="active">Actifs</option>
                <option value="excluded">Exclus/Partis</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
        </div>
        
        {/* Bouton Reset (2 cols) */}
        <div className="md:col-span-2">
            <button 
                onClick={() => {setSearchTerm(''); setSelectedClass('all'); setSelectedStatus('all');}}
                className="w-full h-full flex items-center justify-center gap-2 px-3 py-2.5 border border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-lg text-sm font-medium transition-colors"
            >
                <X size={16} />
                Effacer
            </button>
        </div>
      </div>

      {/* 3. Barre d'actions groupées (Visible seulement si sélection) */}
      {selectedIds.length > 0 && (
        <div className="bg-brand-dark text-white p-3 rounded-xl flex items-center justify-between animate-in slide-in-from-top-2 shadow-lg">
            <div className="flex items-center gap-3 px-2">
                <span className="bg-white/20 px-2 py-0.5 rounded text-sm font-bold">{selectedIds.length}</span>
                <span className="text-sm font-medium">élèves sélectionnés</span>
            </div>
            <div className="flex gap-2">
                <button className="flex items-center gap-2 px-3 py-1.5 bg-white text-brand-dark rounded-lg text-xs font-bold hover:bg-brand-primary hover:text-white transition-colors">
                    <IdCard size={14} />
                    Générer Cartes
                </button>
                <button className="flex items-center gap-2 px-3 py-1.5 bg-white/10 text-white rounded-lg text-xs font-medium hover:bg-white/20 transition-colors">
                    <FileText size={14} />
                    Certificats
                </button>
            </div>
        </div>
      )}

      {/* 4. Tableau des Élèves */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold tracking-wider">
                <th className="px-6 py-4 w-12">
                   <input 
                    type="checkbox" 
                    className="rounded border-slate-300 text-brand-primary focus:ring-brand-primary cursor-pointer w-4 h-4"
                    checked={selectedIds.length === filteredStudents.length && filteredStudents.length > 0}
                    onChange={toggleSelectAll}
                   />
                </th>
                <th className="px-6 py-4">Élève (Matricule)</th>
                <th className="px-6 py-4">Classe</th>
                <th className="px-6 py-4">Sexe</th>
                <th className="px-6 py-4">Parent / Contact</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student.id} className={`hover:bg-slate-50 transition-colors group ${selectedIds.includes(student.id) ? 'bg-orange-50/30' : ''}`}>
                    <td className="px-6 py-4">
                      <input 
                        type="checkbox" 
                        className="rounded border-slate-300 text-brand-primary focus:ring-brand-primary cursor-pointer w-4 h-4"
                        checked={selectedIds.includes(student.id)}
                        onChange={() => toggleSelectOne(student.id)}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold border border-slate-200 text-sm">
                          {student.firstName[0]}{student.lastName[0]}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{student.lastName} {student.firstName}</div>
                          <div className="text-xs font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded inline-block mt-1">
                            {student.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-slate-700 bg-slate-100 px-2 py-1 rounded text-sm">
                        {student.class}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${student.gender === 'M' ? 'bg-blue-50 text-blue-600' : 'bg-pink-50 text-pink-600'}`}>
                            {student.gender}
                        </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="text-slate-900 font-medium">{student.parent}</div>
                        <div className="text-slate-500 text-xs">{student.phone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                        {student.status === 'active' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span> Actif
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span> Exclu
                            </span>
                        )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                         <button 
                            onClick={() => onViewProfile && onViewProfile(student)}
                            className="p-2 text-slate-400 hover:text-brand-primary hover:bg-orange-50 rounded-lg transition-colors group relative" 
                            title="Voir Dossier"
                         >
                            <Eye size={18} />
                         </button>
                         <button className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                            <MoreHorizontal size={18} />
                         </button>
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
                      <p className="font-medium">Aucun élève trouvé</p>
                      <p className="text-sm mt-1">Modifiez vos critères de recherche.</p>
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
            Total : <span className="font-medium text-slate-900">{filteredStudents.length}</span> élèves
          </p>
          <div className="flex gap-2">
             {/* Pagination simplifiée */}
            <button className="px-3 py-1 border border-slate-300 bg-white rounded text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50" disabled>Précédent</button>
            <button className="px-3 py-1 border border-slate-300 bg-white rounded text-sm text-slate-600 hover:bg-slate-50">Suivant</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentsList;