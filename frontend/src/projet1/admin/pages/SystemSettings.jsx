import React, { useState } from 'react';
import { School, Calendar, Bell, Save, Shield, Mail, Database, Clock, Users, FileText } from 'lucide-react';

const SystemSettings = () => {
    const [activeTab, setActiveTab] = useState('general');

    const [settings, setSettings] = useState({
        // Général
        schoolName: 'Nom de l\'établissement',
        address: 'Adresse de l\'établissement',
        phone: '+229 00 00 00 00',
        email: 'administration@ecole.com',
        academicYear: '2025-2026',

        // Inscriptions
        registrationOpen: true,
        allowLateRegistration: false,
        autoValidation: false,

        // Notifications
        notifyParentsOnAbsence: true,
        notifyParentsOnGrade: true,
        reminderDaysBeforePayment: 7,

        // Système
        maintenanceMode: false,
        backupFrequency: 'daily',
        dataRetentionYears: 5
    });

    const handleToggle = (key) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        const btn = document.getElementById('save-btn');
        const originalText = btn.innerHTML;
        btn.innerHTML = `<span class="flex items-center gap-2"><div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Sauvegarde...</span>`;
        btn.disabled = true;

        setTimeout(() => {
            btn.innerHTML = `<span class="flex items-center gap-2"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg> Sauvegardé !</span>`;
            btn.classList.add('bg-green-600', 'border-green-600');
            btn.classList.remove('bg-brand-primary', 'border-brand-primary');

            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.disabled = false;
                btn.classList.remove('bg-green-600', 'border-green-600');
                // Re-add original classes if they were removed or just let them be if they are default
            }, 2000);
        }, 800);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Paramètres Système</h1>
                    <p className="text-slate-500 text-sm mt-1">Configuration globale de la plateforme SchoolHub.</p>
                </div>
                <button
                    id="save-btn"
                    onClick={handleSave}
                    className="flex items-center gap-2 px-6 py-2.5 bg-brand-primary text-white rounded-lg font-bold shadow-sm hover:shadow-md transition-all active:scale-95"
                >
                    <Save size={18} />
                    Sauvegarder
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Menu Latéral */}
                <div className="lg:col-span-1 space-y-2">
                    {[
                        { id: 'general', label: 'Établissement', icon: School },
                        { id: 'inscriptions', label: 'Inscriptions', icon: Users },
                        { id: 'notifications', label: 'Notifications', icon: Bell },
                        { id: 'system', label: 'Système & Données', icon: Database },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors text-left ${activeTab === tab.id
                                ? 'bg-white text-brand-primary shadow-sm border border-slate-200'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                }`}
                        >
                            <tab.icon size={18} className={activeTab === tab.id ? 'text-brand-primary' : 'text-slate-400'} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Contenu Principal */}
                <div className="lg:col-span-3">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 min-h-[500px]">

                        {/* --- GÉNÉRAL --- */}
                        {activeTab === 'general' && (
                            <div className="space-y-6 animate-in fade-in duration-300">
                                <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-4 mb-6">Informations de l'établissement</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Nom de l'école</label>
                                        <div className="relative">
                                            <School className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input
                                                name="schoolName"
                                                type="text"
                                                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 text-slate-800"
                                                value={settings.schoolName}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Année Académique Courante</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <select
                                                name="academicYear"
                                                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 text-slate-800 appearance-none"
                                                value={settings.academicYear}
                                                onChange={handleChange}
                                            >
                                                <option>2024-2025</option>
                                                <option>2025-2026</option>
                                                <option>2026-2027</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-sm font-medium text-slate-700">Adresse postale</label>
                                        <input
                                            name="address"
                                            type="text"
                                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 text-slate-800"
                                            value={settings.address}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Email de contact</label>
                                        <input
                                            name="email"
                                            type="email"
                                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 text-slate-800"
                                            value={settings.email}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Téléphone</label>
                                        <input
                                            name="phone"
                                            type="tel"
                                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 text-slate-800"
                                            value={settings.phone}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* --- INSCRIPTIONS --- */}
                        {activeTab === 'inscriptions' && (
                            <div className="space-y-6 animate-in fade-in duration-300">
                                <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-4 mb-6">Paramètres des inscriptions</h2>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                                        <div>
                                            <div className="font-semibold text-slate-800">Inscriptions ouvertes</div>
                                            <div className="text-sm text-slate-500">Autoriser les parents à soumettre de nouveaux dossiers.</div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" checked={settings.registrationOpen} onChange={() => handleToggle('registrationOpen')} />
                                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                        </label>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                                        <div>
                                            <div className="font-semibold text-slate-800">Inscriptions tardives</div>
                                            <div className="text-sm text-slate-500">Accepter les dossiers après la date limite officielle.</div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" checked={settings.allowLateRegistration} onChange={() => handleToggle('allowLateRegistration')} />
                                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
                                        </label>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                                        <div>
                                            <div className="font-semibold text-slate-800">Validation Automatique</div>
                                            <div className="text-sm text-slate-500">Valider automatiquement les réinscriptions si le paiement est complet.</div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" checked={settings.autoValidation} onChange={() => handleToggle('autoValidation')} />
                                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* --- NOTIFICATIONS --- */}
                        {activeTab === 'notifications' && (
                            <div className="space-y-6 animate-in fade-in duration-300">
                                <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-4 mb-6">Automates de notifications</h2>

                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-semibold text-slate-600 uppercase">Alertes Parents</h3>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="checkbox"
                                                id="notif_abs"
                                                checked={settings.notifyParentsOnAbsence}
                                                onChange={() => handleToggle('notifyParentsOnAbsence')}
                                                className="w-5 h-5 rounded border-slate-300 text-brand-primary focus:ring-brand-primary"
                                            />
                                            <label htmlFor="notif_abs" className="text-slate-700">Notifier immédiatement par SMS/Email en cas d'absence</label>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="checkbox"
                                                id="notif_grade"
                                                checked={settings.notifyParentsOnGrade}
                                                onChange={() => handleToggle('notifyParentsOnGrade')}
                                                className="w-5 h-5 rounded border-slate-300 text-brand-primary focus:ring-brand-primary"
                                            />
                                            <label htmlFor="notif_grade" className="text-slate-700">Envoyer un récapitulatif hebdo des notes</label>
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-4 border-t border-slate-100">
                                        <h3 className="text-sm font-semibold text-slate-600 uppercase">Rappels de paiement</h3>
                                        <div className="flex items-center gap-4">
                                            <Clock className="text-slate-400" size={20} />
                                            <div className="flex-1">
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Délai de rappel (jours avant échéance)</label>
                                                <input
                                                    type="range"
                                                    min="1"
                                                    max="30"
                                                    value={settings.reminderDaysBeforePayment}
                                                    onChange={(e) => setSettings({ ...settings, reminderDaysBeforePayment: e.target.value })}
                                                    className="w-full accent-brand-primary"
                                                />
                                            </div>
                                            <div className="w-12 h-10 flex items-center justify-center bg-slate-100 rounded-lg font-bold text-slate-700">
                                                {settings.reminderDaysBeforePayment}j
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* --- SYSTÈME --- */}
                        {activeTab === 'system' && (
                            <div className="space-y-6 animate-in fade-in duration-300">
                                <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-4 mb-6">Système & Maintenance</h2>

                                <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl mb-6">
                                    <h4 className="flex items-center gap-2 font-bold text-orange-800 mb-2">
                                        <Shield size={18} /> Zone de danger
                                    </h4>
                                    <p className="text-sm text-orange-700 mb-4">Ces actions affectent l'ensemble de la plateforme et peuvent interrompre le service.</p>

                                    <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg border border-orange-200/50">
                                        <div className="text-sm font-medium text-orange-900">Mode Maintenance</div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" checked={settings.maintenanceMode} onChange={() => handleToggle('maintenanceMode')} />
                                            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-500"></div>
                                        </label>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Fréquence des sauvegardes</label>
                                        <select
                                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 text-slate-800"
                                            value={settings.backupFrequency}
                                            onChange={(e) => setSettings({ ...settings, backupFrequency: e.target.value })}
                                        >
                                            <option value="daily">Quotidienne (3:00 AM)</option>
                                            <option value="weekly">Hebdomadaire (Dimanche)</option>
                                            <option value="monthly">Mensuelle</option>
                                        </select>
                                    </div>

                                    <button
                                        onClick={() => alert(`Lancement de la sauvegarde manuelle...\nUn fichier .SQL zippé vous sera proposé au téléchargement.`)}
                                        className="w-full py-2.5 border border-slate-300 text-slate-600 font-medium rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Database size={16} />
                                        Télécharger une sauvegarde manuelle
                                    </button>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default SystemSettings;