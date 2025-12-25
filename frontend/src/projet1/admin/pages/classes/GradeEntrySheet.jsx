import React, { useState } from 'react';
import {
    X, Save, Calculator, BookOpen, Clock,
    AlertCircle, Hash
} from 'lucide-react';

const GradeEntrySheet = ({ isOpen, onClose, className, students = [] }) => {
    const [selectedSubject, setSelectedSubject] = useState('Mathématiques');
    const [selectedPeriod, setSelectedPeriod] = useState('Trimestre 1');
    const [subjectCoeff, setSubjectCoeff] = useState(4); // L'admin choisit uniquement le coefficient de la matière
    const [isSaving, setIsSaving] = useState(false);

    // Mock subjects
    const subjects = [
        'Mathématiques', 'Français', 'Anglais', 'Physique-Chimie',
        'SVT', 'Histoire-Géo', 'Philosophie', 'EPS'
    ];

    // Initialisation des notes (Mock)
    const [grades, setGrades] = useState(
        students.reduce((acc, student) => {
            acc[student.id] = {
                int1: '',
                int2: '',
                int3: '',
                devoir: '',
                compo: ''
            };
            return acc;
        }, {})
    );

    const handleGradeChange = (studentId, field, value) => {
        // Validation simple : 0-20
        if (value !== '' && (isNaN(value.replace(',', '.')) || parseFloat(value.replace(',', '.')) < 0 || parseFloat(value.replace(',', '.')) > 20)) return;

        setGrades(prev => ({
            ...prev,
            [studentId]: {
                ...prev[studentId],
                [field]: value.replace(',', '.')
            }
        }));
    };

    const calculateAverage = (studentGrades) => {
        const { int1, int2, int3, devoir, compo } = studentGrades;
        const vals = [int1, int2, int3].filter(v => v !== '').map(v => parseFloat(v));

        if (vals.length === 0 && devoir === '' && compo === '') return '--';

        const interroAvg = vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
        const d = devoir !== '' ? parseFloat(devoir) : 0;
        const c = compo !== '' ? parseFloat(compo) : 0;

        // Formule FIXE interne : (Moy Interros + Devoir + 2*Composition) / 4
        const finalAvg = (interroAvg + d + (2 * c)) / 4;
        return finalAvg.toFixed(2);
    };

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            alert(`Les notes de ${selectedSubject} (Coef: ${subjectCoeff}) pour le ${selectedPeriod} ont été enregistrées.`);
            onClose();
        }, 1500);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-end bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="w-full max-w-5xl h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">

                {/* Header Rapide */}
                <div className="bg-brand-dark p-6 text-white flex justify-between items-center shrink-0">
                    <div>
                        <div className="flex items-center gap-2 text-brand-primary mb-1">
                            <Calculator size={20} />
                            <span className="text-sm font-bold uppercase tracking-widest text-brand-primary">Saisie des Notes (Trimestrielle)</span>
                        </div>
                        <h2 className="text-2xl font-bold">Classe de {className}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <X size={28} />
                    </button>
                </div>

                {/* Configuration & Sélecteurs */}
                <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col gap-4 shrink-0">
                    <div className="flex flex-wrap gap-4 items-end">
                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 pl-1">Matière</label>
                            <div className="relative">
                                <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <select
                                    value={selectedSubject}
                                    onChange={(e) => setSelectedSubject(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary/20 text-slate-800 font-bold appearance-none outline-none"
                                >
                                    {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="w-48">
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 pl-1">Période</label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <select
                                    value={selectedPeriod}
                                    onChange={(e) => setSelectedPeriod(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary/20 text-slate-800 font-bold appearance-none outline-none"
                                >
                                    <option>Trimestre 1</option>
                                    <option>Trimestre 2</option>
                                    <option>Trimestre 3</option>
                                </select>
                            </div>
                        </div>

                        {/* RÉGLAGE DU COEFFICIENT DE LA MATIÈRE */}
                        <div className="w-56 bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                            <div className="flex items-center gap-2 text-slate-600 font-bold text-[10px] uppercase">
                                <Hash size={16} className="text-brand-primary" />
                                Coeff. Matière :
                            </div>
                            <input
                                type="number"
                                min="1"
                                max="10"
                                className="w-14 h-9 text-center text-sm font-bold border-b-2 border-brand-primary/30 focus:border-brand-primary outline-none"
                                value={subjectCoeff}
                                onChange={(e) => setSubjectCoeff(parseInt(e.target.value) || 1)}
                            />
                        </div>
                    </div>
                </div>

                {/* Tableau de saisie de masse */}
                <div className="flex-1 overflow-auto bg-slate-50 p-6">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-w-[800px]">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase text-slate-500 font-bold tracking-wider">
                                    <th className="px-6 py-4 sticky left-0 bg-slate-50 z-10 w-64">Élève</th>
                                    <th className="px-4 py-4 text-center">Interro 1</th>
                                    <th className="px-4 py-4 text-center">Interro 2</th>
                                    <th className="px-4 py-4 text-center">Interro 3</th>
                                    <th className="px-4 py-4 text-center bg-orange-50/50">Devoir</th>
                                    <th className="px-4 py-4 text-center bg-brand-primary/5">Composition</th>
                                    <th className="px-6 py-4 text-right bg-slate-50 sticky right-0 z-10">Moy. /20</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {students.map((student) => (
                                    <tr key={student.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4 sticky left-0 bg-white z-10 border-r border-slate-100 group-hover:bg-slate-50">
                                            <div className="font-bold text-slate-800 uppercase text-xs">{student.name}</div>
                                            <div className="text-[10px] text-slate-400 font-mono">{student.id}</div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <input
                                                type="text"
                                                className="w-14 h-10 bg-slate-50 border border-slate-200 rounded-lg text-center font-bold text-slate-700 focus:bg-white focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
                                                placeholder="--"
                                                value={grades[student.id]?.int1}
                                                onChange={(e) => handleGradeChange(student.id, 'int1', e.target.value)}
                                            />
                                        </td>
                                        <td className="px-4 py-4">
                                            <input
                                                type="text"
                                                className="w-14 h-10 bg-slate-50 border border-slate-200 rounded-lg text-center font-bold text-slate-700 focus:bg-white focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
                                                placeholder="--"
                                                value={grades[student.id]?.int2}
                                                onChange={(e) => handleGradeChange(student.id, 'int2', e.target.value)}
                                            />
                                        </td>
                                        <td className="px-4 py-4">
                                            <input
                                                type="text"
                                                className="w-14 h-10 bg-slate-50 border border-slate-200 rounded-lg text-center font-bold text-slate-700 focus:bg-white focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
                                                placeholder="--"
                                                value={grades[student.id]?.int2}
                                                onChange={(e) => handleGradeChange(student.id, 'int3', e.target.value)}
                                            />
                                        </td>
                                        <td className="px-4 py-4 bg-orange-50/20">
                                            <input
                                                type="text"
                                                className="w-14 h-10 bg-white border border-orange-200 rounded-lg text-center font-bold text-orange-700 focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
                                                placeholder="--"
                                                value={grades[student.id]?.devoir}
                                                onChange={(e) => handleGradeChange(student.id, 'devoir', e.target.value)}
                                            />
                                        </td>
                                        <td className="px-4 py-4 bg-brand-primary/5">
                                            <input
                                                type="text"
                                                className="w-16 h-10 bg-white border border-brand-primary/30 rounded-lg text-center font-bold text-slate-800 focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
                                                placeholder="--"
                                                value={grades[student.id]?.compo}
                                                onChange={(e) => handleGradeChange(student.id, 'compo', e.target.value)}
                                            />
                                        </td>
                                        <td className="px-6 py-4 text-right sticky right-0 bg-white z-10 border-l border-slate-100 shadow-[-4px_0_10px_-4px_rgba(0,0,0,0.05)]">
                                            <span className={`text-lg font-black ${parseFloat(calculateAverage(grades[student.id])) >= 10 ? 'text-green-600' : 'text-red-500'}`}>
                                                {calculateAverage(grades[student.id])}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer Fixe */}
                <div className="p-6 bg-white border-t border-slate-200 flex justify-between items-center shrink-0">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-blue-700 bg-blue-50 px-4 py-2 rounded-lg border border-blue-100 text-xs font-bold">
                            <AlertCircle size={14} />
                            Calcul Interne : (Moy. Interros + Devoir + 2×Composition) / 4
                        </div>
                        <div className="text-[10px] text-slate-400 font-medium pl-1">
                            * La moyenne finale sera multipliée par le coefficient <strong>{subjectCoeff}</strong> de la matière sur le bulletin.
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all active:scale-95"
                        >
                            Annuler
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="px-8 py-2.5 bg-brand-primary text-white font-bold rounded-xl shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
                        >
                            {isSaving ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>Calcul & Enregistrement...</span>
                                </>
                            ) : (
                                <>
                                    <Save size={18} />
                                    <span>Valider le Trimestre</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default GradeEntrySheet;
