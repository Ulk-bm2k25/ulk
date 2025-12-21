import React from 'react';
import { Construction } from 'lucide-react';

const PlaceholderPage = ({ title, icon: Icon }) => (
  <div className="h-[calc(100vh-8rem)] flex flex-col">
    <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
    </div>

    <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-8 text-center animate-in fade-in duration-500">
      <div className="bg-white p-6 rounded-full shadow-sm mb-6">
        {Icon ? (
            <Icon size={48} className="text-brand-primary opacity-80" />
        ) : (
            <Construction size={48} className="text-slate-400" />
        )}
      </div>
      
      <h2 className="text-xl font-bold text-slate-700 mb-2">
        Module en construction
      </h2>
      
      <p className="text-slate-500 max-w-md mx-auto mb-6">
        La fonctionnalité <strong>{title}</strong> fait partie du périmètre futur. 
        Le développement se concentre actuellement sur le Tableau de Bord.
      </p>

      <div className="inline-flex items-center px-4 py-2 bg-slate-200 text-slate-600 rounded-lg text-sm font-medium">
        Statut : En attente
      </div>
    </div>
  </div>
);

export default PlaceholderPage;