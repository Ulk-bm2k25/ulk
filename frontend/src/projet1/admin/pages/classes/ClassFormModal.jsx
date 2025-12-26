import React, { useState, useEffect } from 'react';
import { X, Save, Layers } from 'lucide-react';

const ClassFormModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  // Structure des données
  const [formData, setFormData] = useState({
    level: 'Collège',
    root: '6ème',
    series: '',
    capacity: 40,
    mainTeacher: ''
  });

  // --- CONFIGURATION DES NIVEAUX ---
  const structures = {
    'Maternelle': ['Petite Section', 'Moyenne Section', 'Grande Section'],
    'Primaire': ['CI', 'CP', 'CE1', 'CE2', 'CM1', 'CM2'],
    'Collège': ['6ème', '5ème', '4ème', '3ème'],
    'Lycée': ['2nde', '1ère', 'Terminale']
  };

  // --- CONFIGURATION DES SÉRIES PAR CYCLE (MODIFIÉ) ---
  const seriesConfig = {
    // Pour le Collège (4ème et 3ème) : Séries A et E uniquement
    'Collège': ['A', 'E'],
    // Pour le Lycée
    'Lycée': ['A', 'B', 'C', 'D', 'G1', 'G2', 'F3', 'F4']
  };

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        level: 'Collège',
        root: '6ème',
        series: '',
        capacity: 40,
        mainTeacher: ''
      });
    }
  }, [initialData, isOpen]);

  const handleLevelChange = (newLevel) => {
    setFormData(prev => ({
      ...prev,
      level: newLevel,
      root: structures[newLevel][0],
      series: '' // Reset série
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Map level names to IDs (In a real app, these should come from the API)
    const levelMap = { 'Maternelle': 1, 'Primaire': 2, 'Collège': 3, 'Lycée': 4 };

    const preparedData = {
      nom: `${formData.root} ${formData.series}`.trim(),
      niveau_id: levelMap[formData.level] || 3,
      capacity_max: formData.capacity
    };

    onSubmit(preparedData);
    onClose();
  };

  // --- LOGIQUE D'AFFICHAGE DES SÉRIES ---
  // On affiche les séries si c'est le Lycée OU si c'est 4ème/3ème au Collège
  const shouldShowSeries =
    formData.level === 'Lycée' ||
    (formData.level === 'Collège' && ['4ème', '3ème'].includes(formData.root));

  // On récupère la bonne liste de séries
  const availableSeries = formData.level === 'Lycée'
    ? seriesConfig['Lycée']
    : seriesConfig['Collège'];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">

        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-lg font-bold text-slate-800">
            {initialData ? 'Modifier la classe' : 'Nouvelle Classe'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          <div className="bg-brand-primary/5 p-4 rounded-xl border border-brand-primary/10 space-y-4">
            <div className="flex items-center gap-2 text-brand-primary mb-2">
              <Layers size={18} />
              <span className="font-bold text-sm uppercase">Structure de la classe</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Cycle */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Cycle</label>
                <select
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 font-medium text-slate-800"
                  value={formData.level}
                  onChange={(e) => handleLevelChange(e.target.value)}
                >
                  {Object.keys(structures).map(lvl => (
                    <option key={lvl} value={lvl}>{lvl}</option>
                  ))}
                </select>
              </div>

              {/* Niveau */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Niveau</label>
                <select
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 font-bold text-slate-800"
                  value={formData.root}
                  onChange={(e) => setFormData({ ...formData, root: e.target.value, series: '' })}
                >
                  {structures[formData.level].map(cls => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* SÉRIE (Dynamique) */}
            {shouldShowSeries && (
              <div className="space-y-1.5 animate-in slide-in-from-top-1">
                <label className="text-xs font-bold text-slate-500 uppercase">
                  {formData.level === 'Lycée' ? 'Série' : 'Option (Langue)'}
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableSeries.map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setFormData({ ...formData, series: formData.series === s ? '' : s })}
                      className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all border ${formData.series === s
                          ? 'bg-brand-primary text-white border-brand-primary'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                        }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="text-center pt-2">
              <span className="text-xs text-slate-400">Aperçu : </span>
              <span className="font-black text-slate-800 text-lg">
                {formData.root} {formData.series} <span className="text-slate-400 font-normal italic opacity-50 text-xs">(Auto-incrémenté)</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Capacité Max.</label>
              <input
                type="number"
                min="10"
                max="100"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Prof. Principal</label>
              <input
                type="text"
                placeholder="Nom..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                value={formData.mainTeacher}
                onChange={(e) => setFormData({ ...formData, mainTeacher: e.target.value })}
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 font-medium rounded-lg hover:bg-slate-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-brand-primary text-white font-bold rounded-lg hover:bg-orange-600 flex items-center gap-2"
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