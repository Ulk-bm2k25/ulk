import React, { useState } from 'react';
import { MoreHorizontal, Users, AlertCircle, GraduationCap, ArrowRight, Edit, Trash2 } from 'lucide-react';

const ClassCard = ({ data, onClick, onEdit, onDelete }) => {
    const [showMenu, setShowMenu] = useState(false);
    // Calculs visuels
    const percentage = Math.min((data.current_students / data.capacity_max) * 100, 100);

    const getProgressColor = () => {
        if (data.current_students > data.capacity_max) return 'bg-red-500';
        if (percentage >= 85) return 'bg-orange-500';
        return 'bg-green-500';
    };

    return (
        <div
            className="group bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-brand-primary/30 transition-all cursor-pointer overflow-hidden flex flex-col"
            onClick={onClick}
        >
            {/* En-tête Carte */}
            <div className="p-5 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm uppercase">
                        {(data.nom || '???').substring(0, 3)}
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800 text-lg">{data.nom}</h3>
                        <p className="text-xs text-slate-500">{data.niveau_scolaire?.nom || 'Sans niveau'}</p>
                    </div>
                </div>
                <div className="relative">
                    <button
                        className="text-slate-400 hover:text-brand-primary p-1"
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowMenu(!showMenu);
                        }}
                    >
                        <MoreHorizontal size={20} />
                    </button>
                    {showMenu && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-slate-100 z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowMenu(false);
                                    onEdit && onEdit();
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                            >
                                <Edit size={16} className="text-blue-600" />
                                Modifier
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowMenu(false);
                                    onDelete && onDelete();
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                            >
                                <Trash2 size={16} />
                                Supprimer
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Corps Carte (Stats) */}
            <div className="p-5 flex-1 space-y-4">

                {/* Jauge de Remplissage */}
                <div>
                    <div className="flex justify-between items-center mb-1.5">
                        <span className="text-xs font-semibold text-slate-500 uppercase flex items-center gap-1">
                            <Users size={12} /> Effectif
                        </span>
                        <span className={`text-xs font-bold ${data.current_students > data.capacity_max ? 'text-red-600' : 'text-slate-700'}`}>
                            {data.current_students} / {data.capacity_max}
                        </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-500 ${getProgressColor()}`}
                            style={{ width: `${percentage}%` }}
                        ></div>
                    </div>
                    {data.current_students > data.capacity_max && (
                        <div className="mt-1 flex items-center gap-1 text-[10px] text-red-500 font-medium">
                            <AlertCircle size={10} /> Surcharge de {data.current_students - data.capacity_max} élèves
                        </div>
                    )}
                </div>

                {/* Info Titulaire */}
                <div className="flex items-center gap-3 pt-2">
                    <div className="p-2 bg-slate-50 rounded-full text-slate-400">
                        <GraduationCap size={16} />
                    </div>
                    <div>
                        <div className="text-[10px] uppercase text-slate-400 font-bold">Effectif / Capacité</div>
                        <div className="text-sm font-medium text-slate-700">{data.current_students || 0} / {data.capacity_max || 40}</div>
                    </div>
                </div>
            </div>

            {/* Footer Carte */}
            <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/30 flex justify-between items-center group-hover:bg-brand-primary/5 transition-colors">
                <span className="text-xs text-slate-500 font-medium">Voir la liste</span>
                <div className="w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-brand-primary group-hover:border-brand-primary transition-all">
                    <ArrowRight size={12} />
                </div>
            </div>
        </div>
    );
};

export default ClassCard;