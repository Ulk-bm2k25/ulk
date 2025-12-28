import React, { useState } from 'react';
import { ArrowLeft, Mail, Loader2, CheckCircle, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '@/api';

const ForgotPassword = ({ onNavigateToLogin }) => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await api.post('/password/forgot', { email });
            if (response.data.success) {
                setIsSubmitted(true);
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Erreur lors de l\'envoi du lien de réinitialisation');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-brand-dark p-4 font-sans relative">
            <Link
                to="/"
                className="absolute top-6 left-6 flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
            >
                <div className="p-2 rounded-full group-hover:bg-white/10 transition-colors">
                    <ArrowLeft size={20} />
                </div>
                <span className="font-medium text-sm hidden sm:inline">Retour à l'accueil</span>
            </Link>

            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-300">
                <div className="p-8 pb-6 text-center">
                    <div className="inline-flex justify-center items-center mb-6">
                        <div className="h-12 w-12 bg-orange-100 rounded-xl flex items-center justify-center text-brand-primary mb-2">
                            <Lock size={24} />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-brand-dark tracking-tight">
                        Mot de passe oublié
                    </h1>
                    <p className="text-slate-500 mt-2">Entrez votre email pour recevoir un lien de réinitialisation</p>
                </div>

                <div className="p-8 pt-0">
                    {!isSubmitted ? (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-1.5">
                                <label className="block text-sm font-semibold text-slate-700">
                                    Email professionnel
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-primary transition-colors">
                                        <Mail size={18} />
                                    </div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={isLoading}
                                        className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-lg text-slate-900 bg-slate-50 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:border-brand-primary focus:ring-orange-100"
                                        placeholder="admin@ecole.com"
                                        required
                                    />
                                </div>
                                {error && (
                                    <p className="text-red-500 text-xs font-medium pl-1">{error}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white transition-all duration-200 ${
                                    isLoading
                                        ? 'bg-brand-primary/70 cursor-wait'
                                        : 'bg-brand-primary hover:bg-orange-600 hover:-translate-y-0.5'
                                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary`}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 size={20} className="animate-spin mr-2" />
                                        Envoi en cours...
                                    </>
                                ) : (
                                    'Envoyer le lien'
                                )}
                            </button>
                        </form>
                    ) : (
                        <div className="text-center space-y-6 animate-in fade-in zoom-in duration-300">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                                <CheckCircle size={48} className="text-green-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-800">Vérifiez vos emails</h2>
                            <p className="text-slate-600">
                                Si un compte existe pour <strong>{email}</strong>, vous recevrez un lien pour réinitialiser votre mot de passe d'ici quelques instants.
                            </p>
                            <button
                                onClick={onNavigateToLogin}
                                className="w-full py-3 px-4 bg-brand-primary text-white rounded-lg font-bold hover:bg-orange-600 transition-colors"
                            >
                                Retour à la connexion
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;

