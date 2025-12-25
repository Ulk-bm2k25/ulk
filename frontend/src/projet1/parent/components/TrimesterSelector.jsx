import React from 'react';
import { ChevronDown, Calendar } from 'lucide-react';

const TrimesterSelector = ({ trimesters, selectedTrimesterId, onSelect }) => {
    const selectedTrimester = trimesters.find(t => t.id === selectedTrimesterId);

    return (
        <div className="relative group">
            <button className="flex items-center gap-3 px-4 py-2.5 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all text-white min-w-[180px]">
                <div className="w-8 h-8 rounded-xl bg-[#eb8e3a]/20 flex items-center justify-center text-[#eb8e3a]">
                    <Calendar size={18} />
                </div>
                <div className="flex-1 text-left">
                    <div className="text-[11px] text-white/40 font-medium uppercase tracking-wider leading-none mb-1">
                        Période
                    </div>
                    <div className="text-[14px] font-bold truncate">
                        {selectedTrimester?.title || 'Sélectionner...'}
                    </div>
                </div>
                <ChevronDown size={18} className="text-white/40 group-hover:text-white transition-colors" />
            </button>

            {/* Dropdown Menu */}
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a2035] border border-white/10 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden py-2 backdrop-blur-xl">
                {trimesters.map((term) => (
                    <button
                        key={term.id}
                        onClick={() => onSelect(term.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left ${term.id === selectedTrimesterId ? 'bg-[#eb8e3a]/10' : ''
                            }`}
                    >
                        <div>
                            <div className={`text-sm font-bold ${term.id === selectedTrimesterId ? 'text-[#eb8e3a]' : 'text-white'
                                }`}>
                                {term.title}
                            </div>
                            {term.isClosed && (
                                <div className="text-[10px] text-green-500 font-bold uppercase tracking-wider">Clôturé</div>
                            )}
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default TrimesterSelector;
