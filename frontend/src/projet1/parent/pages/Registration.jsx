import React, { useState } from 'react';
import { User, Users, School, CheckCircle } from 'lucide-react';
import '../styles/theme.css';

const Registration = () => {
    const [step, setStep] = useState(1);

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <User className="text-orange-400" /> Données du Parent / Tuteur
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm text-white/60">Nom complet</label>
                                <input type="text" className="parent-input" placeholder="Ex: Jean Dupont" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-white/60">Téléphone</label>
                                <input type="tel" className="parent-input" placeholder="Ex: +225 0102030405" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-white/60">Profession</label>
                                <input type="text" className="parent-input" placeholder="Ex: Enseignant" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-white/60">Adresse</label>
                                <input type="text" className="parent-input" placeholder="Ex: Abidjan, Cocody" />
                            </div>
                        </div>
                        <button onClick={() => setStep(2)} className="parent-btn-primary float-right mt-6">Suivant</button>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <Users className="text-orange-400" /> Données de l'Élève
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm text-white/60">Nom de l'enfant</label>
                                <input type="text" className="parent-input" placeholder="Ex: Marc Dupont" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-white/60">Date de naissance</label>
                                <input type="date" className="parent-input" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-white/60">Genre</label>
                                <select className="parent-input bg-parent-bg-medium">
                                    <option>Masculin</option>
                                    <option>Féminin</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-white/60">Classe souhaitée</label>
                                <select className="parent-input bg-parent-bg-medium">
                                    <option>6ème</option>
                                    <option>5ème</option>
                                    <option>4ème</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-between mt-6">
                            <button onClick={() => setStep(1)} className="text-white/40 hover:text-white">Retour</button>
                            <button onClick={() => setStep(3)} className="parent-btn-primary">Finaliser l'inscription</button>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="text-center py-12 space-y-6">
                        <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle size={48} />
                        </div>
                        <h3 className="text-2xl font-bold">Demande soumise avec succès !</h3>
                        <p className="text-white/60 max-w-md mx-auto">
                            L'administration examine votre demande. Vous recevrez une notification dès que l'inscription sera validée.
                        </p>
                        <button onClick={() => setStep(1)} className="parent-btn-primary mt-6">Retour au début</button>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold">Inscription en ligne</h1>
                <p className="text-white/40 mt-1">Remplissez les informations pour inscrire votre enfant.</p>
            </header>

            {/* Steps Indicator */}
            <div className="flex items-center gap-4 mb-8">
                {[1, 2, 3].map((s) => (
                    <div key={s} className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= s ? 'bg-orange-400 text-dark' : 'bg-white/10 text-white/40'}`}>
                            {s}
                        </div>
                        <div className={`h-1 w-12 rounded ${step > s ? 'bg-orange-400' : 'bg-white/10'}`} />
                    </div>
                ))}
            </div>

            <div className="glass-card p-8 bg-white/5">
                {renderStep()}
            </div>
        </div>
    );
};

export default Registration;
