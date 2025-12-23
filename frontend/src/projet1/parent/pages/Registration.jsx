import React, { useState } from 'react';
import { User, Users, School, CheckCircle, Smartphone, CreditCard } from 'lucide-react';
import '../styles/theme.css';

const Registration = () => {
    const [step, setStep] = useState(1);
    const [paymentProvider, setPaymentProvider] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const handlePayment = () => {
        if (!paymentProvider || !phoneNumber) {
            alert("Veuillez sélectionner un opérateur et saisir votre numéro.");
            return;
        }
        setIsProcessing(true);
        // Simulate payment process
        setTimeout(() => {
            setIsProcessing(false);
            setStep(4);
        }, 2000);
    };

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
                                <select className="parent-input bg-parent-bg-medium text-white">
                                    <option>Masculin</option>
                                    <option>Féminin</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-white/60">Classe souhaitée</label>
                                <select className="parent-input bg-parent-bg-medium text-white">
                                    <option>6ème</option>
                                    <option>5ème</option>
                                    <option>4ème</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-between mt-6">
                            <button onClick={() => setStep(1)} className="text-white/40 hover:text-white-medium">Retour</button>
                            <button onClick={() => setStep(3)} className="parent-btn-primary">Finaliser l'inscription</button>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <Smartphone className="text-orange-400" /> Paiement par Mobile Money
                        </h3>
                        <div className="glass-card p-6 bg-white/5 space-y-6">
                            <div className="flex justify-between items-center text-lg">
                                <span className="text-white/60">Frais d'inscription</span>
                                <span className="font-bold text-orange-400">50,000 FCFA</span>
                            </div>

                            <div className="space-y-4">
                                <label className="text-sm text-white/60">Choisir votre opérateur</label>
                                <div className="grid grid-cols-3 gap-4">
                                    {[
                                        { id: 'orange', name: 'Orange', color: 'bg-[#FF7900]' },
                                        { id: 'mtn', name: 'MTN', color: 'bg-[#FFCC00]' },
                                        { id: 'moov', name: 'Moov', color: 'bg-[#005CA9]' }
                                    ].map((op) => (
                                        <button
                                            key={op.id}
                                            onClick={() => setPaymentProvider(op.id)}
                                            className={`p-4 rounded-xl flex flex-col items-center gap-2 transition-all border-2 ${paymentProvider === op.id ? 'border-orange-400 bg-white/10' : 'border-transparent bg-white/5 hover:bg-white/10'}`}
                                        >
                                            <div className={`w-10 h-10 rounded-lg ${op.color} flex items-center justify-center font-bold text-white text-xs`}>
                                                {op.name[0]}
                                            </div>
                                            <span className="text-xs font-bold">{op.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-white/60">Numéro de téléphone Mobile Money</label>
                                <div className="relative">
                                    <Smartphone size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                                    <input
                                        type="tel"
                                        className="parent-input pl-12"
                                        placeholder="01 02 03 04 05"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="bg-orange-400/10 border border-orange-400/20 p-4 rounded-xl flex gap-3">
                                <div className="w-10 h-10 rounded-full bg-orange-400/20 flex items-center justify-center shrink-0">
                                    <CreditCard size={18} className="text-orange-400" />
                                </div>
                                <p className="text-xs text-white/60 leading-relaxed">
                                    Une fois que vous aurez cliqué sur "Payer", vous recevrez une demande de confirmation sur votre téléphone pour valider la transaction.
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-between items-center mt-6">
                            <button onClick={() => setStep(2)} className="text-white/40 hover:text-white">Retour</button>
                            <button
                                onClick={handlePayment}
                                disabled={isProcessing}
                                className={`parent-btn-primary flex items-center gap-2 ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {isProcessing ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-dark/30 border-t-dark rounded-full animate-spin" />
                                        Traitement...
                                    </>
                                ) : (
                                    "Payer 50,000 FCFA"
                                )}
                            </button>
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className="text-center py-12 space-y-6">
                        <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle size={48} />
                        </div>
                        <h3 className="text-2xl font-bold">Paiement reçu et Inscription validée !</h3>
                        <p className="text-white/60 max-w-md mx-auto">
                            Merci pour votre paiement. Votre enfant est désormais inscrit. Vous recevrez le reçu par email et pouvez le télécharger dans l'onglet "Paiements".
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
                {[1, 2, 3, 4].map((s) => (
                    <div key={s} className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= s ? 'bg-orange-400 text-dark' : 'bg-white/10 text-white/40'}`}>
                            {s}
                        </div>
                        {s < 4 && <div className={`h-1 w-12 rounded ${step > s ? 'bg-orange-400' : 'bg-white/10'}`} />}
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
