import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Calendar, Search } from 'lucide-react';
import api from '../../../api';

const SemestresManager = () => {
  const [semestres, setSemestres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSemestre, setEditingSemestre] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    nom: '',
    date_debut: '',
    date_fin: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/semestres');
      setSemestres(res.data.data || []);
    } catch (error) {
      console.error('Erreur chargement:', error);
      setSemestres([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSemestre) {
        const response = await api.put(`/semestres/${editingSemestre.id}`, formData);
        setSemestres(prev => prev.map(s => s.id === editingSemestre.id ? response.data.data : s));
      } else {
        const response = await api.post('/semestres', formData);
        setSemestres(prev => [...prev, response.data.data]);
      }
      setShowModal(false);
      resetForm();
      loadData();
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      alert(error.response?.data?.message || 'Erreur lors de la sauvegarde');
    }
  };

  const handleEdit = (semestre) => {
    setEditingSemestre(semestre);
    setFormData({
      nom: semestre.nom,
      date_debut: semestre.date_debut,
      date_fin: semestre.date_fin,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce semestre/trimestre ?')) return;
    try {
      await api.delete(`/semestres/${id}`);
      setSemestres(prev => prev.filter(s => s.id !== id));
    } catch (error) {
      console.error('Erreur suppression:', error);
      alert(error.response?.data?.message || 'Erreur lors de la suppression');
    }
  };

  const resetForm = () => {
    setFormData({
      nom: '',
      date_debut: '',
      date_fin: '',
    });
    setEditingSemestre(null);
  };

  const filteredSemestres = semestres.filter(s =>
    s.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="p-10 text-center">Chargement...</div>;
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Calendar className="text-orange-600" size={28} />
            Gestion des Semestres/Trimestres
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Configurez les périodes d'évaluation (semestres ou trimestres)
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-semibold"
        >
          <Plus size={20} />
          Ajouter une période
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg border border-slate-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500/20 outline-none"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Nom</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Date début</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Date fin</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Durée</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredSemestres.map((semestre) => {
              const dateDebut = new Date(semestre.date_debut);
              const dateFin = new Date(semestre.date_fin);
              const duree = Math.ceil((dateFin - dateDebut) / (1000 * 60 * 60 * 24));
              
              return (
                <tr key={semestre.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-800">{semestre.nom}</td>
                  <td className="px-6 py-4 text-slate-600">
                    {dateDebut.toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {dateFin.toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 text-slate-600">{duree} jours</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(semestre)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        title="Modifier"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(semestre.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                        title="Supprimer"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-slate-800 mb-4">
              {editingSemestre ? 'Modifier la période' : 'Nouvelle période'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nom *</label>
                <input
                  type="text"
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  placeholder="Ex: Trimestre 1, Semestre 1..."
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500/20 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Date début *</label>
                  <input
                    type="date"
                    value={formData.date_debut}
                    onChange={(e) => setFormData({ ...formData, date_debut: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500/20 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Date fin *</label>
                  <input
                    type="date"
                    value={formData.date_fin}
                    onChange={(e) => setFormData({ ...formData, date_fin: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500/20 outline-none"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-semibold"
                >
                  {editingSemestre ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SemestresManager;

