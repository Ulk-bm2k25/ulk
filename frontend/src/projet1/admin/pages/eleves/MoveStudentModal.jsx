import React, { useState, useEffect } from 'react';
import { X, ArrowRight, AlertTriangle, CheckCircle, School, AlertCircle } from 'lucide-react';

const MoveStudentModal = ({ isOpen, onClose, student, onConfirm, classes = [] }) => {
    const [selectedClassId, setSelectedClassId] = useState('');
    const [forceOverride, setForceOverride] = useState(false); // Pour forcer si plein

    // No mock data needed, classes are passed as props

    // Reset à l'ouverture
    useEffect(() => {
        if (isOpen) {
            setSelectedClassId('');
            setForceOverride(false);
        }
    }, [isOpen]);

    if (!isOpen || !student) return null;

    // Logique de détection de capacité
    const targetClass = classes.find(c => c.id === parseInt(selectedClassId));
    const isFull = targetClass ? (targetClass.eleves_count || 0) >= (targetClass.capacite || 50) : false;
    const isOverloaded = targetClass ? (targetClass.eleves_count || 0) > (targetClass.capacite || 50) : false;

    const handleConfirm = () => {
        onConfirm(student.id, targetClass.id);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">

                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h2 className="text-lg font-bold text-slate-800">Changer de classe</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                        <X size={20} className="text-slate-500" />
                    </button>
                </div>

                <div className="p-6 space-y-6">

                    {/* Résumé du transfert */}
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="text-center">
                            <div className="text-xs text-slate-500 font-semibold uppercase">Actuel</div>
                            <div className="font-bold text-slate-800 text-lg">{student.class}</div>
                        </div>
                        <div className="text-slate-400">
                            <ArrowRight size={24} />
                        </div>
                        <div className="text-center">
                            <div className="text-xs text-slate-500 font-semibold uppercase">Cible</div>
                            <div className={`font-bold text-lg ${targetClass ? 'text-brand-primary' : 'text-slate-300'}`}>
                                {targetClass ? targetClass.nom : '?'}
                            </div>
                        </div>
                    </div>

                    {/* Sélection */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-slate-700">Nouvelle Classe de destination</label>
                        <div className="relative">
                            <School className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <select
                                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-slate-700"
                                value={selectedClassId}
                                onChange={(e) => setSelectedClassId(e.target.value)}
                            >
                                <option value="">Sélectionner...</option>
                                {classes.map(c => (
                                    <option key={c.id} value={c.id} disabled={c.nom === student.class}>
                                        {c.nom} ({c.eleves_count || 0}/{c.capacite || 50} places)
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* --- ALERTE DE CAPACITÉ --- */}
                    {targetClass && isFull && (
                        <div className={`p-4 rounded-lg flex items-start gap-3 ${isOverloaded ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-orange-50 text-orange-700 border border-orange-100'}`}>
                            <AlertTriangle size={20} className="shrink-0 mt-0.5" />
                            <div className="space-y-2">
                                <p className="text-sm font-bold">
                                    {isOverloaded ? 'Classe déjà surchargée !' : 'Capacité maximale atteinte'}
                                </p>
                                <p className="text-xs opacity-90">
                                    Cette classe compte déjà {targetClass.eleves_count || 0} élèves pour {targetClass.capacite || 50} places. L'ajout d'un élève dépassera le seuil autorisé.
                                </p>

                                {/* Option pour forcer (Admin Power) */}
                                <label className="flex items-center gap-2 mt-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="rounded text-red-600 focus:ring-red-500 border-red-300"
                                        checked={forceOverride}
                                        onChange={(e) => setForceOverride(e.target.checked)}
                                    />
                                    <span className="text-xs font-semibold underline">Forcer l'affectation tout de même</span>
                                </label>
                            </div>
                        </div>
                    )}

                    {/* Message Info normal */}
                    {targetClass && !isFull && (
                        <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg border border-green-100 text-sm font-medium">
                            <span className="shrink-0"><CheckCircle size={16} /></span>
                            <span>Place disponible. Capacité après ajout : {(targetClass.eleves_count || 0) + 1}/{targetClass.capacite || 50}</span>
                        </div>
                    )}

                </div>

                {/* Footer Actions */}
                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-white transition-colors"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={!selectedClassId || (isFull && !forceOverride)}
                        className="px-6 py-2 bg-brand-primary text-white font-bold rounded-lg hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isFull && forceOverride && <AlertCircle size={16} />}
                        Confirmer le transfert
                    </button>
                </div>

            </div>
        </div>
    );
};

export default MoveStudentModal;