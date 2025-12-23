import React from 'react';
import { Users, Bell, CreditCard, ChevronRight } from 'lucide-react';
import '../styles/theme.css';

const Dashboard = ({ children, onNavigate }) => {
    const stats = [
        { label: 'Enfants inscrits', value: children.length.toString(), icon: Users, color: 'text-blue-400', bg: 'bg-white/5' },
        { label: 'Notifications', value: '3', icon: Bell, color: 'text-orange-400', bg: 'bg-white/5' },
        { label: 'Paiements dus', value: '120,000 FCFA', icon: CreditCard, color: 'text-red-400', bg: 'bg-white/5' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500 text-white">
            <header>
                <h1 className="text-3xl font-black">Bonjour, M. Dupont</h1>
                <p className="text-white/40 mt-1 font-medium">Voici un résumé de l'activité scolaire de vos enfants.</p>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white/5 border border-white/10 p-6 rounded-[24px] flex items-center gap-4 group hover:bg-white/10 transition-all cursor-default">
                        <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-white/40 font-bold uppercase tracking-wider">{stat.label}</p>
                            <p className="text-2xl font-black">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Children List */}
                <section className="bg-white/5 border border-white/10 p-8 rounded-[32px]">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-black">Mes Enfants</h2>
                        <button onClick={() => onNavigate('children')} className="text-sm text-[#eb8e3a] font-bold hover:underline">Voir tout</button>
                    </div>
                    <div className="space-y-4">
                        {children.map((child, index) => (
                            <div
                                key={index}
                                onClick={() => onNavigate('children')}
                                className="flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer group"
                            >
                                <div className="flex items-center gap-4">
                                    <img src={child.photo} alt={child.name} className="w-14 h-14 rounded-full ring-2 ring-white/10 shadow-sm object-cover" />
                                    <div>
                                        <h3 className="font-bold">{child.name}</h3>
                                        <p className="text-xs text-white/40 font-bold uppercase tracking-tight">{child.grade} • {child.registrationValidated ? 'Inscrit' : 'En attente'}</p>
                                    </div>
                                </div>
                                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 group-hover:bg-[#eb8e3a] group-hover:text-white transition-all">
                                    <ChevronRight size={18} />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Recent Notifications */}
                <section className="bg-white/5 border border-white/10 p-8 rounded-[32px]">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-black">Dernières Notifications</h2>
                        <button onClick={() => onNavigate('notifications')} className="text-sm text-[#eb8e3a] font-bold hover:underline">Tout marquer comme lu</button>
                    </div>
                    <div className="space-y-4 text-sm">
                        <div className="p-5 rounded-2xl border-l-4 border-[#eb8e3a] bg-white/5">
                            <p className="font-bold mb-1">Paiement de la 2ème tranche</p>
                            <p className="text-white/60">Le délai pour le paiement de la 2ème tranche arrive à expiration le 30/12.</p>
                            <p className="text-[11px] text-white/20 font-bold uppercase mt-3">Il y a 2 heures</p>
                        </div>
                        <div className="p-5 rounded-2xl border-l-4 border-blue-400 bg-white/5">
                            <p className="font-bold mb-1">Note de Mathématiques disponible</p>
                            <p className="text-white/60">Jean a reçu sa note pour l'évaluation de mi-trimestre.</p>
                            <p className="text-[11px] text-white/20 font-bold uppercase mt-3">Hier à 14:30</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Dashboard;
