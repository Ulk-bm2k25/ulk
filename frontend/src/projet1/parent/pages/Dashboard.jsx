import React from 'react';
import { Users, Bell, CreditCard, ChevronRight } from 'lucide-react';
import '../styles/theme.css';

const Dashboard = () => {
    const stats = [
        { label: 'Enfants inscrits', value: '2', icon: Users, color: 'text-blue-400' },
        { label: 'Notifications', value: '5', icon: Bell, color: 'text-orange-400' },
        { label: 'Paiements dus', value: '120,000 FCFA', icon: CreditCard, color: 'text-red-400' },
    ];

    const children = [
        { name: 'Jean Dupont', class: '6ème A', status: 'Inscrit', image: 'https://i.pravatar.cc/150?u=jean' },
        { name: 'Marie Dupont', class: 'CM2', status: 'Réinscription en cours', image: 'https://i.pravatar.cc/150?u=marie' },
    ];

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold">Bonjour, M. Dupont</h1>
                <p className="text-white/40 mt-1">Voici un résumé de l'activité scolaire de vos enfants.</p>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="glass-card p-6 flex items-center gap-4">
                        <div className={`p-4 rounded-xl bg-white/5 ${stat.color}`}>
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-white/40">{stat.label}</p>
                            <p className="text-2xl font-bold">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Children List */}
                <section className="glass-card p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold">Mes Enfants</h2>
                        <button className="text-sm text-orange-400 font-semibold hover:underline">Voir tout</button>
                    </div>
                    <div className="space-y-4">
                        {children.map((child, index) => (
                            <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                                <div className="flex items-center gap-4">
                                    <img src={child.image} alt={child.name} className="w-12 h-12 rounded-full ring-2 ring-white/10" />
                                    <div>
                                        <h3 className="font-semibold">{child.name}</h3>
                                        <p className="text-xs text-white/40">{child.class} • {child.status}</p>
                                    </div>
                                </div>
                                <ChevronRight size={18} className="text-white/20 group-hover:text-orange-400" />
                            </div>
                        ))}
                    </div>
                </section>

                {/* Recent Notifications */}
                <section className="glass-card p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold">Dernières Notifications</h2>
                        <button className="text-sm text-orange-400 font-semibold hover:underline">Tout marquer comme lu</button>
                    </div>
                    <div className="space-y-4 text-sm">
                        <div className="p-4 rounded-xl border-l-4 border-orange-400 bg-white/5">
                            <p className="font-semibold mb-1">Paiement de la 2ème tranche</p>
                            <p className="text-white/60">Le délai pour le paiement de la 2ème tranche arrive à expiration le 30/12.</p>
                            <p className="text-[10px] text-white/20 mt-2">Il y a 2 heures</p>
                        </div>
                        <div className="p-4 rounded-xl border-l-4 border-blue-400 bg-white/5">
                            <p className="font-semibold mb-1">Note de Mathématiques disponible</p>
                            <p className="text-white/60">Jean a reçu sa note pour l'évaluation de mi-trimestre.</p>
                            <p className="text-[10px] text-white/20 mt-2">Hier à 14:30</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Dashboard;
