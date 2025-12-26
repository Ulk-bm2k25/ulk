import React, { useEffect, useState } from 'react';
import { Users, Bell, CreditCard, ChevronRight, Loader2 } from 'lucide-react';
import api from '../../../api';
import '../styles/theme.css';

const Dashboard = ({ onNavigate }) => {
    const [stats, setStats] = useState([]);
    const [children, setChildren] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [parentName, setParentName] = useState('Cher Parent');

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Get user info from localStorage
                const user = JSON.parse(localStorage.getItem('user'));
                if (user) setParentName(`${user.prenom} ${user.nom}`);

                const [dashboardRes, childrenRes] = await Promise.all([
                    api.get('/parent/dashboard'),
                    api.get('/parent/children')
                ]);

                setStats([
                    { label: 'Enfants inscrits', value: dashboardRes.data.summary.children_count.toString(), icon: Users, color: 'text-blue-400', bg: 'bg-white/5' },
                    { label: 'Notifications', value: dashboardRes.data.summary.notifications.toString(), icon: Bell, color: 'text-orange-400', bg: 'bg-white/5' },
                    { label: 'Paiements dus', value: `${dashboardRes.data.summary.payments_due} FCFA`, icon: CreditCard, color: 'text-red-400', bg: 'bg-white/5' },
                ]);

                setChildren(childrenRes.data.children || []);
                setIsLoading(false);
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="animate-spin text-[#eb8e3a] mb-4" size={48} />
                <p className="text-white/40">Chargement de votre tableau de bord...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 text-white">
            <header>
                <h1 className="text-3xl font-black">Bonjour, {parentName}</h1>
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
                                    <div className="w-14 h-14 rounded-full ring-2 ring-white/10 flex items-center justify-center bg-white/5 text-xl font-black text-[#eb8e3a]">
                                        {child.user?.prenom?.[0] || '?'}{child.user?.nom?.[0] || '?'}
                                    </div>
                                    <div>
                                        <h3 className="font-bold">{child.user?.prenom} {child.user?.nom}</h3>
                                        <p className="text-xs text-white/40 font-bold uppercase tracking-tight">
                                            {child.classe?.nom || 'Sans classe'} • {child.inscriptions?.[0]?.statut || 'En attente'}
                                        </p>
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
                        <div className="p-8 text-center text-white/20 italic">
                            Aucune notification récente.
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Dashboard;
