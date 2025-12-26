import React, { useState } from 'react';
import { ArrowLeft, Mail, Loader2, CheckCircle } from 'lucide-react';
import '../styles/theme.css';
import smilingChildren from '../assets/smiling_children.png';

const ForgotPassword = ({ onNavigateToLogin }) => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulation d'envoi d'email
        setTimeout(() => {
            setIsLoading(false);
            setIsSubmitted(true);
        }, 1500);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-parent-portal text-white relative">
            <button
                onClick={onNavigateToLogin}
                className="absolute top-6 left-6 flex items-center gap-2 text-white/40 hover:text-white transition-colors group z-50"
            >
                <div className="p-2 rounded-full group-hover:bg-white/10 transition-colors">
                    <ArrowLeft size={20} />
                </div>
                <span className="font-medium text-sm hidden sm:inline">Retour à la connexion</span>
            </button>

            <div className="max-w-4xl w-full flex glass-card overflow-hidden shadow-2xl min-h-[500px]">
                {/* Left Side: Form */}
                <div className="w-full md:w-1/2 p-12 flex flex-col justify-center">
                    {!isSubmitted ? (
                        <>
                            <div className="mb-10">
                                <h2 className="text-3xl font-bold mb-2 text-white">Mot de passe oublié ?</h2>
                                <p className="text-white/40">Entrez votre email pour recevoir un lien de réinitialisation.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-white/60">Email</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/20 group-focus-within:text-orange-400 transition-colors">
                                            <Mail size={18} />
                                        </div>
                                        <input
                                            type="email"
                                            className="parent-input pl-12"
                                            placeholder="votre@email.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="parent-btn-primary w-full py-4 text-lg font-bold flex items-center justify-center gap-2 mt-4"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="animate-spin" size={24} />
                                            <span>Envoi en cours...</span>
                                        </>
                                    ) : (
                                        "Envoyer le lien"
                                    )}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center space-y-6 animate-in fade-in zoom-in duration-300">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 text-green-400 rounded-full mb-4">
                                <CheckCircle size={48} />
                            </div>
                            <h2 className="text-3xl font-bold text-white">Vérifiez vos emails</h2>
                            <p className="text-white/60">
                                Si un compte existe pour <strong>{email}</strong>, vous recevrez un lien pour réinitialiser votre mot de passe d'ici quelques instants.
                            </p>
                            <button
                                onClick={onNavigateToLogin}
                                className="parent-btn-primary w-full py-4 text-lg font-bold mt-4"
                            >
                                Retour à la connexion
                            </button>
                        </div>
                    )}
                </div>

                {/* Right Side: Image/Decor */}
                <div className="hidden md:block w-1/2 relative bg-brand-dark/20">
                    <img
                        src={smilingChildren}
                        alt="School life"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-parent-bg-dark/60 backdrop-blur-[1px]"></div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center z-10">
                        <h3 className="text-4xl font-black mb-4">Besoin d'aide ?</h3>
                        <p className="text-lg text-white/80">Nous sommes là pour vous aider à retrouver l'accès à votre espace.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
