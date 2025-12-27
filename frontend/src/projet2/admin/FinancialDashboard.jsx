import React, { useState, useEffect } from 'react';
import { DollarSign, Users, FileText, TrendingUp, Loader2 } from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from 'recharts';
// Import adapté vers le dossier partagé
import StatCard from '../../shared/admin/components/StatCard';

// Couleurs conservées
const COLORS = ['#f97316', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];

const FinancialDashboard = () => {
  const [donnees, setDonnees] = useState(null);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    const chargerStats = async () => {
      try {
        // Tentative de connexion API (Port 8000 comme dans votre code original)
        const reponse = await fetch('http://127.0.0.1:8000/api/reports/financial/data');
        if (!reponse.ok) throw new Error(`HTTP ${reponse.status}`);
        const data = await reponse.json();
        setDonnees(data);
      } catch (e) {
        console.warn("Mode Démo : Erreur API ou Backend non disponible", e);
        // Données de démo (conservées exactement comme l'original)
        setDonnees({
          totalEncaisse: 1250000,
          nbPaiements: 87,
          nbElevesAyantPaye: 45,
          tauxRecouvrement: 87,
          statsParClasse: [
            { classe: '6ème A', total: 320000 },
            { classe: '5ème B', total: 280000 },
            { classe: '4ème C', total: 250000 },
            { classe: '3ème D', total: 400000 }
          ],
          statsParMois: [
            { mois: 9, total: 150000 },
            { mois: 10, total: 300000 },
            { mois: 11, total: 450000 },
            { mois: 12, total: 350000 }
          ],
          statsParEleve: [
            { eleve: 'Martin Dubois', montant: 50000, date: '2025-09-15' },
            { eleve: 'Sophie Moreau', montant: 45000, date: '2025-10-05' },
            { eleve: 'Lucas Bernard', montant: 30000, date: '2025-11-20' }
          ]
        });
      } finally {
        setChargement(false);
      }
    };

    chargerStats();
  }, []);

  if (chargement || !donnees) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-100px)] bg-gray-50">
        <Loader2 size={48} className="animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Statistiques Financières</h1>
        <p className="text-gray-600 mt-2">Aperçu des paiements scolaires - Année 2025-2026</p>
      </div>

      {/* KPI - 4 cartes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <StatCard
          title="Total Encaissé"
          value={`${new Intl.NumberFormat('fr-FR').format(donnees.totalEncaisse)} F`}
          icon={DollarSign}
          color="orange"
        />
        <StatCard
          title="Nombre de Paiements"
          value={donnees.nbPaiements}
          icon={FileText}
          color="blue"
        />
        <StatCard
          title="Élèves Ayant Payé"
          value={donnees.nbElevesAyantPaye}
          icon={Users}
          color="green"
        />
        <StatCard
          title="Taux de Recouvrement"
          value={`${donnees.tauxRecouvrement}%`}
          icon={TrendingUp}
          color="purple"
        />
      </div>

      {/* Graphiques - Un seul graphique en largeur totale */}
      <div className="grid grid-cols-1 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Répartition Mensuelle des Paiements</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donnees.statsParMois}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="total"
                  nameKey="mois"
                >
                  {donnees.statsParMois.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${new Intl.NumberFormat('fr-FR').format(Number(value))} F`} />
                <Legend 
                  formatter={(value) => `Mois ${value}`} 
                  verticalAlign="bottom" 
                  height={40} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tableau des paiements */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Derniers Paiements</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-slate-500 text-xs uppercase border-b border-gray-100">
                <th className="p-3">Élève</th>
                <th className="p-3">Montant (F)</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {donnees.statsParEleve.map((item, index) => (
                <tr key={index} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 font-medium text-slate-700">{item.eleve}</td>
                  <td className="p-3 font-mono text-green-600 font-bold">{new Intl.NumberFormat('fr-FR').format(item.montant)} F</td>
                  <td className="p-3 text-slate-500">{item.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FinancialDashboard;