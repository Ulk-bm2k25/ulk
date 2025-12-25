import React, { useState, useEffect } from 'react';
import {
  School, Plus, Search, Filter, Users, MoreHorizontal,
  Loader2, GraduationCap, ArrowRight, TrendingUp, AlertCircle
} from 'lucide-react';
import ClassCard from './components/ClassCard';
import ClassFormModal from './ClassFormModal';

const ClassesList = ({ onViewDetails, onManageAffectations, onAddClass }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');

  // Simulation chargement API
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // --- MAPPING BASE DE DONNÉES ---
  const mockClasses = [];

  // Logique de filtrage
  const filteredClasses = mockClasses.filter(cls => {
    const matchesSearch = cls.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = selectedLevel === 'all' || cls.level === selectedLevel;
    return matchesSearch && matchesLevel;
  });

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-150px)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <Loader2 size={40} className="animate-spin text-brand-primary" />
          <p className="text-sm font-medium">Chargement des classes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">

      {/* 1. Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <School className="text-brand-primary" size={28} />
            Gestion des Classes
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Gérez les affectations, les professeurs principaux et les capacités.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onManageAffectations}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 text-sm font-medium hover:bg-slate-50 shadow-sm"
          >
            <Users size={18} />
            Gérer Affectations
          </button>
          <button
            onClick={onAddClass}
            className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg text-sm font-bold hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20"
          >
            <Plus size={18} />
            Nouvelle Classe
          </button>
        </div>
      </div>

      {/* 2. Filtres & Recherche */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">

        {/* Onglets Niveaux */}
        <div className="flex bg-slate-100 p-1 rounded-lg w-full md:w-auto overflow-x-auto">
          {['all', 'Maternelle', 'Primaire', 'Collège', 'Lycée'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedLevel(lvl)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${selectedLevel === lvl
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
                }`}
            >
              {lvl === 'all' ? 'Tous les niveaux' : lvl}
            </button>
          ))}
        </div>

        {/* Barre de recherche */}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Rechercher une classe..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary text-slate-800 placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* 3. Grille des Classes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredClasses.map((cls) => (
          <ClassCard
            key={cls.id}
            data={cls}
            onClick={() => onViewDetails && onViewDetails(cls)}
          />
        ))}
      </div>
    </div>
  );
};

export default ClassesList;