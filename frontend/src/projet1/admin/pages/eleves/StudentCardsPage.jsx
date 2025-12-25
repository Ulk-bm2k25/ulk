import React, { useState } from 'react';
import {
    IdCard, Search, Download, Printer, Filter,
    User, CheckCircle, Smartphone, MapPin, Calendar,
    CreditCard, ExternalLink, Loader2
} from 'lucide-react';

const StudentCardsPage = ({ students = [] }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLevel, setSelectedLevel] = useState('all');
    const [generatingId, setGeneratingId] = useState(null);

    const handleGenerate = (id) => {
        setGeneratingId(id);
        setTimeout(() => {
            setGeneratingId(null);
            alert("Carte scolaire générée avec succès !");
        }, 1500);
    };

    const filteredStudents = students.filter(s => {
        const fullName = (s.firstName + ' ' + s.lastName).toLowerCase();
        const matchesSearch = fullName.includes(searchTerm.toLowerCase()) || s.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesLevel = selectedLevel === 'all' || s.level === selectedLevel;
        return matchesSearch && matchesLevel;
    });

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <IdCard className="text-brand-primary" size={28} />
                        Génération des Cartes Scolaires
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Générez et imprimez les cartes d'identité scolaires pour les élèves validés.
                    </p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white font-bold rounded-lg hover:bg-orange-600 shadow-lg shadow-orange-500/20 transition-all">
                    <Printer size={18} />
                    Impression groupée
                </button>
            </div>

            {/* Filtres */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Rechercher un élève par nom ou matricule..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 text-slate-800"
                    />
                </div>
                <div className="flex bg-slate-100 p-1 rounded-lg">
                    {['all', 'Primaire', 'Collège', 'Lycée'].map(lvl => (
                        <button
                            key={lvl}
                            onClick={() => setSelectedLevel(lvl)}
                            className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${selectedLevel === lvl ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            {lvl === 'all' ? 'Tous' : lvl}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grille de prévisualisation */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {filteredStudents.map((student) => (
                    <div key={student.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow">

                        {/* Prévisualisation de la carte (Design premium) */}
                        <div className="relative w-full md:w-[320px] h-[200px] rounded-xl overflow-hidden bg-gradient-to-br from-brand-dark to-slate-800 text-white shadow-xl flex flex-col shrink-0">
                            {/* Fond stylisé */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/10 rounded-full -ml-12 -mb-12 blur-xl"></div>

                            {/* Header Carte */}
                            <div className="p-3 border-b border-white/10 flex justify-between items-center bg-white/5 backdrop-blur-sm">
                                <div className="text-[10px] font-black tracking-tighter uppercase italic">SchoolHub Academy</div>
                                <div className="text-[8px] opacity-70">2025-2026</div>
                            </div>

                            {/* Corps Carte */}
                            <div className="flex-1 p-4 flex gap-4">
                                <div className="w-20 h-24 bg-slate-700 rounded-lg border border-white/20 flex items-center justify-center overflow-hidden shrink-0">
                                    <User size={40} className="text-white/20" />
                                </div>
                                <div className="space-y-2 flex-1 min-w-0">
                                    <div>
                                        <div className="text-[8px] uppercase tracking-widest text-brand-primary font-bold">Nom & Prénoms</div>
                                        <div className="text-sm font-bold truncate leading-tight uppercase">{student.lastName}</div>
                                        <div className="text-xs font-semibold truncate leading-tight text-white/90 uppercase">{student.firstName}</div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <div className="text-[7px] uppercase text-white/50">Classe</div>
                                            <div className="text-xs font-bold">{student.class}</div>
                                        </div>
                                        <div>
                                            <div className="text-[7px] uppercase text-white/50">Matricule</div>
                                            <div className="text-xs font-bold">{student.id}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Carte */}
                            <div className="p-2 bg-brand-primary flex justify-between items-center px-4">
                                <div className="text-[10px] font-bold">CARTE SCOLAIRE</div>
                                <div className="flex gap-1">
                                    <div className="w-1 h-3 bg-white/20 rounded-full"></div>
                                    <div className="w-1 h-3 bg-white/20 rounded-full"></div>
                                </div>
                            </div>
                        </div>

                        {/* Actions & Details */}
                        <div className="flex-1 flex flex-col justify-between py-2">
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                                        {student.lastName} {student.firstName}
                                        <div className="p-1 bg-green-100 text-green-600 rounded-full">
                                            <CheckCircle size={14} />
                                        </div>
                                    </h3>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                                            <Calendar size={10} /> Né le {student.birthDate}
                                        </span>
                                        <span className="px-2 py-0.5 bg-blue-50 rounded text-[10px] font-bold text-blue-600 uppercase flex items-center gap-1">
                                            <MapPin size={10} /> {student.level}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-500 space-y-1">
                                    <div className="flex justify-between">
                                        <span>Status Inscription:</span>
                                        <span className="font-bold text-green-600 uppercase">Dossier Validé</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Dernière mise à jour:</span>
                                        <span>24 Déc 2025</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2 mt-4 md:mt-0">
                                <button
                                    onClick={() => handleGenerate(student.id)}
                                    disabled={generatingId === student.id}
                                    className="flex-1 h-10 bg-brand-primary text-white text-xs font-bold rounded-lg hover:bg-orange-600 transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                                >
                                    {generatingId === student.id ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" />
                                            Génération...
                                        </>
                                    ) : (
                                        <>
                                            <CreditCard size={16} />
                                            Générer PDF
                                        </>
                                    )}
                                </button>
                                <button className="w-10 h-10 border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all flex items-center justify-center">
                                    <ExternalLink size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StudentCardsPage;
