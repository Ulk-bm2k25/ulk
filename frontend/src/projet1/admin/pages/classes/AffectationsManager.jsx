import React, { useState, useEffect } from 'react';
import {
    ArrowLeft, Users, Search, Filter, Loader2, UserPlus, TrendingUp
} from 'lucide-react';

const AffectationsManager = ({ onBack }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [selectedClassId, setSelectedClassId] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStudentIds, setSelectedStudentIds] = useState([]);

    // --- MOCK DATA ROBUSTE (Pour que l'écran fonctionne) ---
    const classes = [
        { id: 1, name: '6ème A', capacity: 50, studentCount: 45, level: 'Collège', root: '6ème' },
        { id: 2, name: '6ème B', capacity: 50, studentCount: 22, level: 'Collège', root: '6ème' },
        { id: 3, name: '5ème A', capacity: 45, studentCount: 10, level: 'Collège', root: '5ème' },
        { id: 4, name: '3ème A', capacity: 38, studentCount: 36, level: 'Collège', root: '3ème' },
        { id: 5, name: '2nde C', capacity: 35, studentCount: 32, level: 'Lycée', root: '2nde' },
        { id: 6, name: 'Tle C', capacity: 35, studentCount: 36, level: 'Lycée', root: 'Terminale' },
    ];

    // Liste des élèves en attente (Le "Vivier")
    const unassignedStudents = [
        { id: 'MAT-NEW-01', name: 'Koffi Alain', previous_class: 'CM2', average: 14.5, decision: 'Admis', suggested_level: '6ème' },
        { id: 'MAT-NEW-02', name: 'Sena Béatrice', previous_class: 'CM2', average: 11.2, decision: 'Admis', suggested_level: '6ème' },
        { id: 'MAT-OLD-03', name: 'Junior Dossou', previous_class: '3ème', average: 12.8, decision: 'Admis', suggested_level: '2nde' },
        { id: 'MAT-OLD-04', name: 'Gloria Mensah', previous_class: '6ème', average: 15.1, decision: 'Admis', suggested_level: '5ème' },
        { id: 'MAT-OLD-05', name: 'Paul Pierre', previous_class: '2nde', average: 8.4, decision: 'Redouble', suggested_level: '2nde' },
        { id: 'MAT-EXT-07', name: 'David Zinsou (Transfert)', previous_class: '4ème (Ext)', average: 13.5, decision: 'Transfert', suggested_level: '3ème' }
    ];

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 600);
        return () => clearTimeout(timer);
    }, []);

    // --- LOGIQUE MÉTIER ---

    const targetClass = classes.find(c => c.id === parseInt(selectedClassId));

    // FILTRE INTELLIGENT :
    const filteredStudents = unassignedStudents.filter(s => {
        const matchSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
        
        let matchEligibility = true;
        if (targetClass) {
            // Vérifie si le niveau suggéré correspond à la racine de la classe cible
            // Ex: "6ème" correspond à "6ème A", "6ème B"
            matchEligibility = targetClass.name.startsWith(s.suggested_level) || targetClass.root === s.suggested_level;
        }

        return matchSearch && matchEligibility;
    });

    const toggleSelection = (id) => {
        if (selectedStudentIds.includes(id)) {
            setSelectedStudentIds(selectedStudentIds.filter(sid => sid !== id));
        } else {
            setSelectedStudentIds([...selectedStudentIds, id]);
        }
    };

    const handleSelectAll = () => {
        if (selectedStudentIds.length === filteredStudents.length) {
            setSelectedStudentIds([]);
        } else {
            setSelectedStudentIds(filteredStudents.map(s => s.id));
        }
    };

    const handleSave = () => {
        if (targetClass) {
            alert(`Succès : ${selectedStudentIds.length} élèves ont été affectés à la classe ${targetClass.name}.`);
            onBack();
        }
    };

    if (isLoading) {
        return (
            <div className="h-[calc(100vh-150px)] flex items-center justify-center">
                <Loader2 size={40} className="animate-spin text-orange-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300 pb-20">

            {/* 1. Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Affectations de masse</h1>
                        <p className="text-slate-500 text-sm">Répartissez les élèves selon leur décision de fin d'année.</p>
                    </div>
                </div>
            </div>

            {/* 2. Zone de Contrôle (Sélection Classe Cible) */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <label className="block text-sm font-bold text-slate-700 mb-2">1. Choisir la classe de destination</label>
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                    <select
                        className="w-full md:w-1/3 px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-slate-800 font-bold outline-none"
                        value={selectedClassId}
                        onChange={(e) => {
                            setSelectedClassId(e.target.value);
                            setSelectedStudentIds([]);
                        }}
                    >
                        <option value="">-- Sélectionner une classe --</option>
                        {classes.map(c => (
                            <option key={c.id} value={c.id}>
                                {c.name} ({c.studentCount}/{c.capacity} places)
                            </option>
                        ))}
                    </select>

                    {/* Aide visuelle pour l'admin */}
                    {targetClass && (
                        <div className="flex-1 bg-blue-50 text-blue-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2 border border-blue-100 animate-in fade-in">
                            <Filter size={18} />
                            <span>
                                Filtre activé : Affichage des élèves admissibles en <strong>{targetClass.root}</strong> uniquement.
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* 3. Liste de Sélection (Le Vivier) */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[500px]">

                {/* Toolbar Liste */}
                <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-orange-100 text-orange-600 p-2 rounded-lg">
                            <Users size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800">2. Sélectionner les élèves</h3>
                            <p className="text-xs text-slate-500">
                                {filteredStudents.length} élèves éligibles trouvés
                            </p>
                        </div>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Chercher par nom..."
                            className="pl-9 pr-4 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 w-64 text-slate-800"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Tableau Scrollable */}
                <div className="flex-1 overflow-y-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-100 text-slate-500 font-bold uppercase sticky top-0 z-10 text-xs tracking-wider">
                            <tr>
                                <th className="px-6 py-3 w-16 bg-slate-100 border-b border-slate-200">
                                    <input
                                        type="checkbox"
                                        className="rounded border-slate-300 text-orange-600 focus:ring-orange-500 cursor-pointer"
                                        onChange={handleSelectAll}
                                        checked={filteredStudents.length > 0 && selectedStudentIds.length === filteredStudents.length}
                                        disabled={filteredStudents.length === 0}
                                    />
                                </th>
                                <th className="px-6 py-3 bg-slate-100 border-b border-slate-200">Élève</th>
                                <th className="px-6 py-3 bg-slate-100 border-b border-slate-200">Provenance</th>
                                <th className="px-6 py-3 bg-slate-100 border-b border-slate-200">Moyenne An.</th>
                                <th className="px-6 py-3 bg-slate-100 border-b border-slate-200">Décision</th>
                                <th className="px-6 py-3 bg-slate-100 border-b border-slate-200">Niveau Cible</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredStudents.length > 0 ? (
                                filteredStudents.map((student) => (
                                    <tr
                                        key={student.id}
                                        className={`hover:bg-orange-50 transition-colors cursor-pointer ${selectedStudentIds.includes(student.id) ? 'bg-orange-50' : ''}`}
                                        onClick={() => toggleSelection(student.id)}
                                    >
                                        <td className="px-6 py-4">
                                            <input
                                                type="checkbox"
                                                className="rounded border-slate-300 text-orange-600 focus:ring-orange-500 pointer-events-none"
                                                checked={selectedStudentIds.includes(student.id)}
                                                readOnly
                                            />
                                        </td>
                                        <td className="px-6 py-4 font-bold text-slate-800">
                                            {student.name}
                                            <div className="text-xs text-slate-400 font-normal font-mono">{student.id}</div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">
                                            {student.previous_class}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={`flex items-center gap-1 font-bold ${student.average >= 10 ? 'text-green-600' : 'text-red-600'}`}>
                                                <TrendingUp size={14} />
                                                {student.average}/20
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {student.decision === 'Admis' && (
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">Passage</span>
                                            )}
                                            {student.decision === 'Redouble' && (
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700">Redoublement</span>
                                            )}
                                            {student.decision === 'Transfert' && (
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200">
                                                    Transfert
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 font-bold text-slate-800">
                                            {student.suggested_level}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-16 text-center text-slate-500">
                                        {targetClass
                                            ? `Aucun élève trouvé pour le niveau ${targetClass.root}.`
                                            : "Veuillez sélectionner une classe cible ci-dessus pour commencer."}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-between items-center">
                    <div className="text-sm text-slate-600">
                        <strong>{selectedStudentIds.length}</strong> élève(s) prêt(s) à rejoindre <strong>{targetClass?.name || '...'}</strong>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={!selectedClassId || selectedStudentIds.length === 0}
                        className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <UserPlus size={18} />
                        Confirmer l'affectation
                    </button>
                </div>

            </div>
        </div>
    );
};

export default AffectationsManager;