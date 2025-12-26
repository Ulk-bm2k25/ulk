import React, { useEffect, useState } from 'react';
import { User, GraduationCap, Calendar, ChevronRight, Download, FileText, UserPlus, Loader2 } from 'lucide-react';
import api from '../../../api';
import '../styles/theme.css';

const MyChildren = ({ onNavigate }) => {
    const [children, setChildren] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchChildren = async () => {
            try {
                const response = await api.get('/parent/children');
                setChildren(response.data.children);
                setIsLoading(false);
            } catch (error) {
                console.error("Failed to fetch children", error);
                setIsLoading(false);
            }
        };
        fetchChildren();
    }, []);

    const handleDownload = (type, childName, event) => {
        const docName = type === 'card' ? 'Carte Scolaire' : 'Fiche d\'inscription';
        const btn = event.currentTarget;
        const originalContent = btn.innerHTML;

        btn.innerHTML = `<span class="inline-block animate-spin mr-2">⏳</span>...`;
        btn.style.opacity = "0.7";
        btn.disabled = true;

        setTimeout(() => {
            btn.innerHTML = originalContent;
            btn.style.opacity = "1";
            btn.disabled = false;
            alert(`Le document "${docName}" pour ${childName} a été généré et téléchargé avec succès.`);
        }, 1500);
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="animate-spin text-[#eb8e3a] mb-4" size={48} />
                <p className="text-white/40">Chargement de vos enfants...</p>
            </div>
        );
    }

    const ActionButton = ({ icon: Icon, label, onClick, primary = false, disabled = false, badge = null }) => (
        <button
            onClick={(e) => {
                e.stopPropagation();
                if (!disabled && onClick) onClick(e);
            }}
            disabled={disabled}
            className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${disabled
                ? 'bg-white/5 text-white/20 border border-white/5 cursor-not-allowed opacity-50'
                : primary
                    ? 'bg-[#eb8e3a] text-white hover:bg-[#d67d2e] shadow-lg shadow-orange-950/20'
                    : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/5'
                }`}
        >
            <Icon size={14} />
            <span>{label}</span>
            {badge && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[8px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-tighter shadow-sm animate-pulse">
                    {badge}
                </span>
            )}
        </button>
    );

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-white">Mes Enfants</h1>
                <p className="text-white/40 mt-1">Gérez et consultez les détails de tous vos enfants inscrits sur SchoolHub.</p>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {children.map((child) => (
                    <div key={child.id} className="bg-white/5 rounded-3xl p-8 border border-white/5 flex flex-col gap-6 group hover:bg-white/10 transition-all cursor-pointer">
                        <div className="flex items-start justify-between">
                            <div className="flex gap-6">
                                <div className="w-20 h-20 rounded-2xl ring-4 ring-white/5 flex items-center justify-center bg-white/5 text-2xl font-black text-[#eb8e3a]">
                                    {child.prenom[0]}{child.nom[0]}
                                </div>
                                <div className="space-y-3">
                                    <h3 className="text-xl font-bold text-white">{child.prenom} {child.nom}</h3>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-white/60 text-sm">
                                            <GraduationCap size={16} />
                                            <span>Classe: {child.inscription?.classe?.nom || 'Non assigné'}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-white/60 text-sm">
                                            <Calendar size={16} />
                                            <span>Inscrit en: {child.inscription?.annee_scolaire?.annee || 'N/A'}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-white/60 text-sm">
                                            <User size={16} />
                                            <span>Statut: {child.inscription?.statut || 'En attente'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-2 rounded-full bg-white/5 text-white/20 group-hover:text-[#eb8e3a] group-hover:bg-[#eb8e3a]/10 transition-all">
                                <ChevronRight size={24} />
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3 pt-4 border-t border-white/5">
                            <ActionButton
                                icon={UserPlus}
                                label="Réinscrire l'enfant"
                                primary
                                onClick={() => onNavigate('registration', { mode: 're-enrollment', childData: child })}
                            />
                            <ActionButton
                                icon={Download}
                                label="Carte Scolaire"
                                disabled={false}
                                onClick={(e) => handleDownload('card', `${child.prenom} ${child.nom}`, e)}
                            />
                            <ActionButton
                                icon={FileText}
                                label="Fiche d'inscription"
                                disabled={child.inscription?.statut !== 'inscrit'}
                                onClick={(e) => handleDownload('doc', `${child.prenom} ${child.nom}`, e)}
                            />
                        </div>
                    </div>
                ))}

                {/* Add Child Placeholder */}
                <div
                    onClick={() => onNavigate('registration', { mode: 'new', childData: null })}
                    className="border-2 border-dashed border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center text-center space-y-6 hover:border-[#eb8e3a]/40 hover:bg-[#eb8e3a]/5 transition-all cursor-pointer group"
                >
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-white/20 group-hover:text-[#eb8e3a] transition-all">
                        <UserPlus size={32} />
                    </div>
                    <div className="space-y-2">
                        <h4 className="font-bold text-white text-lg">Inscrire un enfant</h4>
                        <p className="text-sm text-white/40 max-w-[200px]">Commencez un nouveau processus d'inscription.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyChildren;
