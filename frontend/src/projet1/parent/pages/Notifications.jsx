import React from 'react';
import { Bell, Mail, Info, AlertTriangle, CheckCircle, Smartphone, MessageSquare } from 'lucide-react';
import '../styles/theme.css';

const Notifications = () => {
    const notifications = [
        {
            id: 1,
            type: 'absence',
            title: 'Alerte d\'absence',
            message: 'Jean Dupont a été marqué absent ce matin en cours de Mathématiques sans motif.',
            date: 'Aujourd\'hui, 10:45',
            icon: AlertTriangle,
            color: 'text-red-500',
            bgColor: 'bg-red-500/10',
            channels: ['email', 'whatsapp']
        },
        {
            id: 2,
            type: 'grade',
            title: 'Nouvelle note disponible',
            message: 'Une nouvelle note (15/20) a été publiée pour Marie Dupont en Physique-Chimie.',
            date: 'Aujourd\'hui, 09:30',
            icon: Info,
            color: 'text-[#eb8e3a]',
            bgColor: 'bg-[#eb8e3a]/10',
            channels: ['whatsapp']
        },
        {
            id: 3,
            type: 'success',
            title: 'Inscription validée',
            message: 'Le dossier de Marie Dupont a été validé par l\'administration. Bienvenue !',
            date: 'Hier, 16:30',
            icon: CheckCircle,
            color: 'text-green-400',
            bgColor: 'bg-green-400/10',
            channels: ['email']
        },
        {
            id: 4,
            type: 'warning',
            title: 'Rappel de paiement',
            message: 'Le délai pour le paiement de la 2ème tranche de scolarité de Jean Dupont expire bientôt.',
            date: '20 Déc. 2025',
            icon: AlertTriangle,
            color: 'text-orange-400',
            bgColor: 'bg-orange-400/10',
            channels: ['email', 'whatsapp']
        }
    ];

    return (
        <div className="space-y-8">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold">Centre de Notifications</h1>
                    <p className="text-white/40 mt-1">Restez informé de tout ce qui concerne la scolarité de vos enfants.</p>
                </div>
                <button
                    onClick={() => alert("Toutes les notifications ont été marquées comme lues.")}
                    className="text-sm text-orange-400 font-semibold hover:underline"
                >
                    Tout marquer comme lu
                </button>
            </header>

            <div className="grid grid-cols-1 gap-4">
                {notifications.map((notif) => (
                    <div key={notif.id} className="glass-card p-6 flex gap-6 hover:bg-white/5 transition-colors cursor-pointer border-l-4 border-l-transparent hover:border-l-orange-400">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${notif.bgColor} ${notif.color}`}>
                            <notif.icon size={24} />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-1">
                                <h3 className="font-bold">{notif.title}</h3>
                                <div className="flex items-center gap-3">
                                    <div className="flex gap-1.5 mr-4">
                                        {notif.channels?.includes('email') && (
                                            <div title="Notifié par Email" className="p-1 rounded-md bg-white/5 text-white/40 group-hover:text-white/60">
                                                <Mail size={12} />
                                            </div>
                                        )}
                                        {notif.channels?.includes('whatsapp') && (
                                            <div title="Notifié par WhatsApp" className="p-1 rounded-md bg-green-500/10 text-green-500/60 group-hover:text-green-500">
                                                <MessageSquare size={12} />
                                            </div>
                                        )}
                                    </div>
                                    <span className="text-xs text-white/20 whitespace-nowrap">{notif.date}</span>
                                </div>
                            </div>
                            <p className="text-white/60 leading-relaxed text-sm">{notif.message}</p>
                        </div>
                    </div>
                ))}
            </div>


        </div>
    );
};

export default Notifications;
