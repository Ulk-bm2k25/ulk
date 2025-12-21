import React from 'react';
import { Bell, Mail, Info, AlertTriangle, CheckCircle } from 'lucide-react';
import '../styles/theme.css';

const Notifications = () => {
    const notifications = [
        {
            id: 1,
            type: 'warning',
            title: 'Rappel de paiement',
            message: 'Le délai pour le paiement de la 2ème tranche de scolarité de Jean Dupont expire le 30 Décembre.',
            date: 'Aujourd\'hui, 10:45',
            icon: AlertTriangle,
            color: 'text-orange-400',
            bgColor: 'bg-orange-400/10'
        },
        {
            id: 2,
            type: 'info',
            title: 'Réunion Parents-Professeurs',
            message: 'Une réunion est prévue le samedi 15 Janvier à 09:00 dans l\'amphithéâtre de l\'école.',
            date: 'Hier, 16:30',
            icon: Info,
            color: 'text-blue-400',
            bgColor: 'bg-blue-400/10'
        },
        {
            id: 3,
            type: 'success',
            title: 'Inscription validée',
            message: 'Le dossier de Marie Dupont a été validé par l\'administration. Bienvenue !',
            date: '20 Déc. 2025',
            icon: CheckCircle,
            color: 'text-green-400',
            bgColor: 'bg-green-400/10'
        },
        {
            id: 4,
            type: 'mail',
            title: 'Nouveau bulletin de notes',
            message: 'Le bulletin du 1er trimestre de Jean Dupont est désormais consultable en ligne.',
            date: '18 Déc. 2025',
            icon: Mail,
            color: 'text-purple-400',
            bgColor: 'bg-purple-400/10'
        }
    ];

    return (
        <div className="space-y-8">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold">Centre de Notifications</h1>
                    <p className="text-white/40 mt-1">Restez informé de tout ce qui concerne la scolarité de vos enfants.</p>
                </div>
                <button className="text-sm text-orange-400 font-semibold hover:underline">Tout marquer comme lu</button>
            </header>

            <div className="grid grid-cols-1 gap-4">
                {notifications.map((notif) => (
                    <div key={notif.id} className="glass-card p-6 flex gap-6 hover:bg-white/5 transition-colors cursor-pointer border-l-4 border-l-transparent hover:border-l-orange-400">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${notif.bgColor} ${notif.color}`}>
                            <notif.icon size={24} />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between mb-1">
                                <h3 className="font-bold">{notif.title}</h3>
                                <span className="text-xs text-white/20 whitespace-nowrap ml-4">{notif.date}</span>
                            </div>
                            <p className="text-white/60 leading-relaxed">{notif.message}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-12 p-8 glass-card bg-orange-400/5 text-center">
                <Bell className="mx-auto mb-4 text-orange-400" size={32} />
                <h4 className="text-lg font-bold mb-2">Gérez vos alertes</h4>
                <p className="text-white/60 mb-6 max-w-lg mx-auto">
                    Vous pouvez choisir de recevoir ces notifications par Email ou via WhatsApp dans vos paramètres de compte.
                </p>
                <button className="parent-btn-primary">Configurer les alertes</button>
            </div>
        </div>
    );
};

export default Notifications;
