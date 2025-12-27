import React, { useState, useEffect } from 'react';
import { FileText, Calculator, Download, Filter } from 'lucide-react';
import api from '../../../api';

const Deliberation = () => {
  const [classes, setClasses] = useState([]);
  const [semestres, setSemestres] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    classe_id: '',
    semestre_id: '',
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (filters.classe_id && filters.semestre_id) {
      loadStudentsWithAverages();
    }
  }, [filters]);

  const loadInitialData = async () => {
    // TODO: API calls
    setClasses([{ id: 1, name: '6ème A' }, { id: 2, name: 'Terminale D' }]);
    setSemestres([{ id: 1, nom: 'Trimestre 1' }]);
  };

  const loadStudentsWithAverages = async () => {
    try {
      setLoading(true);
      // TODO: await api.get(`/deliberation`, { params: filters });
      
      // Mock data avec moyennes calculées
      setStudents([
        {
          id: 1,
          nom: 'Dupont',
          prenom: 'Jean',
          moyenne: 15.5,
          rang: 1,
          decision: 'Admis',
        },
        {
          id: 2,
          nom: 'Martin',
          prenom: 'Marie',
          moyenne: 12.0,
          rang: 2,
          decision: 'Admis',
        },
      ]);
    } catch (error) {
      console.error('Erreur chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeliberate = async () => {
    if (!confirm('Confirmer la délibération pour cette classe et ce semestre ?')) return;
    try {
      // TODO: await api.post('/deliberation', filters);
      alert('Délibération effectuée avec succès');
    } catch (error) {
      console.error('Erreur délibération:', error);
      alert('Erreur lors de la délibération');
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <FileText className="text-orange-600" size={28} />
          Délibération
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Effectuez la délibération et générez les décisions pour les élèves
        </p>
      </div>

      {/* Filtres */}
      <div className="bg-white p-4 rounded-lg border border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Classe *</label>
            <select
              value={filters.classe_id}
              onChange={(e) => setFilters({ ...filters, classe_id: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500/20 outline-none"
            >
              <option value="">Sélectionner...</option>
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Semestre/Trimestre *</label>
            <select
              value={filters.semestre_id}
              onChange={(e) => setFilters({ ...filters, semestre_id: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500/20 outline-none"
            >
              <option value="">Sélectionner...</option>
              {semestres.map(s => (
                <option key={s.id} value={s.id}>{s.nom}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={handleDeliberate}
              disabled={!filters.classe_id || !filters.semestre_id}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Calculator size={20} />
              Délibérer
            </button>
          </div>
        </div>
      </div>

      {/* Résultats */}
      {loading ? (
        <div className="text-center py-10">Calcul des moyennes...</div>
      ) : students.length > 0 ? (
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Rang</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Élève</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Moyenne</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Décision</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-bold text-slate-800">{student.rang}</td>
                  <td className="px-6 py-4 font-medium text-slate-800">
                    {student.prenom} {student.nom}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-lg font-bold text-slate-800">{student.moyenne.toFixed(2)}</span>
                    <span className="text-sm text-slate-500">/20</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      student.decision === 'Admis' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {student.decision}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : filters.classe_id && filters.semestre_id ? (
        <div className="text-center py-10 text-slate-400">
          Aucun résultat disponible
        </div>
      ) : (
        <div className="text-center py-10 text-slate-400">
          Sélectionnez une classe et un semestre pour commencer
        </div>
      )}
    </div>
  );
};

export default Deliberation;

