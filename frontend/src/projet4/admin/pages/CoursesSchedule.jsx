import React, { useState, useEffect } from 'react';
import { Clock, Plus, Edit2, Trash2, Calendar, Search } from 'lucide-react';
import api from '../../../api';

const CoursesSchedule = () => {
  const [classes, setClasses] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);

  const [formData, setFormData] = useState({
    jour: '',
    heure_debut: '',
    heure_fin: '',
    matiere: '',
    enseignant: '',
  });

  const jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

  useEffect(() => {
    loadClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      loadSchedule();
    }
  }, [selectedClass]);

  const loadClasses = async () => {
    try {
      const response = await api.get('/classes');
      setClasses(response.data || []);
    } catch (error) {
      console.error('Erreur chargement classes:', error);
      setClasses([]);
    }
  };

  const loadSchedule = async () => {
    if (!selectedClass) return;
    try {
      setLoading(true);
      const response = await api.get(`/cours/schedule/${selectedClass}`);
      setSchedules(response.data.data || []);
    } catch (error) {
      console.error('Erreur chargement programme:', error);
      setSchedules([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSchedule) {
        const response = await api.put(`/cours/schedule/${editingSchedule.id}`, formData);
        setSchedules(prev => prev.map(s => s.id === editingSchedule.id ? response.data.data : s));
      } else {
        const response = await api.post(`/cours/schedule`, { ...formData, classe_id: selectedClass });
        setSchedules(prev => [...prev, response.data.data]);
      }
      setShowModal(false);
      resetForm();
      loadSchedule();
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      alert(error.response?.data?.message || 'Erreur lors de la sauvegarde');
    }
  };

  const handleEdit = (schedule) => {
    setEditingSchedule(schedule);
    setFormData({
      jour: schedule.jour,
      heure_debut: schedule.heure_debut,
      heure_fin: schedule.heure_fin,
      matiere: schedule.matiere,
      enseignant: schedule.enseignant,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce cours ?')) return;
    try {
      await api.delete(`/cours/schedule/${id}`);
      setSchedules(prev => prev.filter(s => s.id !== id));
    } catch (error) {
      console.error('Erreur suppression:', error);
      alert(error.response?.data?.message || 'Erreur lors de la suppression');
    }
  };

  const resetForm = () => {
    setFormData({
      jour: '',
      heure_debut: '',
      heure_fin: '',
      matiere: '',
      enseignant: '',
    });
    setEditingSchedule(null);
  };

  const groupedSchedules = schedules.reduce((acc, schedule) => {
    if (!acc[schedule.jour]) acc[schedule.jour] = [];
    acc[schedule.jour].push(schedule);
    return acc;
  }, {});

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Clock className="text-orange-600" size={28} />
            Programme des Cours
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Gérez les horaires et programmes de cours par classe
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          disabled={!selectedClass}
          className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-semibold disabled:opacity-50"
        >
          <Plus size={20} />
          Ajouter un cours
        </button>
      </div>

      {/* Sélection classe */}
      <div className="bg-white p-4 rounded-lg border border-slate-200">
        <label className="block text-sm font-medium text-slate-700 mb-2">Classe</label>
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="w-full md:w-64 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500/20 outline-none"
        >
          <option value="">Sélectionner une classe...</option>
          {classes.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Programme */}
      {loading ? (
        <div className="text-center py-10">Chargement...</div>
      ) : selectedClass ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jours.map((jour) => (
            <div key={jour} className="bg-white rounded-lg border border-slate-200 overflow-hidden">
              <div className="bg-orange-50 p-3 border-b border-slate-200">
                <h3 className="font-bold text-slate-800">{jour}</h3>
              </div>
              <div className="p-3 space-y-2">
                {(groupedSchedules[jour] || []).map((schedule) => (
                  <div key={schedule.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-semibold text-slate-800 text-sm">{schedule.matiere}</p>
                        <p className="text-xs text-slate-500">{schedule.enseignant}</p>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleEdit(schedule)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(schedule.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600">
                      {schedule.heure_debut} - {schedule.heure_fin}
                    </p>
                  </div>
                ))}
                {(!groupedSchedules[jour] || groupedSchedules[jour].length === 0) && (
                  <p className="text-xs text-slate-400 text-center py-2">Aucun cours</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-slate-400 bg-white rounded-lg border border-slate-200">
          Sélectionnez une classe pour voir son programme
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-slate-800 mb-4">
              {editingSchedule ? 'Modifier le cours' : 'Nouveau cours'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Jour *</label>
                <select
                  value={formData.jour}
                  onChange={(e) => setFormData({ ...formData, jour: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500/20 outline-none"
                >
                  <option value="">Sélectionner...</option>
                  {jours.map(j => (
                    <option key={j} value={j}>{j}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Heure début *</label>
                  <input
                    type="time"
                    value={formData.heure_debut}
                    onChange={(e) => setFormData({ ...formData, heure_debut: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500/20 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Heure fin *</label>
                  <input
                    type="time"
                    value={formData.heure_fin}
                    onChange={(e) => setFormData({ ...formData, heure_fin: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500/20 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Matière *</label>
                <input
                  type="text"
                  value={formData.matiere}
                  onChange={(e) => setFormData({ ...formData, matiere: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500/20 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Enseignant</label>
                <input
                  type="text"
                  value={formData.enseignant}
                  onChange={(e) => setFormData({ ...formData, enseignant: e.target.value })}
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
                  {editingSchedule ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursesSchedule;

