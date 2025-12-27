import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, BookOpen, Hash, Search } from 'lucide-react';
import api from '../../../api';

const MatieresManager = () => {
  const [matieres, setMatieres] = useState([]);
  const [classes, setClasses] = useState([]);
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMatiere, setEditingMatiere] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    nom: '',
    code: '',
    coefficient: 1,
    classe_id: '',
    serie_id: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [matieresRes, classesRes] = await Promise.all([
        api.get('/matieres'),
        api.get('/classes')
      ]);
      
      setMatieres(matieresRes.data.data || []);
      setClasses(classesRes.data || []);
      
      // TODO: Ajouter endpoint pour les séries si nécessaire
      setSeries([]);
    } catch (error) {
      console.error('Erreur chargement données:', error);
      // Fallback sur mock data en cas d'erreur
      setMatieres([]);
      setClasses([]);
      setSeries([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingMatiere) {
        const response = await api.put(`/matieres/${editingMatiere.id}`, formData);
        setMatieres(prev => prev.map(m => m.id === editingMatiere.id ? response.data.data : m));
      } else {
        const response = await api.post('/matieres', formData);
        setMatieres(prev => [...prev, response.data.data]);
      }
      setShowModal(false);
      resetForm();
      loadData(); // Recharger les données
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      alert(error.response?.data?.message || 'Erreur lors de la sauvegarde');
    }
  };

  const handleEdit = (matiere) => {
    setEditingMatiere(matiere);
    setFormData({
      nom: matiere.nom,
      code: matiere.code || '',
      coefficient: matiere.coefficient,
      classe_id: matiere.classe_id || '',
      serie_id: matiere.serie_id || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette matière ?')) return;
    try {
      await api.delete(`/matieres/${id}`);
      setMatieres(prev => prev.filter(m => m.id !== id));
    } catch (error) {
      console.error('Erreur suppression:', error);
      alert(error.response?.data?.message || 'Erreur lors de la suppression');
    }
  };

  const resetForm = () => {
    setFormData({
      nom: '',
      code: '',
      coefficient: 1,
      classe_id: '',
      serie_id: '',
    });
    setEditingMatiere(null);
  };

  const filteredMatieres = matieres.filter(m =>
    m.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (m.code && m.code.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return <div className="p-10 text-center">Chargement...</div>;
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <BookOpen className="text-orange-600" size={28} />
            Gestion des Matières
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Gérez les matières, leurs coefficients par classe et par série
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
          Ajouter une matière
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg border border-slate-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Rechercher une matière..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500/20 outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Matière</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Code</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Classe</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Série</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Coefficient</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredMatieres.map((matiere) => (
              <tr key={matiere.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-800">{matiere.nom}</td>
                <td className="px-6 py-4 text-slate-600">{matiere.code || '-'}</td>
                <td className="px-6 py-4 text-slate-600">
                  {classes.find(c => c.id === matiere.classe_id)?.name || '-'}
                </td>
                <td className="px-6 py-4 text-slate-600">
                  {series.find(s => s.id === matiere.serie_id)?.nom || '-'}
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold">
                    <Hash size={14} />
                    {matiere.coefficient}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleEdit(matiere)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      title="Modifier"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(matiere.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                      title="Supprimer"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-slate-800 mb-4">
              {editingMatiere ? 'Modifier la matière' : 'Nouvelle matière'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nom de la matière *</label>
                <input
                  type="text"
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500/20 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Code</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500/20 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Classe</label>
                  <select
                    value={formData.classe_id}
                    onChange={(e) => setFormData({ ...formData, classe_id: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500/20 outline-none"
                  >
                    <option value="">Toutes les classes</option>
                    {classes.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Série</label>
                  <select
                    value={formData.serie_id}
                    onChange={(e) => setFormData({ ...formData, serie_id: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500/20 outline-none"
                  >
                    <option value="">Toutes les séries</option>
                    {series.map(s => (
                      <option key={s.id} value={s.id}>{s.nom}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Coefficient *</label>
                <input
                  type="number"
                  min="1"
                  value={formData.coefficient}
                  onChange={(e) => setFormData({ ...formData, coefficient: parseInt(e.target.value) || 1 })}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500/20 outline-none"
                />
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
                  {editingMatiere ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatieresManager;

