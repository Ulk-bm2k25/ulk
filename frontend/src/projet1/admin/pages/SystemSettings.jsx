import React, { useState } from 'react';

import { Settings, Save, School, Calendar, BellRing } from 'lucide-react';



const SystemSettings = () => {

    const [settings, setSettings] = useState({

        schoolName: 'School-HUB Academy',

        currentYear: '2025-2026',

        notifyBeforeDays: 7, // Basé sur ton document F6.1

        urgentEmailCopy: true

    });



    return (

        <div className="space-y-8 p-6">

            <header>

                <h1 className="text-3xl font-bold">Paramètres Système</h1>

                <p className="text-white/40 mt-1">Configurez les règles globales de l'établissement.</p>

            </header>



            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Configuration École */}

                <div className="glass-card p-6 space-y-4">

                    <div className="flex items-center gap-3 text-orange-400">

                        <School size={20} />

                        <h2 className="font-bold">Établissement</h2>

                    </div>

                    <input 

                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 outline-none focus:border-orange-400"

                        value={settings.schoolName}

                        onChange={(e) => setSettings({...settings, schoolName: e.target.value})}

                    />

                    <input 

                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 outline-none focus:border-orange-400"

                        value={settings.currentYear}

                        onChange={(e) => setSettings({...settings, currentYear: e.target.value})}

                    />

                </div>



                {/* Configuration des Alertes F6 */}

                <div className="glass-card p-6 space-y-4">

                    <div className="flex items-center gap-3 text-orange-400">

                        <BellRing size={20} />

                        <h2 className="font-bold">Règles d'Automate (F6)</h2>

                    </div>

                    <label className="block text-sm text-white/60">

                        Alerte frais de scolarité (jours avant échéance) :

                        <input 

                            type="number"

                            className="w-full mt-2 bg-white/5 border border-white/10 rounded-lg p-3 outline-none focus:border-orange-400"

                            value={settings.notifyBeforeDays}

                            onChange={(e) => setSettings({...settings, notifyBeforeDays: e.target.value})}

                        />

                    </label>

                    <div className="flex items-center gap-3 pt-2">

                        <input type="checkbox" checked={settings.urgentEmailCopy} className="accent-orange-400" />

                        <span className="text-sm">Envoyer copie Email pour info urgente</span>

                    </div>

                </div>

            </div>



            <button className="parent-btn-primary flex items-center gap-2">

                <Save size={18} /> Sauvegarder les paramètres

            </button>

        </div>

    );

};



export default SystemSettings;