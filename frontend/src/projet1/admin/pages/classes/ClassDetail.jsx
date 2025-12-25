import React, { useState, useEffect } from 'react';
import {
    ArrowLeft, Users, Download, Printer, Search,
    MoreHorizontal, Edit, GraduationCap, Calendar,
    Loader2, Filter, FileText, ArrowRight, AlertCircle, Eye,
    ClipboardCopy, CalendarCheck
} from 'lucide-react';
import GradeEntrySheet from './GradeEntrySheet';
import AttendanceRegister from './AttendanceRegister';

const ClassDetail = ({ classData, onBack, onEdit }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('students'); // students, teachers, planning
    const [openMenuId, setOpenMenuId] = useState(null);
    const [isGradeEntryOpen, setIsGradeEntryOpen] = useState(false);
    const [isAttendanceOpen, setIsAttendanceOpen] = useState(false);

    // Simulation chargement API
    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 600);
        return () => clearTimeout(timer);
    }, []);

    if (!classData) return null;

    // --- MAPPING BASE DE DONNÉES LARAVEL ---
    // Récupération des élèves via la table `affectations_classes`
    const mockStudents = [
        { id: 'MAT-25-101', name: 'Alain T.', gender: 'M', status: 'active', rank: 1 },
        { id: 'MAT-25-102', name: 'Bernice K.', gender: 'F', status: 'active', rank: 2 },
        { id: 'MAT-25-103', name: 'Charles D.', gender: 'M', status: 'active', rank: 3 },
        { id: 'MAT-25-104', name: 'Dorian S.', gender: 'M', status: 'excluded', rank: '-' },
        { id: 'MAT-25-105', name: 'Elodie M.', gender: 'F', status: 'active', rank: 4 },
        // ... on imagine 30 élèves ici
    ];

    // Calcul dynamique des stats (Filles/Garçons)
    const stats = {
        total: mockStudents.length,
        girls: mockStudents.filter(s => s.gender === 'F').length,
        boys: mockStudents.filter(s => s.gender === 'M').length,
        active: mockStudents.filter(s => s.status === 'active').length
    };

    const filteredStudents = mockStudents.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleMenu = (id, e) => {
        e.stopPropagation();
        setOpenMenuId(openMenuId === id ? null : id);
    };

    if (isLoading) {
        return (
            <div className="h-[calc(100vh-150px)] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3 text-slate-400">
                    <Loader2 size={40} className="animate-spin text-brand-primary" />
                    <p className="text-sm font-medium">Ouverture de la classe {classData.name}...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">

            {/* 1. En-tête & Navigation */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-slate-600"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setIsAttendanceOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-orange-50 text-brand-primary border border-orange-100 rounded-lg hover:bg-orange-100 transition-all font-bold text-xs"
                        >
                            <CalendarCheck size={16} />
                            Faire l'appel
                        </button>
                        <button
                            onClick={() => onEdit(classData)}
                            className="p-2 bg-white border border-slate-200 text-slate-400 hover:text-brand-primary rounded-lg transition-colors"
                            title="Modifier la classe"
                        >
                            <Edit size={20} />
                        </button>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                            Classe de {classData.name}
                            <span className="text-sm font-normal bg-brand-primary/10 text-brand-primary px-2 py-0.5 rounded-full border border-brand-primary/20">
                                {classData.level}
                            </span>
                        </h1>
                        <p className="text-slate-500 text-sm">Année Scolaire 2024-2025 • Série {classData.series || 'Unique'}</p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => onEdit && onEdit(classData)}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 text-sm font-medium hover:bg-slate-50 shadow-sm"
                    >
                        <Edit size={16} />
                        <span className="hidden sm:inline">Modifier</span>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-brand-dark text-white rounded-lg text-sm font-medium hover:bg-slate-800 shadow-lg shadow-slate-800/10">
                        <Printer size={16} />
                        <span className="hidden sm:inline">Imprimer Liste</span>
                    </button>
                </div>
            </div>

            {/* 2. Cartes Statistiques (KPIs) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                {/* Effectif & Parité */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                        <Users size={24} />
                    </div>
                    <div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">Effectif Total</div>
                        <div className="text-2xl font-bold text-slate-800">{stats.total} Élèves</div>
                        <div className="text-xs text-slate-500 mt-1 flex gap-2">
                            <span className="text-pink-500 font-medium">{stats.girls} Filles</span>
                            <span>•</span>
                            <span className="text-blue-500 font-medium">{stats.boys} Garçons</span>
                        </div>
                    </div>
                </div>

                {/* Prof Principal */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                        <GraduationCap size={24} />
                    </div>
                    <div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">Prof. Principal</div>
                        <div className="text-lg font-bold text-slate-800">{classData.mainTeacher || 'Non assigné'}</div>
                        <div className="text-xs text-slate-500 mt-1">
                            Gestion administrative & discipline
                        </div>
                    </div>
                </div>

                {/* Taux de Remplissage */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
                    <div className="flex justify-between items-end mb-2">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">Capacité</div>
                        <div className="text-sm font-bold text-slate-800">{stats.active} / {classData.capacity} places</div>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                        <div
                            className={`h-full rounded-full ${stats.active > classData.capacity ? 'bg-red-500' : 'bg-green-500'}`}
                            style={{ width: `${Math.min((stats.active / classData.capacity) * 100, 100)}%` }}
                        ></div>
                    </div>
                    <div className="text-xs text-slate-400 mt-2 text-right">
                        {classData.capacity - stats.active > 0
                            ? `${classData.capacity - stats.active} places disponibles`
                            : 'Classe complète'}
                    </div>
                </div>
            </div>

            {/* 3. Contenu Principal */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">

                {/* Toolbar Interne */}
                <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50">
                    {/* Onglets */}
                    <div className="flex bg-slate-200 p-1 rounded-lg">
                        <button
                            onClick={() => setActiveTab('students')}
                            className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === 'students' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Liste des élèves
                        </button>
                        <button
                            onClick={() => setActiveTab('teachers')}
                            className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === 'teachers' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Équipe Pédago.
                        </button>
                        <button
                            onClick={() => setActiveTab('grades')}
                            className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === 'grades' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Notes & Bulletins
                        </button>
                    </div>

                    {/* Recherche Élève (Masquée si onglet Grades pour laisser place aux actions) */}
                    {activeTab !== 'grades' && (
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                placeholder="Chercher un élève..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-brand-primary text-slate-800"
                            />
                        </div>
                    )}

                    {activeTab === 'grades' && (
                        <div className="flex gap-2">
                            <button
                                onClick={() => setIsGradeEntryOpen(true)}
                                className="px-4 py-2 bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-bold hover:bg-slate-200 transition-colors flex items-center gap-2"
                            >
                                <ClipboardCopy size={14} className="text-brand-primary" />
                                Saisie des Notes
                            </button>
                            <button
                                onClick={() => alert('Calcul des moyennes automatiques...')}
                                className="px-4 py-2 bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-bold hover:bg-slate-200 transition-colors flex items-center gap-2"
                            >
                                <GraduationCap size={14} className="text-brand-primary" />
                                Calculer Moyennes
                            </button>
                            <button
                                onClick={(e) => {
                                    const btn = e.currentTarget;
                                    btn.innerHTML = `<span class="animate-spin mr-2">⏳</span>Génération...`;
                                    btn.disabled = true;
                                    setTimeout(() => {
                                        btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-check"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="m9 15 2 2 4-4"/></svg> Bulletins Générés`;
                                        btn.className = "px-4 py-2 bg-green-600 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-2";
                                        alert(`Félicitations ! Les bulletins de la classe ${classData.name} ont été générés et publiés.`);
                                    }, 2000);
                                }}
                                className="px-4 py-2 bg-brand-primary text-white rounded-lg text-xs font-bold hover:bg-orange-600 transition-colors flex items-center gap-2 shadow-lg shadow-orange-500/20"
                            >
                                <FileText size={14} />
                                Générer les Bulletins
                            </button>
                        </div>
                    )}
                </div>

                {/* Tableau des élèves */}
                {activeTab === 'students' && (
                    <div className="overflow-x-auto relative min-h-[300px]">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-xs border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-3 w-16">#</th>
                                    <th className="px-6 py-3">Matricule</th>
                                    <th className="px-6 py-3">Nom & Prénoms</th>
                                    <th className="px-6 py-3 text-center">Sexe</th>
                                    <th className="px-6 py-3 text-center">Statut</th>
                                    <th className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredStudents.length > 0 ? (
                                    filteredStudents.map((student, idx) => (
                                        <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-3 text-slate-400 font-mono text-xs">{idx + 1}</td>
                                            <td className="px-6 py-3 font-mono text-slate-600">{student.id}</td>
                                            <td className="px-6 py-3 font-medium text-slate-800">{student.name}</td>
                                            <td className="px-6 py-3 text-center">
                                                <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${student.gender === 'M' ? 'bg-blue-100 text-blue-600' : 'bg-pink-100 text-pink-600'}`}>
                                                    {student.gender}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3 text-center">
                                                {student.status === 'active' ? (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">Actif</span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700">Exclu</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-3 text-right relative">
                                                <button
                                                    onClick={(e) => toggleMenu(student.id, e)}
                                                    className="text-slate-400 hover:text-brand-primary transition-colors p-1"
                                                >
                                                    <MoreHorizontal size={18} />
                                                </button>

                                                {openMenuId === student.id && (
                                                    <div className="absolute right-6 top-8 w-48 bg-white rounded-lg shadow-xl border border-slate-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                                                        <div className="py-1">
                                                            <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                                                                <FileText size={16} className="text-slate-400" />
                                                                Voir le dossier
                                                            </button>
                                                            <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                                                                <ArrowRight size={16} className="text-blue-500" />
                                                                Transférer de classe
                                                            </button>
                                                        </div>
                                                        <div className="border-t border-slate-100 py-1">
                                                            <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                                                                {student.status === 'active' ? 'Exclure temporairement' : 'Réactiver l\'élève'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                                            Aucun élève trouvé dans cette classe.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* VUE DES NOTES ET BULLETINS */}
                {activeTab === 'grades' && (
                    <div className="overflow-x-auto relative animate-in fade-in duration-300">
                        <div className="bg-orange-50 p-4 border-b border-orange-100 flex items-center gap-3">
                            <AlertCircle size={18} className="text-brand-primary" />
                            <p className="text-sm text-orange-900 font-medium">
                                Saisissez les moyennes générales du trimestre pour pré-remplir les bulletins.
                                <span className="opacity-70 ml-1">Les bulletins seront archivés dès génération.</span>
                            </p>
                        </div>
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-xs border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-3">Élève</th>
                                    <th className="px-6 py-3 text-center">Moyenne Trim. 1</th>
                                    <th className="px-6 py-3 text-center">Moyenne Trim. 2</th>
                                    <th className="px-6 py-3 text-center">Moyenne Trim. 3</th>
                                    <th className="px-6 py-3 text-center">Statut Bulletin</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {mockStudents.map((student) => (
                                    <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-800">{student.name}</td>
                                        <td className="px-6 py-4">
                                            <input
                                                type="text"
                                                placeholder="00.00"
                                                className="w-20 mx-auto block text-center py-1 bg-white border border-slate-200 rounded text-slate-800 font-bold focus:ring-1 focus:ring-brand-primary outline-none"
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <input
                                                type="text"
                                                disabled
                                                placeholder="--"
                                                className="w-20 mx-auto block text-center py-1 bg-slate-50 border border-slate-100 rounded text-slate-400 font-bold"
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <input
                                                type="text"
                                                disabled
                                                placeholder="--"
                                                className="w-20 mx-auto block text-center py-1 bg-slate-50 border border-slate-100 rounded text-slate-400 font-bold"
                                            />
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-400 border border-slate-200">Non généré</span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-slate-400 hover:text-brand-primary p-1" title="Voir prévisualisation">
                                                <Eye size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Placeholder pour Équipe Pédago */}
                {activeTab === 'teachers' && (
                    <div className="p-8 text-center text-slate-500">
                        <GraduationCap size={48} className="mx-auto mb-3 text-slate-300" />
                        <p>La liste des professeurs par matière sera disponible dans le module 3.</p>
                    </div>
                )}

            </div>
            {/* Modal de Saisie des Notes Détaillée */}
            <GradeEntrySheet
                isOpen={isGradeEntryOpen}
                onClose={() => setIsGradeEntryOpen(false)}
                className={classData.name}
                students={mockStudents}
            />
            {/* Modal de Présence (L'Appel) */}
            {isAttendanceOpen && (
                <AttendanceRegister
                    className={classData.name}
                    students={mockStudents}
                    onClose={() => setIsAttendanceOpen(false)}
                />
            )}
        </div>
    );
};

export default ClassDetail;