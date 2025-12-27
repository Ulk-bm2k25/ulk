import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, BookOpen } from 'lucide-react';
import api from '../../../api';

const NotesStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    classe_id: '',
    semestre_id: '',
  });

  useEffect(() => {
    if (filters.classe_id && filters.semestre_id) {
      loadStats();
    }
  }, [filters]);

  const loadStats = async () => {
    try {
      setLoading(true);
      // TODO: await api.get('/notes/stats', { params: filters });
      
      // Mock data
      setStats({
        moyenne_generale: 13.5,
        nombre_eleves: 45,
        nombre_matieres: 8,
        taux_reussite: 78.5,
        meilleure_matiere: 'Mathématiques',
        pire_matiere: 'Français',
        distribution: [
          { range: '0-10', count: 5 },
          { range: '10-12', count: 10 },
          { range: '12-14', count: 15 },
          { range: '14-16', count: 10 },
          { range: '16-20', count: 5 },
        ],
      });
    } catch (error) {
      console.error('Erreur chargement stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-10 text-center">Chargement des statistiques...</div>;
  }

  if (!stats) {
    return (
      <div className="p-8">
        <div className="text-center py-10 text-slate-400">
          Sélectionnez une classe et un semestre pour voir les statistiques
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <BarChart3 className="text-orange-600" size={28} />
          Statistiques des Notes
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Analysez les performances académiques par classe et par période
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-600">Moyenne générale</span>
            <TrendingUp className="text-green-600" size={24} />
          </div>
          <div className="text-3xl font-bold text-slate-800">{stats.moyenne_generale.toFixed(2)}</div>
          <div className="text-sm text-slate-500 mt-1">/20</div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-600">Nombre d'élèves</span>
            <Users className="text-blue-600" size={24} />
          </div>
          <div className="text-3xl font-bold text-slate-800">{stats.nombre_eleves}</div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-600">Taux de réussite</span>
            <BarChart3 className="text-orange-600" size={24} />
          </div>
          <div className="text-3xl font-bold text-slate-800">{stats.taux_reussite}%</div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-600">Matières</span>
            <BookOpen className="text-purple-600" size={24} />
          </div>
          <div className="text-3xl font-bold text-slate-800">{stats.nombre_matieres}</div>
        </div>
      </div>

      {/* Distribution */}
      <div className="bg-white p-6 rounded-lg border border-slate-200">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Distribution des moyennes</h2>
        <div className="space-y-3">
          {stats.distribution.map((item) => (
            <div key={item.range} className="flex items-center gap-4">
              <div className="w-20 text-sm text-slate-600">{item.range}</div>
              <div className="flex-1 bg-slate-100 rounded-full h-6 overflow-hidden">
                <div
                  className="bg-orange-600 h-full rounded-full flex items-center justify-end pr-2"
                  style={{ width: `${(item.count / stats.nombre_eleves) * 100}%` }}
                >
                  <span className="text-xs font-semibold text-white">{item.count}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotesStats;

