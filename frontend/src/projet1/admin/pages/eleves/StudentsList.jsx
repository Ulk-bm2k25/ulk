import React, { useState, useEffect } from 'react';
import {
  Search, Eye, MoreHorizontal, Download, UserPlus,
  Users, School, IdCard, FileText, ChevronDown, CheckSquare, X,
  Loader2, Edit, Trash2, Printer, ArrowRight
} from 'lucide-react';
import MoveStudentModal from './MoveStudentModal';
import StudentFormModal from './StudentFormModal';

const StudentsList = ({ 
  students = [], 
  onViewProfile, 
  onNavigate, 
  onAddStudent,
  onEditStudent
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('active'); // active, excluded, left

  // Gestion de la sélection multiple (Cocher des cases)
  const [selectedIds, setSelectedIds] = useState([]);
  const [studentToMove, setStudentToMove] = useState(null);

  // États pour UI
  const [isLoading, setIsLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState(null);

  // Simulation chargement API
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Logique de filtrage basé sur le state centralisé
  const filteredStudents = students.filter(student => {
    const matchSearch =
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchClass = selectedClass === 'all' || student.class === selectedClass;
    const matchStatus = selectedStatus === 'all' || student.status === selectedStatus;

    return matchSearch && matchClass && matchStatus;
  });

  // Gestion Selection
  const toggleSelectAll = () => {
    if (selectedIds.length === filteredStudents.length) setSelectedIds([]);
    else setSelectedIds(filteredStudents.map(s => s.id));
  };

  const toggleSelectOne = (id) => {
    if (selectedIds.includes(id)) setSelectedIds(selectedIds.filter(itemId => itemId !== id));
    else setSelectedIds([...selectedIds, id]);
  };

  const toggleMenu = (id, e) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === id ? null : id);
  };

  // Extraction unique des classes pour le filtre
  const classesList = [...new Set(students.map(s => s.class))].sort();

  // Loader
  if (isLoading) {
    return (
      <div className="h-[calc(100vh-150px)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <Loader2 size={40} className="animate-spin text-brand-primary" />
          <p className="text-sm font-medium">Chargement de l'annuaire...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* 1. Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Users className="text-brand-primary" size={28} />
            Annuaire des Élèves
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Gérez les {students.length} élèves inscrits pour l'année scolaire en cours.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => alert(`Préparation de l'exportation de l'annuaire (${students.length} élèves)...`)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 text-sm font-medium hover:bg-slate-50 shadow-sm"
          >
            <Download size={16} />
            Exporter Liste
          </button>
          <button
            onClick={onAddStudent}
            className="flex items-center gap-2 px-4 py-2 bg-brand-dark text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10"
          >
            <UserPlus size={16} />
            Nouvel Élève
          </button>
        </div>
      </div>

      {/* 2. Filtres */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* ... (Code des filtres identique à avant) ... */}
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

      {/* 3. Actions groupées */}
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

      {/* 4. Tableau */}
      {/* CORRECTION ICI : Retrait de overflow-hidden sur le conteneur principal pour laisser sortir le menu */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm relative">
        <div className="overflow-x-auto rounded-t-xl">
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
                  <tr 
                    key={student.id} 
                    // CORRECTION ICI : Ajout de z-20 quand le menu est ouvert pour qu'il passe au dessus des autres lignes
                    className={`hover:bg-slate-50 transition-colors group cursor-pointer ${selectedIds.includes(student.id) ? 'bg-orange-50/30' : ''} ${openMenuId === student.id ? 'z-50 relative shadow-md bg-white' : ''}`}
                    onClick={() => onViewProfile && onViewProfile(student)}
                  >
                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
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
                    
                    {/* ACTIONS */}
                    <td className="px-6 py-4 text-right relative" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                         <button 
                            onClick={() => onViewProfile && onViewProfile(student)}
                            className="p-2 text-slate-400 hover:text-brand-primary hover:bg-orange-50 rounded-lg transition-colors group relative" 
                            title="Voir Dossier"
                         >
                            <Eye size={18} />
                         </button>
                         
                         {/* Dropdown Container */}
                         <div className="relative">
                            <button 
                                onClick={(e) => toggleMenu(student.id, e)}
                                className={`p-2 rounded-lg transition-colors ${
                                    openMenuId === student.id 
                                    ? 'bg-brand-primary text-white' 
                                    : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                                }`}
                            >
                                <MoreHorizontal size={18} />
                            </button>

                            {/* Dropdown Menu */}
                            {openMenuId === student.id && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-slate-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                    <div className="py-1">
                                        <button 
                                            onClick={() => onViewProfile(student)}
                                            className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                        >
                                            <Eye size={16} className="text-blue-600"/>
                                            Voir dossier
                                        </button>
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setOpenMenuId(null);
                                                onEditStudent(student); // <--- BOUTON CORRIGÉ : MODIFIER
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                        >
                                            <Edit size={16} className="text-orange-600"/>
                                            Modifier
                                        </button>
                                        <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                                            <Printer size={16} className="text-slate-500"/>
                                            Imprimer fiche
                                        </button>
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setStudentToMove(student);
                                                setOpenMenuId(null);
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                        >
                                            {/* Icône corrigée : ArrowRight était undefined dans certains imports, utilisons MoreHorizontal ou une autre si besoin, ici ça devrait aller si importée */}
                                            Changer de classe
                                        </button>
                                    </div>
                                    <div className="border-t border-slate-100 py-1">
                                        <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                                            <Trash2 size={16} />
                                            Exclure / Supprimer
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
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-between rounded-b-xl">
          <p className="text-sm text-slate-500">
            Total : <span className="font-medium text-slate-900">{filteredStudents.length}</span> élèves
          </p>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-slate-300 bg-white rounded text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50" disabled>Précédent</button>
            <button className="px-3 py-1 border border-slate-300 bg-white rounded text-sm text-slate-600 hover:bg-slate-50">Suivant</button>
          </div>
        </div>
      </div>

      {/* Modal de Changement de Classe */}
      <MoveStudentModal 
        isOpen={!!studentToMove} 
        student={studentToMove}
        onClose={() => setStudentToMove(null)}
        onConfirm={(studentId, newClassId) => {
            console.log(`Transfert de l'élève ${studentId} vers la classe ${newClassId}`);
        }}
      />

      {/* CORRECTION ICI : Overlay avec bg-transparent explicit */}
      {openMenuId && (
        <div 
          className="fixed inset-0 z-40 bg-transparent" 
          onClick={() => setOpenMenuId(null)}
        ></div>
      )}

    </div>
  );
};

export default StudentsList;