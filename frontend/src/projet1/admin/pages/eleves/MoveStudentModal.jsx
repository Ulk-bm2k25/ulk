import React, { useState, useEffect } from 'react';
import { X, ArrowRight, AlertTriangle, CheckCircle, School, AlertCircle } from 'lucide-react';

const MoveStudentModal = ({ isOpen, onClose, student, onConfirm, availableClasses = [] }) => {
  const [selectedClassId, setSelectedClassId] = useState('');
  const [forceOverride, setForceOverride] = useState(false);

  // Fallback si aucune classe n'est passée
  const mockClasses = [
    { id: 1, name: '6ème A', capacity: 50, studentCount: 45 },
    { id: 2, name: '6ème B', capacity: 50, studentCount: 22 },
  ];

  const classesList = availableClasses.length > 0 ? availableClasses : mockClasses;

  useEffect(() => {
    if (isOpen) {
      setSelectedClassId('');
      setForceOverride(false);
    }
  }, [isOpen]);

  if (!isOpen || !student) return null;

  const targetClass = classesList.find(c => c.id === parseInt(selectedClassId));
  
  // Utilisation de studentCount pour la cohérence
  const isFull = targetClass ? targetClass.studentCount >= targetClass.capacity : false;
  const isOverloaded = targetClass ? targetClass.studentCount > targetClass.capacity : false;

  const handleConfirm = () => {
    if (targetClass) {
        onConfirm(student.id, targetClass.name); // On envoie le NOM de la classe pour la mise à jour
        onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-lg font-bold text-slate-800">Changer de classe</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-center">
                    <div className="text-xs text-slate-500 font-semibold uppercase">Actuel</div>
                    <div className="font-bold text-slate-800 text-lg">{student.class}</div>
                </div>
                <div className="text-slate-400"><ArrowRight size={24} /></div>
                <div className="text-center">
                    <div className="text-xs text-slate-500 font-semibold uppercase">Cible</div>
                    <div className={`font-bold text-lg ${targetClass ? 'text-brand-primary' : 'text-slate-300'}`}>
                        {targetClass ? targetClass.name : '?'}
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">Nouvelle Classe</label>
                <div className="relative">
                    <School className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <select 
                        className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-slate-700"
                        value={selectedClassId}
                        onChange={(e) => setSelectedClassId(e.target.value)}
                    >
                        <option value="">Sélectionner...</option>
                        {classesList.map(c => (
                            <option key={c.id} value={c.id} disabled={c.name === student.class}>
                                {c.name} ({c.studentCount}/{c.capacity})
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {targetClass && isFull && (
                <div className={`p-4 rounded-lg flex items-start gap-3 ${isOverloaded ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-orange-50 text-orange-700 border border-orange-100'}`}>
                    <AlertTriangle size={20} className="shrink-0 mt-0.5" />
                    <div className="space-y-2">
                        <p className="text-sm font-bold">Capacité atteinte !</p>
                        <label className="flex items-center gap-2 mt-2 cursor-pointer">
                            <input type="checkbox" className="rounded text-red-600 focus:ring-red-500" checked={forceOverride} onChange={(e) => setForceOverride(e.target.checked)} />
                            <span className="text-xs font-semibold underline">Forcer l'affectation</span>
                        </label>
                    </div>
                </div>
            )}
        </div>

        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-white">Annuler</button>
            <button 
                onClick={handleConfirm}
                disabled={!selectedClassId || (isFull && !forceOverride)}
                className="px-6 py-2 bg-brand-primary text-white font-bold rounded-lg hover:bg-orange-600 disabled:opacity-50 flex items-center gap-2"
            >
                {isFull && forceOverride && <AlertCircle size={16} />}
                Confirmer
            </button>
        </div>
      </div>
    </div>
  );
};

export default MoveStudentModal;