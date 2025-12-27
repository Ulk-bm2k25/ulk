import React, { useState, useEffect } from 'react';
import { Calculator, Save, Search, Filter } from 'lucide-react';
import api from '../../../api';

const NotesEntry = () => {
  const [classes, setClasses] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [semestres, setSemestres] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [filters, setFilters] = useState({
    classe_id: '',
    matiere_id: '',
    semestre_id: '',
  });

  const [notes, setNotes] = useState({});

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (filters.classe_id) {
      loadStudents();
    }
  }, [filters.classe_id]);

  const loadInitialData = async () => {
    try {
      const [classesRes, matieresRes, semestresRes] = await Promise.all([
        api.get('/classes'),
        api.get('/matieres'),
        api.get('/semestres')
      ]);
      setClasses(classesRes.data || []);
      setMatieres(matieresRes.data.data || []);
      setSemestres(semestresRes.data.data || []);
    } catch (error) {
      console.error('Erreur chargement:', error);
    }
  };

  const loadStudents = async () => {
    if (!filters.classe_id) return;
    try {
      setLoading(true);
      const response = await api.get(`/eleves?classe_id=${filters.classe_id}`);
      setStudents(response.data.data || []);
    } catch (error) {
      console.error('Erreur chargement élèves:', error);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleNoteChange = (studentId, value) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue < 0 || numValue > 20) {
      if (value !== '' && value !== '.') return;
    }
    setNotes(prev => ({
      ...prev,
      [studentId]: value
    }));
  };

  const handleSave = async () => {
    if (!filters.classe_id || !filters.matiere_id || !filters.semestre_id) {
      alert('Veuillez sélectionner une classe, une matière et un semestre');
      return;
    }

    try {
      setIsSaving(true);
      const notesToSave = Object.entries(notes)
        .filter(([_, value]) => value !== '' && value !== undefined)
        .map(([studentId, valeur]) => ({
          eleve_id: parseInt(studentId),
          matiere_id: parseInt(filters.matiere_id),
          semestre_id: parseInt(filters.semestre_id),
          valeur: parseFloat(valeur),
        }));

      if (notesToSave.length === 0) {
        alert('Aucune note à enregistrer');
        return;
      }

      await api.post('/notes/bulk', { notes: notesToSave });
      alert(`${notesToSave.length} note(s) enregistrée(s) avec succès`);
      setNotes({});
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      alert(error.response?.data?.message || 'Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Calculator className="text-orange-600" size={28} />
          Saisie des Notes
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Enregistrez les notes des élèves par matière et par période
        </p>
      </div>

      {/* Filtres */}
      <div className="bg-white p-4 rounded-lg border border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            <label className="block text-sm font-medium text-slate-700 mb-1">Matière *</label>
            <select
              value={filters.matiere_id}
              onChange={(e) => setFilters({ ...filters, matiere_id: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500/20 outline-none"
            >
              <option value="">Sélectionner...</option>
              {matieres.map(m => (
                <option key={m.id} value={m.id}>{m.nom}</option>
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
              onClick={handleSave}
              disabled={isSaving || !filters.classe_id || !filters.matiere_id || !filters.semestre_id}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={20} />
              {isSaving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </div>
      </div>

      {/* Liste des élèves */}
      {loading ? (
        <div className="text-center py-10">Chargement des élèves...</div>
      ) : students.length > 0 ? (
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Élève</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Note (/20)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-800">
                    {student.prenom || student.firstName} {student.nom || student.lastName}
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="number"
                      min="0"
                      max="20"
                      step="0.01"
                      value={notes[student.id] || ''}
                      onChange={(e) => handleNoteChange(student.id, e.target.value)}
                      placeholder="0.00"
                      className="w-24 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500/20 outline-none"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : filters.classe_id ? (
        <div className="text-center py-10 text-slate-400">
          Aucun élève dans cette classe
        </div>
      ) : (
        <div className="text-center py-10 text-slate-400">
          Sélectionnez une classe pour commencer
        </div>
      )}
    </div>
  );
};

export default NotesEntry;

