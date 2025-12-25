import { useState, useEffect } from 'react';
import { Users, TrendingUp, TrendingDown, Award, AlertCircle, Calendar, BookOpen, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import StatCard from '../components/StatCard';
import { statsApi } from '../services/api';
import type { StatsResponse } from '../types';

const COLORS = ['#48BB78', '#F56565', '#ED8936'];

const Reports = () => {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Configuration (à adapter selon vos besoins)
  const classeId = 1;
  const periode = 'TRIMESTRE_1';
  const anneeScolaire = '2024-2025';

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await statsApi.getStats(classeId, periode, anneeScolaire);
        setStats(data);
      } catch (err) {
        console.error('Erreur chargement stats:', err);
        setError('Impossible de charger les statistiques. Vérifiez que le serveur Laravel est lancé.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 font-medium">Chargement des statistiques...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-red-600 flex-shrink-0" size={24} />
              <div>
                <h3 className="text-lg font-bold text-red-900 mb-2">Erreur de connexion</h3>
                <p className="text-red-700">{error}</p>
                <div className="mt-4 p-3 bg-red-100 rounded text-sm text-red-800">
                  <strong>Vérifications :</strong>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Le serveur Laravel tourne-t-il ? (<code>php artisan serve</code>)</li>
                    <li>L'URL de l'API est-elle correcte ? (http://localhost:8000)</li>
                    <li>Les données de test sont-elles créées ? (<code>php artisan db:seed</code>)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  // Préparation données graphiques
  const matiereData = stats.academiques.stats_par_matiere;
  
  const repartitionData = [
    { name: 'Admis (≥10)', value: stats.repartition.admis },
    { name: 'En difficulté (<10)', value: stats.repartition.en_difficulte },
  ];

  const progressionData = stats.progression ? [
    { name: 'Progression', value: stats.progression.en_progression, fill: '#48BB78' },
    { name: 'Régression', value: stats.progression.en_regression, fill: '#F56565' },
    { name: 'Stables', value: stats.progression.stables, fill: '#ED8936' },
  ] : [];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* En-tête */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-xl shadow-lg p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">📊 Statistiques de la Classe</h1>
          <p className="text-slate-200">Trimestre 1 • Année scolaire 2024-2025</p>
        </div>

        {/* 1. Vue d'ensemble */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <div className="w-1 h-6 bg-orange-500 rounded"></div>
            Vue d'ensemble
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Effectif Total"
              value={stats.generales.effectif_total}
              icon={Users}
              color="blue"
              description={`${stats.generales.nombre_garcons} garçons • ${stats.generales.nombre_filles} filles`}
            />
            <StatCard
              title="Âge Moyen"
              value={`${stats.generales.age_moyen} ans`}
              icon={Calendar}
              color="purple"
            />
            <StatCard
              title="Moyenne Classe"
              value={`${stats.academiques.moyenne_classe}/20`}
              icon={Award}
              color="green"
            />
            <StatCard
              title="Taux de Présence"
              value={`${stats.generales.taux_presence_global}%`}
              icon={BookOpen}
              color="orange"
            />
          </div>
        </div>

        {/* 2. Résultats Scolaires */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <div className="w-1 h-6 bg-orange-500 rounded"></div>
            Résultats Scolaires
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 border-2 border-green-200">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="text-green-600" size={24} />
                <span className="text-sm font-semibold text-green-700 uppercase">Plus Forte</span>
              </div>
              <p className="text-3xl font-bold text-green-700">{stats.academiques.plus_forte_moyenne}/20</p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border-2 border-blue-200">
              <div className="flex items-center gap-3 mb-2">
                <Award className="text-blue-600" size={24} />
                <span className="text-sm font-semibold text-blue-700 uppercase">Moyenne Classe</span>
              </div>
              <p className="text-3xl font-bold text-blue-700">{stats.academiques.moyenne_classe}/20</p>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-5 border-2 border-red-200">
              <div className="flex items-center gap-3 mb-2">
                <TrendingDown className="text-red-600" size={24} />
                <span className="text-sm font-semibold text-red-700 uppercase">Plus Faible</span>
              </div>
              <p className="text-3xl font-bold text-red-700">{stats.academiques.plus_faible_moyenne}/20</p>
            </div>
          </div>

          {/* Graphique par matière */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Moyennes par Matière</h3>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={matiereData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="matiere" tick={{ fill: '#6b7280' }} />
                <YAxis domain={[0, 20]} tick={{ fill: '#6b7280' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                />
                <Legend />
                <Bar dataKey="moyenne" fill="#F6AD55" name="Moyenne" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Répartition & Progression */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Répartition */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <div className="w-1 h-6 bg-orange-500 rounded"></div>
              Répartition
            </h2>
            
            <div className="text-center mb-6 p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
              <p className="text-5xl font-bold text-green-600 mb-2">{stats.repartition.taux_reussite}%</p>
              <p className="text-sm font-medium text-green-700 uppercase tracking-wide">Taux de Réussite</p>
            </div>

            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={repartitionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={90}
                  dataKey="value"
                >
                  {repartitionData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Progression */}
          {stats.progression && (
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <div className="w-1 h-6 bg-orange-500 rounded"></div>
                Évolution vs Période Précédente
              </h2>
              
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={progressionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" tick={{ fill: '#6b7280' }} />
                  <YAxis tick={{ fill: '#6b7280' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* 4. Discipline */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <div className="w-1 h-6 bg-orange-500 rounded"></div>
            Discipline & Assiduité
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-4 p-5 bg-gradient-to-br from-red-50 to-red-100 rounded-xl border-2 border-red-200">
              <AlertCircle className="text-red-600 flex-shrink-0" size={36} />
              <div>
                <p className="text-sm text-red-700 font-semibold uppercase">Absences non justifiées</p>
                <p className="text-3xl font-bold text-red-600">{stats.discipline.absences_non_justifiees}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-5 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border-2 border-orange-200">
              <Clock className="text-orange-600 flex-shrink-0" size={36} />
              <div>
                <p className="text-sm text-orange-700 font-semibold uppercase">Retards</p>
                <p className="text-3xl font-bold text-orange-600">{stats.discipline.retards}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border-2 border-blue-200">
              <TrendingDown className="text-blue-600 flex-shrink-0" size={36} />
              <div>
                <p className="text-sm text-blue-700 font-semibold uppercase">Taux d'absentéisme</p>
                <p className="text-3xl font-bold text-blue-600">{stats.discipline.taux_absenteisme}%</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Reports;