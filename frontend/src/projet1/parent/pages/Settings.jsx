import React, { useState, useEffect } from 'react';
import { User, Lock, Bell, Moon, Sun, Globe, LogOut, CheckCircle, Smartphone, Mail, Loader2 } from 'lucide-react';
import api from '../../../api';
import '../styles/theme.css';

const Settings = ({ onLogout }) => {
    const [activeTab, setActiveTab] = useState('profile');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [profile, setProfile] = useState({
        nom: '',
        prenom: '',
        email: '',
        phone: '',
        occupation: ''
    });

    const [password, setPassword] = useState({
        current: '',
        new: '',
        confirm: ''
    });

    const [notifications, setNotifications] = useState({
        email: true,
        sms: false,
        whatsapp: true,
        grades: true,
        absences: true,
        payments: true
    });

    const [appearance, setAppearance] = useState({
        theme: 'dark',
        language: 'fr'
    });

    useEffect(() => {
        const fetchProfile = async () => {
            setIsLoading(true);
            try {
                const response = await api.get('/parent/profile');
                const { user, parent } = response.data;
                setProfile({
                    nom: user.nom || '',
                    prenom: user.prenom || '',
                    email: user.email || '',
                    phone: parent?.telephone || '',
                    occupation: parent?.profession || ''
                });
            } catch (err) {
                console.error("Failed to fetch profile", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleProfileChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleNotificationToggle = (key) => {
        setNotifications({ ...notifications, [key]: !notifications[key] });
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            if (activeTab === 'profile') {
                await api.post('/parent/profile/update', {
                    nom: profile.nom,
                    prenom: profile.prenom,
                    email: profile.email,
                    telephone: profile.phone,
                    profession: profile.occupation
                });
            } else if (activeTab === 'security') {
                if (password.new !== password.confirm) {
                    alert("Les mots de passe ne correspondent pas.");
                    return;
                }
                await api.post('/parent/profile/password', {
                    current_password: password.current,
                    new_password: password.new,
                    new_password_confirmation: password.confirm
                });
                setPassword({ current: '', new: '', confirm: '' });
            }
            alert('Paramètres sauvegardés avec succès !');
        } catch (err) {
            console.error("Save failed", err);
            alert(err.response?.data?.message || 'Erreur lors de la sauvegarde.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 text-white pb-20">
            <header>
                <h1 className="text-3xl font-bold">Paramètres du Compte</h1>
                <p className="text-white/40 mt-1">Gérez vos informations personnelles et vos préférences.</p>
            </header>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Paramètres */}
                <div className="w-full md:w-64 flex flex-col gap-2">
                    {[
                        { id: 'profile', label: 'Profil Personnel', icon: User },
                        { id: 'security', label: 'Sécurité', icon: Lock },
                        { id: 'notifications', label: 'Notifications', icon: Bell },
                        { id: 'preferences', label: 'Préférences', icon: Globe },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${activeTab === tab.id
                                ? 'bg-[#eb8e3a] text-white font-bold shadow-lg'
                                : 'text-white/60 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                        </button>
                    ))}

                    <div className="border-t border-white/5 my-2 pt-2">
                        <button
                            onClick={onLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-red-400 hover:bg-red-400/10 transition-colors"
                        >
                            <LogOut size={18} />
                            Déconnexion
                        </button>
                    </div>
                </div>

                {/* Contenu Principal */}
                <div className="flex-1 glass-card p-8 bg-white/5">

                    {/* --- PROFIL --- */}
                    {activeTab === 'profile' && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold mb-6">Informations Personnelles</h2>
                            <div className="flex items-center gap-6 mb-8">
                                <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center text-4xl font-bold border-4 border-[#eb8e3a]">
                                    {profile.prenom[0]}{profile.nom[0]}
                                </div>
                                <div>
                                    <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors">
                                        Changer la photo
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm text-white/60">Nom</label>
                                    <input name="nom" type="text" className="parent-input" value={profile.nom} onChange={handleProfileChange} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-white/60">Prénom</label>
                                    <input name="prenom" type="text" className="parent-input" value={profile.prenom} onChange={handleProfileChange} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-white/60">Email</label>
                                    <input name="email" type="email" className="parent-input" value={profile.email} onChange={handleProfileChange} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-white/60">Téléphone</label>
                                    <input name="phone" type="tel" className="parent-input" value={profile.phone} onChange={handleProfileChange} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-white/60">Profession</label>
                                    <input name="occupation" type="text" className="parent-input" value={profile.occupation} onChange={handleProfileChange} />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- SÉCURITÉ --- */}
                    {activeTab === 'security' && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold mb-6">Sécurité & Mot de passe</h2>
                            <div className="max-w-md space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm text-white/60">Mot de passe actuel</label>
                                    <input
                                        type="password"
                                        className="parent-input"
                                        placeholder="••••••••"
                                        value={password.current}
                                        onChange={(e) => setPassword({ ...password, current: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-white/60">Nouveau mot de passe</label>
                                    <input
                                        type="password"
                                        className="parent-input"
                                        placeholder="••••••••"
                                        value={password.new}
                                        onChange={(e) => setPassword({ ...password, new: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-white/60">Confirmer le nouveau mot de passe</label>
                                    <input
                                        type="password"
                                        className="parent-input"
                                        placeholder="••••••••"
                                        value={password.confirm}
                                        onChange={(e) => setPassword({ ...password, confirm: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="pt-4 border-t border-white/5">
                                <h3 className="font-bold mb-2">Double authentification (2FA)</h3>
                                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <Smartphone className="text-green-500" />
                                        <div>
                                            <div className="font-medium">SMS Verification</div>
                                            <div className="text-xs text-white/40">Recevoir un code par SMS à chaque connexion</div>
                                        </div>
                                    </div>
                                    <div className="w-12 h-6 bg-white/20 rounded-full relative cursor-pointer">
                                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- NOTIFICATIONS --- */}
                    {activeTab === 'notifications' && (
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-2xl font-bold mb-4">Canaux de communication</h2>
                                <div className="space-y-3">
                                    <label className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer">
                                        <div className="flex items-center gap-3">
                                            <Mail className="text-blue-400" />
                                            <div>
                                                <div className="font-medium">Email</div>
                                                <div className="text-xs text-white/40">Pour les reçus et documents officiels</div>
                                            </div>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={notifications.email}
                                            onChange={() => handleNotificationToggle('email')}
                                            className="w-5 h-5 rounded border-white/20 bg-dark text-orange-400 focus:ring-orange-400"
                                        />
                                    </label>

                                    <label className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer">
                                        <div className="flex items-center gap-3">
                                            <Smartphone className="text-green-500" />
                                            <div>
                                                <div className="font-medium">WhatsApp</div>
                                                <div className="text-xs text-white/40">Pour les notifications urgentes et alertes</div>
                                            </div>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={notifications.whatsapp}
                                            onChange={() => handleNotificationToggle('whatsapp')}
                                            className="w-5 h-5 rounded border-white/20 bg-dark text-orange-400 focus:ring-orange-400"
                                        />
                                    </label>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-white/5">
                                <h2 className="text-lg font-bold mb-4">M'alerter pour :</h2>
                                <div className="space-y-3">
                                    <label className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            checked={notifications.grades}
                                            onChange={() => handleNotificationToggle('grades')}
                                            className="rounded border-white/20 bg-dark text-orange-400 focus:ring-orange-400"
                                        />
                                        <span className="text-white/80">Nouvelles notes publiées</span>
                                    </label>
                                    <label className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            checked={notifications.absences}
                                            onChange={() => handleNotificationToggle('absences')}
                                            className="rounded border-white/20 bg-dark text-orange-400 focus:ring-orange-400"
                                        />
                                        <span className="text-white/80">Absences et retards</span>
                                    </label>
                                    <label className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            checked={notifications.payments}
                                            onChange={() => handleNotificationToggle('payments')}
                                            className="rounded border-white/20 bg-dark text-orange-400 focus:ring-orange-400"
                                        />
                                        <span className="text-white/80">Rappels de paiement</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- PRÉFÉRENCES --- */}
                    {activeTab === 'preferences' && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold mb-6">Préférences de l'interface</h2>

                            <div className="space-y-4">
                                <label className="block text-sm text-white/60">Thème</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => setAppearance({ ...appearance, theme: 'dark' })}
                                        className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 ${appearance.theme === 'dark' ? 'border-orange-400 bg-white/10' : 'border-transparent bg-white/5'}`}
                                    >
                                        <Moon size={24} />
                                        <span className="font-bold">Sombre</span>
                                    </button>
                                    <button
                                        onClick={() => setAppearance({ ...appearance, theme: 'light' })}
                                        className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 ${appearance.theme === 'light' ? 'border-orange-400 bg-white' : 'border-transparent bg-white/5'}`}
                                        style={appearance.theme === 'light' ? { color: 'black' } : {}}
                                    >
                                        <Sun size={24} />
                                        <span className="font-bold">Clair</span>
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2 pt-4">
                                <label className="block text-sm text-white/60">Langue</label>
                                <select
                                    className="parent-input"
                                    value={appearance.language}
                                    onChange={(e) => setAppearance({ ...appearance, language: e.target.value })}
                                    style={{ backgroundColor: '#1e2025' }}
                                >
                                    <option value="fr">Français</option>
                                    <option value="en">English</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {/* Footer Actions */}
                    <div className="mt-10 pt-6 border-t border-white/5 flex justify-end gap-4">
                        <button className="px-6 py-2.5 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-colors font-medium">
                            Annuler
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className={`px-6 py-2.5 rounded-xl bg-[#eb8e3a] hover:bg-[#d47d2f] text-white font-bold shadow-lg shadow-orange-900/20 transition-all active:scale-95 flex items-center gap-2 ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isSaving ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle size={18} />}
                            {isSaving ? 'Enregistrement...' : 'Enregistrer'}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Settings;
