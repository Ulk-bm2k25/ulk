import React, { useState } from 'react';
import { Send, Mail, Users, User, CheckCircle, AlertCircle, Search, School, Eye, Clock, Trash2, Smartphone } from 'lucide-react';

// Modification : Ajout de la prop availableClasses pour la cohérence
const SendNotification = ({ availableClasses = [] }) => {
    const [sending, setSending] = useState(false);
    const [success, setSuccess] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    const [formData, setFormData] = useState({
        targetType: 'class', // 'all', 'class', 'student'
        targetId: '',
        subject: '',
        message: '',
        channels: {
            email: true,
            whatsapp: false
        }
    });

    // Historique des notifications
    const [sentNotifications, setSentNotifications] = useState([
        {
            id: 1,
            date: '24 Déc 2025, 10:30',
            target: '6ème A',
            subject: 'Réunion des parents',
            message: 'Bonjour chers parents, une réunion est prévue ce vendredi à 16h...',
            channels: ['email', 'whatsapp'],
            status: 'sent'
        }
    ]);

    // LOGIQUE DE LISTE DES CLASSES :
    // 1. Si AdminManager nous passe des classes réelles (availableClasses), on utilise leurs noms.
    // 2. Sinon, on utilise une liste par défaut (Fallback) pour éviter un écran vide.
    const defaultClasses = [
        'Maternelle', 'CI', 'CP', 'CE1', 'CE2', 'CM1', 'CM2',
        '6ème', '5ème', '4ème', '3ème',
        '2nde', '1ère', 'Terminale'
    ];

    const classOptions = availableClasses.length > 0 
        ? availableClasses.map(c => c.name).sort() 
        : defaultClasses;

    const templates = [
        { id: 'custom', label: 'Message Personnalisé', subject: '', message: '' },
        { id: 'meeting', label: 'Réunion Parents', subject: 'Invitation Réunion des Parents d\'Élèves', message: 'Nous vous invitons à une réunion d\'information qui se tiendra le [Date] à [Heure] dans la salle polyvalente.' },
        { id: 'payment', label: 'Rappel Paiement', subject: 'Rappel : Échéance de scolarité', message: 'Nous vous informons qu\'une échéance de scolarité arrive à terme le [Date]. Merci de régulariser la situation.' },
        { id: 'absence', label: 'Alerte Absence', subject: 'Alerte Absence : [Nom Élève]', message: 'Sauf erreur de notre part, votre enfant est absent ce jour sans motif communiqué.' }
    ];

    const applyTemplate = (templateId) => {
        const template = templates.find(t => t.id === templateId);
        if (template) {
            setFormData({
                ...formData,
                subject: template.subject,
                message: template.message
            });
        }
    };

    // Handlers
    const handleChannelToggle = (channel) => {
        setFormData(prev => ({
            ...prev,
            channels: {
                ...prev.channels,
                [channel]: !prev.channels[channel]
            }
        }));
    };

    const handleSend = () => {
        if (!formData.message || (!formData.channels.email && !formData.channels.whatsapp)) return;

        setSending(true);
        // Simulation d'envoi API
        setTimeout(() => {
            const newNotif = {
                id: Date.now(),
                date: new Date().toLocaleString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
                target: formData.targetType === 'all' ? 'Tous les parents' : (formData.targetId || 'Cible individuelle'),
                subject: formData.subject || 'Note d\'information',
                message: formData.message,
                channels: Object.keys(formData.channels).filter(c => formData.channels[c]),
                status: 'sent'
            };

            setSentNotifications([newNotif, ...sentNotifications]);
            setSending(false);
            setSuccess(true);
            setShowPreview(false);

            // Reset après 3 secondes
            setTimeout(() => {
                setSuccess(false);
                setFormData({
                    targetType: 'class',
                    targetId: '',
                    subject: '',
                    message: '',
                    channels: { email: true, whatsapp: false }
                });
            }, 3000);
        }, 1500);
    };

    const deleteFromHistory = (id) => {
        setSentNotifications(sentNotifications.filter(n => n.id !== id));
    };

    if (success) {
        return (
            <div className="h-[calc(100vh-150px)] flex flex-col items-center justify-center animate-in zoom-in-95 duration-300">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-sm border border-green-200">
                    <CheckCircle size={40} className="text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Notification Envoyée !</h2>
                <p className="text-slate-500 max-w-md text-center">
                    Votre message a été envoyé avec succès via {formData.channels.email && formData.channels.whatsapp ? 'Email et WhatsApp' : formData.channels.email ? 'Email' : 'WhatsApp'}.
                </p>
                <button
                    onClick={() => setSuccess(false)}
                    className="mt-8 px-6 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors font-medium border border-slate-200"
                >
                    Retour aux notifications
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
            <header className="flex justify-between items-end border-b border-slate-100 pb-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Communication & Notifications</h1>
                    <p className="text-slate-500 text-sm mt-1">Communiquez instantanément avec les parents via Email ou WhatsApp.</p>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    <Clock size={14} />
                    Dernière mise à jour: {new Date().toLocaleDateString('fr-FR')}
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Colonne Gauche : Configuration (8/12) */}
                <div className="lg:col-span-8 space-y-6">

                    {/* 1. Destinataires */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-brand-primary"></div>
                        <h3 className="font-bold text-slate-800 mb-5 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-lg bg-orange-100 text-brand-primary text-xs flex items-center justify-center font-bold">01</span>
                            Cible de la notification
                        </h3>

                        <div className="grid grid-cols-3 gap-3 mb-6">
                            {[
                                { id: 'class', icon: Users, label: 'Par Classe' },
                                { id: 'student', icon: User, label: 'Élève unique' },
                                { id: 'all', icon: School, label: 'Toute l\'école' }
                            ].map(type => (
                                <button
                                    key={type.id}
                                    onClick={() => setFormData({ ...formData, targetType: type.id, targetId: '' })}
                                    className={`p-4 rounded-xl border flex flex-col items-center gap-3 transition-all ${formData.targetType === type.id ? 'border-brand-primary bg-orange-50 text-brand-primary ring-2 ring-orange-100' : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50 text-slate-500'}`}
                                >
                                    <type.icon size={22} className={formData.targetType === type.id ? 'text-brand-primary' : 'text-slate-400 group-hover:text-slate-600'} />
                                    <span className="text-sm font-bold">{type.label}</span>
                                </button>
                            ))}
                        </div>

                        {formData.targetType === 'class' && (
                            <div className="animate-in slide-in-from-top-2 duration-300">
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Sélectionnez la classe</label>
                                <select
                                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all cursor-pointer font-medium text-slate-800"
                                    onChange={(e) => setFormData({ ...formData, targetId: e.target.value })}
                                    value={formData.targetId}
                                >
                                    <option value="" className="text-slate-400">-- Choisir une classe --</option>
                                    {classOptions.map(cls => <option key={cls} value={cls} className="text-slate-800">{cls}</option>)}
                                </select>
                            </div>
                        )}

                        {formData.targetType === 'student' && (
                            <div className="relative animate-in slide-in-from-top-2 duration-300">
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Rechercher un parent par le nom de l'élève</label>
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Commencez à taper le nom de l'élève..."
                                        value={formData.targetId}
                                        onChange={(e) => setFormData({ ...formData, targetId: e.target.value })}
                                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-primary/20 font-medium transition-all text-slate-800 placeholder:text-slate-400"
                                    />
                                </div>
                                {formData.targetId.length > 2 && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg p-2 flex flex-col gap-1 overflow-hidden animate-in fade-in duration-200">
                                        <button
                                            onClick={() => setFormData({ ...formData, targetId: 'KOUE Jean-Baptiste (6ème)' })}
                                            className="p-2 hover:bg-slate-50 rounded-lg text-left text-sm font-medium flex justify-between items-center group text-slate-700 hover:text-slate-900"
                                        >
                                            <span>KOUE Jean-Baptiste <span className="text-slate-400 font-normal ml-2">6ème</span></span>
                                            <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">Sélectionner</span>
                                        </button>
                                        <button
                                            onClick={() => setFormData({ ...formData, targetId: 'KADI Aminata (Terminale D)' })}
                                            className="p-2 hover:bg-slate-50 rounded-lg text-left text-sm font-medium flex justify-between items-center group text-slate-700 hover:text-slate-900"
                                        >
                                            <span>KADI Aminata <span className="text-slate-400 font-normal ml-2">Terminale D</span></span>
                                            <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">Sélectionner</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* 2. Message */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                        <div className="flex justify-between items-start mb-5">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-lg bg-blue-50 text-blue-500 text-xs flex items-center justify-center font-bold">02</span>
                                Contenu du message
                            </h3>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] uppercase font-bold text-slate-400">Modèles:</span>
                                <select
                                    className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 outline-none font-bold text-slate-600"
                                    onChange={(e) => applyTemplate(e.target.value)}
                                    defaultValue="custom"
                                >
                                    {templates.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Objet (ex: Rappel de réunion, Absence, Félicitations...)"
                                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-primary/20 font-bold text-slate-800 placeholder:font-normal"
                                value={formData.subject}
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            />

                            <textarea
                                rows="6"
                                placeholder="Écrivez votre message ici de manière claire..."
                                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-primary/20 resize-none font-medium leading-relaxed text-slate-800 placeholder:text-slate-400"
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            ></textarea>

                            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-200/50">
                                <div className="text-xs text-slate-500">
                                    <span className="font-bold text-slate-700">{formData.message.length}</span> caractères
                                </div>
                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowPreview(!showPreview)}
                                        className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5"
                                    >
                                        <Eye size={14} /> Aperçu
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Aperçu Dynamique */}
                        {showPreview && formData.message && (
                            <div className="mt-4 p-4 bg-indigo-50 border border-indigo-100 rounded-xl animate-in zoom-in-95 duration-200 origin-top">
                                <div className="flex items-center gap-2 mb-3 text-indigo-700 font-bold text-sm">
                                    <Eye size={16} /> Aperçu du message final
                                </div>
                                <div className="bg-white p-4 rounded-lg shadow-sm border border-indigo-200">
                                    <h4 className="font-bold text-slate-800 mb-2">{formData.subject || 'Note d\'information'}</h4>
                                    <p className="text-slate-600 whitespace-pre-wrap text-sm leading-relaxed italic border-l-2 border-indigo-500 pl-3">
                                        "Bonjour chers parents, {formData.message}"
                                    </p>
                                    <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] text-slate-400 font-medium">
                                        Envoyé par: La Direction, {new Date().toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Colonne Droite : Canaux & Action (4/12) */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-slate-800 mb-5">Canaux de communication</h3>

                        <div className="space-y-4">
                            <label className={`group flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.channels.email ? 'border-brand-primary bg-orange-50' : 'border-slate-100 grayscale hover:grayscale-0'}`}>
                                <input
                                    type="checkbox"
                                    checked={formData.channels.email}
                                    onChange={() => handleChannelToggle('email')}
                                    className="w-5 h-5 accent-brand-primary"
                                />
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 font-bold text-slate-800">
                                        <Mail size={18} className={formData.channels.email ? 'text-brand-primary' : 'text-slate-400'} />
                                        Email
                                    </div>
                                    <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">Idéal pour les newsletters et documents pdf.</p>
                                </div>
                            </label>

                            <label className={`group flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.channels.whatsapp ? 'border-green-500 bg-green-50' : 'border-slate-100 grayscale hover:grayscale-0'}`}>
                                <input
                                    type="checkbox"
                                    checked={formData.channels.whatsapp}
                                    onChange={() => handleChannelToggle('whatsapp')}
                                    className="w-5 h-5 accent-green-600"
                                />
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 font-bold text-slate-800">
                                        <Smartphone size={18} className={formData.channels.whatsapp ? 'text-green-600' : 'text-slate-400'} />
                                        WhatsApp
                                    </div>
                                    <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">Lecture quasi instantanée. Taux de réponse élevé.</p>
                                </div>
                            </label>
                        </div>

                        {!formData.channels.email && !formData.channels.whatsapp && (
                            <div className="mt-4 p-3 bg-red-50 text-red-600 text-[11px] font-bold rounded-lg flex items-center gap-2 border border-red-100 animate-pulse">
                                <AlertCircle size={14} />
                                Sélectionnez au moins un canal !
                            </div>
                        )}
                    </div>

                    <div className="bg-slate-900 p-6 rounded-2xl shadow-xl shadow-slate-200 border border-slate-800">
                        <div className="flex justify-between text-xs text-slate-400 mb-2">
                            <span>Destinataires estimés</span>
                            <span className="font-bold text-white">
                                {formData.targetType === 'all' ? '450' : formData.targetType === 'class' ? '35' : '1'}
                            </span>
                        </div>
                        <div className="flex justify-between text-xs text-slate-400 mb-6">
                            <span>Statut des crédits</span>
                            <span className="font-bold text-green-400">Illimité</span>
                        </div>

                        <button
                            onClick={handleSend}
                            disabled={sending || (!formData.channels.email && !formData.channels.whatsapp) || !formData.message}
                            className="w-full py-4 bg-brand-primary text-white font-bold rounded-xl shadow-lg hover:bg-orange-600 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all active:scale-95 group"
                        >
                            {sending ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>Cryptage & Envoi...</span>
                                </>
                            ) : (
                                <>
                                    <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    <span>Envoyer maintenant</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Historique des notifications */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <Clock size={20} className="text-slate-400" />
                        Historique des envois récents
                    </h3>
                    <div className="text-xs text-slate-500">
                        Dernières 30 jours
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase">
                            <tr>
                                <th className="px-6 py-4">Date & Heure</th>
                                <th className="px-6 py-4">Destinataires</th>
                                <th className="px-6 py-4">Canaux</th>
                                <th className="px-6 py-4">Objet</th>
                                <th className="px-6 py-4">Statut</th>
                                <th className="px-6 py-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {sentNotifications.map(notif => (
                                <tr key={notif.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-slate-700">{notif.date}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                                {notif.target === 'Tous les parents' ? <School size={14} /> : <Users size={14} />}
                                            </div>
                                            <span className="text-sm font-semibold text-slate-700">{notif.target}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-1.5">
                                            {notif.channels.includes('email') && <Mail size={16} className="text-blue-500" title="Email" />}
                                            {notif.channels.includes('whatsapp') && <Smartphone size={16} className="text-green-500" title="WhatsApp" />}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-slate-600 max-w-xs truncate font-medium">{notif.subject}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 bg-green-50 text-green-600 text-[10px] font-bold rounded-full border border-green-100 uppercase">
                                            Délivré
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button
                                            onClick={() => deleteFromHistory(notif.id)}
                                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {sentNotifications.length === 0 && (
                        <div className="p-12 text-center text-slate-400">
                            <div className="mb-2 flex justify-center"><Mail size={40} className="opacity-20" /></div>
                            Aucune notification envoyée pour le moment.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SendNotification;