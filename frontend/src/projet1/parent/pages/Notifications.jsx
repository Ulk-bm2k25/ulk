import React, { useEffect, useState } from 'react';
import { Bell, Mail, Info, AlertTriangle, CheckCircle, Smartphone, MessageSquare, Loader2 } from 'lucide-react';
import api from '@/api';
import '../styles/theme.css';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            setIsLoading(true);
            const response = await api.get('/parent/notifications');
            setNotifications(response.data.notifications);
            setIsLoading(false);
        } catch (error) {
            console.error("Failed to fetch notifications", error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const markAsRead = async (id) => {
        try {
            await api.patch(`/parent/notifications/${id}/read`);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, lu: 1 } : n));
        } catch (error) {
            console.error("Failed to mark notification as read", error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await api.post('/parent/notifications/read-all');
            setNotifications(prev => prev.map(n => ({ ...n, lu: 1 })));
        } catch (error) {
            console.error("Failed to mark all as read", error);
        }
    };


    const getIcon = (type) => {
        switch (type) {
            case 'info': return Info;
            case 'success': return CheckCircle;
            case 'warning': return AlertTriangle;
            case 'alert': return Bell;
            default: return Bell;
        }
    };

    const getColor = (type) => {
        switch (type) {
            case 'info': return 'text-blue-400 bg-blue-400/10';
            case 'success': return 'text-green-400 bg-green-400/10';
            case 'warning': return 'text-orange-400 bg-orange-400/10';
            case 'alert': return 'text-red-400 bg-red-400/10';
            default: return 'text-white/40 bg-white/5';
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="animate-spin text-[#eb8e3a] mb-4" size={48} />
                <p className="text-white/40">Chargement de vos notifications...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold">Centre de Notifications</h1>
                    <p className="text-white/40 mt-1">Restez informé de tout ce qui concerne la scolarité de vos enfants.</p>
                </div>
                {notifications.some(n => !n.lu) && (
                    <button
                        onClick={markAllAsRead}
                        className="text-sm text-orange-400 font-semibold hover:underline"
                    >
                        Tout marquer comme lu
                    </button>
                )}
            </header>

            <div className="grid grid-cols-1 gap-4">
                {notifications.length > 0 ? (
                    notifications.map((notif) => {
                        const Icon = getIcon(notif.type);
                        const colors = getColor(notif.type);
                        return (
                            <div
                                key={notif.id}
                                onClick={() => !notif.lu && markAsRead(notif.id)}
                                className={`glass-card p-6 flex gap-6 hover:bg-white/5 transition-colors cursor-pointer border-l-4 ${notif.lu ? 'border-l-transparent opacity-60' : 'border-l-orange-400 animate-pulse-subtle'}`}
                            >
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${colors}`}>
                                    <Icon size={24} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="font-bold uppercase text-[10px] tracking-widest text-[#eb8e3a]">{notif.type}</h3>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs text-white/20 whitespace-nowrap">
                                                {new Date(notif.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-white/80 leading-relaxed font-bold">{notif.message}</p>
                                </div>
                            </div>
                        );
                    })
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
