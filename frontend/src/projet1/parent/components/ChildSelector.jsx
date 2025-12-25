import React from 'react';
import { ChevronDown, Users } from 'lucide-react';

const ChildSelector = ({ children, selectedChildId, onSelect }) => {
    const selectedChild = children.find(c => c.id === selectedChildId);

    if (children.length <= 1) return null;

    return (
        <div className="relative group">
            <button className="flex items-center gap-3 px-4 py-2.5 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all text-white min-w-[220px]">
                <div className="w-8 h-8 rounded-full bg-[#eb8e3a]/20 flex items-center justify-center overflow-hidden ring-1 ring-[#eb8e3a]/40">
                    <img
                        src={selectedChild?.photo || 'https://i.pravatar.cc/150?u=default'}
                        alt={selectedChild?.name}
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="flex-1 text-left">
                    <div className="text-[11px] text-white/40 font-medium uppercase tracking-wider leading-none mb-1">
                        Élève sélectionné
                    </div>
                    <div className="text-[14px] font-bold truncate">
                        {selectedChild?.name || 'Sélectionner...'}
                    </div>
                </div>
                <ChevronDown size={18} className="text-white/40 group-hover:text-white transition-colors" />
            </button>

            {/* Dropdown Menu */}
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a2035] border border-white/10 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden py-2 backdrop-blur-xl">
                {children.map((child) => (
                    <button
                        key={child.id}
                        onClick={() => onSelect(child.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left ${child.id === selectedChildId ? 'bg-[#eb8e3a]/10' : ''
                            }`}
                    >
                        <img
                            src={child.photo}
                            alt={child.name}
                            className="w-10 h-10 rounded-full border border-white/10"
                        />
                        <div>
                            <div className={`text-sm font-bold ${child.id === selectedChildId ? 'text-[#eb8e3a]' : 'text-white'
                                }`}>
                                {child.name}
                            </div>
                            <div className="text-[11px] text-white/40">{child.grade}</div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ChildSelector;
