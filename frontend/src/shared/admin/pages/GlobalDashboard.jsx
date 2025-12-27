import React from 'react';
import { Users, DollarSign, BookOpen, AlertTriangle } from 'lucide-react';
// Vous pourrez importer ici les StatCard et graphiques des autres projets plus tard

const GlobalDashboard = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Tableau de bord Général</h1>
        <p className="text-slate-500">Bienvenue sur SchoolHub. Voici ce qui se passe aujourd'hui.</p>
      </div>

      {/* Widgets Résumés (Agrégation des projets 1, 2, 3, 4) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Projet 1 */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-slate-500">Total Élèves</p>
                    <h3 className="text-2xl font-bold text-slate-800 mt-1">1,248</h3>
                </div>
                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Users size={20} /></div>
            </div>
        </div>

        {/* Projet 2 */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-slate-500">Encaissements (Mois)</p>
                    <h3 className="text-2xl font-bold text-slate-800 mt-1">4.2M <span className="text-xs text-slate-400 font-normal">FCFA</span></h3>
                </div>
                <div className="p-3 bg-green-50 text-green-600 rounded-lg"><DollarSign size={20} /></div>
            </div>
        </div>

        {/* Projet 4 */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-slate-500">Absences du jour</p>
                    <h3 className="text-2xl font-bold text-slate-800 mt-1">12</h3>
                </div>
                <div className="p-3 bg-orange-50 text-orange-600 rounded-lg"><AlertTriangle size={20} /></div>
            </div>
        </div>

        {/* Projet 3 */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-slate-500">Moyenne École</p>
                    <h3 className="text-2xl font-bold text-slate-800 mt-1">12.4<span className="text-sm text-slate-400">/20</span></h3>
                </div>
                <div className="p-3 bg-purple-50 text-purple-600 rounded-lg"><BookOpen size={20} /></div>
            </div>
        </div>

      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-8 text-center">
        <h3 className="text-lg font-bold text-blue-800">Architecture Modulaire Active</h3>
        <p className="text-blue-600 mt-2">Utilisez le menu latéral pour naviguer entre les modules Scolarité, Finance, Pédagogie et Vie Scolaire.</p>
      </div>
    </div>
  );
};

export default GlobalDashboard;