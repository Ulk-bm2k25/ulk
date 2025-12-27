import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Clock, Filter } from 'lucide-react';
import api from '../../../api';

const NotesValidation = () => {
  const [notesToValidate, setNotesToValidate] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    classe_id: '',
    semestre_id: '',
  });

  useEffect(() => {
    loadNotes();
  }, [filters]);

  const loadNotes = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.classe_id) params.append('classe_id', filters.classe_id);
      if (filters.semestre_id) params.append('semestre_id', filters.semestre_id);
      
      const response = await api.get(`/notes?${params.toString()}`);
      const allNotes = response.data.data || [];
      
      // Filtrer les notes en attente de validation
      setNotesToValidate(allNotes
        .filter(note => note.statut === 'pending')
        .map(note => ({
          id: note.id,
          eleve: note.eleve || { nom: '', prenom: '' },
          matiere: note.matiere || { nom: '' },
          semestre: note.semestre || { nom: '' },
          valeur: note.valeur,
          statut: note.statut,
          date_note: note.date_note,
        }))
      );
    } catch (error) {
      console.error('Erreur chargement:', error);
      setNotesToValidate([]);
    } finally {
      setLoading(false);
    }
  };

  const handleValidate = async (noteId, approved) => {
    try {
      await api.put(`/notes/${noteId}`, { 
        statut: approved ? 'approved' : 'rejected' 
      });
      setNotesToValidate(prev => prev.filter(n => n.id !== noteId));
      loadNotes(); // Recharger les notes
    } catch (error) {
      console.error('Erreur validation:', error);
      alert(error.response?.data?.message || 'Erreur lors de la validation');
    }
  };

  const pendingNotes = notesToValidate.filter(n => n.statut === 'pending');

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <CheckCircle2 className="text-orange-600" size={28} />
          Validation des Notes
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Validez ou rejetez les notes saisies avant leur publication
        </p>
      </div>

      {/* Filtres */}
      <div className="bg-white p-4 rounded-lg border border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Classe</label>
            <select
              value={filters.classe_id}
              onChange={(e) => setFilters({ ...filters, classe_id: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500/20 outline-none"
            >
              <option value="">Toutes les classes</option>
              {/* Options classes */}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Semestre</label>
            <select
              value={filters.semestre_id}
              onChange={(e) => setFilters({ ...filters, semestre_id: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500/20 outline-none"
            >
              <option value="">Tous les semestres</option>
              {/* Options semestres */}
            </select>
          </div>
        </div>
      </div>

      {/* Liste des notes */}
      {loading ? (
        <div className="text-center py-10">Chargement...</div>
      ) : pendingNotes.length > 0 ? (
        <div className="space-y-4">
          {pendingNotes.map((note) => (
            <div key={note.id} className="bg-white p-6 rounded-lg border border-slate-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <h3 className="font-bold text-slate-800 text-lg">
                      {note.eleve.prenom} {note.eleve.nom}
                    </h3>
                    <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">
                      {note.matiere.nom}
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                      {note.semestre.nom}
                    </span>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-slate-600">
                    <span>Note: <strong className="text-slate-800">{note.valeur}/20</strong></span>
                    <span>Date: {new Date(note.date_note).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleValidate(note.id, true)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
                  >
                    <CheckCircle2 size={18} />
                    Valider
                  </button>
                  <button
                    onClick={() => handleValidate(note.id, false)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
                  >
                    <XCircle size={18} />
                    Rejeter
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-slate-400 bg-white rounded-lg border border-slate-200">
          <CheckCircle2 size={48} className="mx-auto mb-2 opacity-50" />
          <p>Aucune note en attente de validation</p>
        </div>
      )}
    </div>
  );
};

export default NotesValidation;

