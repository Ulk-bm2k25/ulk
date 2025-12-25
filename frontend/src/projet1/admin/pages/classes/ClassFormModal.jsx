import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';

const ClassFormModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  // État du formulaire
  const [formData, setFormData] = useState({
    name: '',
    level: 'Collège', // Collège, Lycée
    series: '',
    capacity: 40,
    mainTeacher: ''
  });

  // Si on est en mode "Modification", on remplit le formulaire
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      // Reset si création
      setFormData({ name: '', level: 'Collège', series: '', capacity: 40, mainTeacher: '' });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validation simple
    if (!formData.name) return;
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">

        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-lg font-bold text-slate-800">
            {initialData ? 'Modifier la classe' : 'Nouvelle Classe'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          {/* Nom de la classe */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Nom de la classe <span className="text-red-500">*</span></label>
            <input
              type="text"
              required
              placeholder="Ex: 6ème A, Tle D..."
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all text-slate-800 placeholder:text-slate-400"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <p className="text-xs text-slate-400">Le nom qui apparaîtra sur les bulletins.</p>
          </div>

          <div className="grid grid-cols-2 gap-5">
            {/* Niveau */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Niveau</label>
              <select
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary text-slate-800"
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
              >
                <option value="Maternelle">Maternelle</option>
                <option value="Primaire">Primaire</option>
                <option value="Collège">Collège</option>
                <option value="Lycée">Lycée</option>
              </select>
            </div>

            {/* Série (Conditionnel) */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Série</label>
              <select
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary disabled:opacity-50 text-slate-800"
                value={formData.series}
                onChange={(e) => setFormData({ ...formData, series: e.target.value })}
                disabled={formData.level === 'Collège' && !formData.name.includes('3ème')} // Logique métier simple
              >
                <option value="">Aucune</option>
                <option value="A">Série A (Littéraire)</option>
                <option value="B">Série B (Eco)</option>
                <option value="C">Série C (Scientifique)</option>
                <option value="D">Série D (Bio)</option>
                <option value="G1">Série G1 (Secrétariat)</option>
                <option value="G2">Série G2 (Comptabilité)</option>
                <option value="Moderne">Moderne (3ème)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            {/* Capacité */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Capacité Max.</label>
              <input
                type="number"
                min="10"
                max="100"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary text-slate-800"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
              />
            </div>

            {/* Prof Principal */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Prof. Principal</label>
              <input
                type="text"
                placeholder="Nom de l'enseignant"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary text-slate-800 placeholder:text-slate-400"
                value={formData.mainTeacher}
                onChange={(e) => setFormData({ ...formData, mainTeacher: e.target.value })}
              />
            </div>
          </div>

          {/* Info Warning */}
          <div className="p-3 bg-orange-50 text-orange-700 text-xs rounded-lg flex items-start gap-2">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <p>La modification de la capacité n'affecte pas les élèves déjà inscrits, mais déclenchera des alertes si le seuil est dépassé.</p>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 font-medium rounded-lg hover:bg-slate-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-brand-primary text-white font-bold rounded-lg hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20 flex items-center gap-2"
            >
              <Save size={18} />
              Enregistrer
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ClassFormModal;