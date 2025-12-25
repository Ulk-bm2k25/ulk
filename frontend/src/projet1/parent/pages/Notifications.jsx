import React from 'react';
import { Bell, Mail, Info, AlertTriangle, CheckCircle, Smartphone, MessageSquare } from 'lucide-react';
import '../styles/theme.css';

const Notifications = () => {
    const notifications = [];

    return (
        <div className="space-y-8">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold">Centre de Notifications</h1>
                    <p className="text-white/40 mt-1">Restez informé de tout ce qui concerne la scolarité de vos enfants.</p>
                </div>
                {notifications.length > 0 && (
                    <button
                        onClick={() => alert("Toutes les notifications ont été marquées comme lues.")}
                        className="text-sm text-orange-400 font-semibold hover:underline"
                    >
                        Tout marquer comme lu
                    </button>
                )}
            </header>

            <div className="grid grid-cols-1 gap-4">
                {notifications.length > 0 ? (
                    notifications.map((notif) => (
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
                    ))
                ) : (
                    <div className="p-12 text-center text-white/20 italic">
                        Aucune notification pour le moment.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notifications;
