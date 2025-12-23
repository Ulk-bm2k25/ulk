import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import '../styles/theme.css';
import paintedHands from '../assets/painted_handprints.png';

const ParentLogin = ({ onLogin, onNavigateToRegister }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        onLogin();
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-parent-bg-dark text-white relative">
            {/* Bouton Retour à l'accueil */}
            <Link
                to="/"
                className="absolute top-6 left-6 flex items-center gap-2 text-white/40 hover:text-white transition-colors group z-50"
            >
                <div className="p-2 rounded-full group-hover:bg-white/10 transition-colors">
                    <ArrowLeft size={20} />
                </div>
                <span className="font-medium text-sm hidden sm:inline">Retour à l'accueil</span>
            </Link>
            <div className="max-w-4xl w-full flex glass-card overflow-hidden shadow-2xl">
                {/* Left Side: Login Form */}
                <div className="w-full md:w-1/2 p-12 flex flex-col justify-center">
                    <div className="mb-10">
                        <h2 className="text-3xl font-bold mb-2 text-white">Bon retour !</h2>
                        <p className="text-white/40">Connectez-vous pour accéder à l'espace parent.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold mb-2 text-white/60">Email</label>
                            <input
                                type="email"
                                className="parent-input"
                                placeholder="votre@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="block text-sm font-semibold text-white/60">Mot de passe</label>
                                <a href="#" className="text-xs text-orange-400 hover:underline">Mot de passe oublié ?</a>
                            </div>
                            <div className="relative group">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className="parent-input pr-12"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/40 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <input type="checkbox" id="remember" className="rounded border-white/20 bg-white/5" />
                            <label htmlFor="remember" className="text-sm text-white/60">Se souvenir de moi</label>
                        </div>

                        <button type="submit" className="parent-btn-primary w-full py-4 text-lg font-bold">
                            Se connecter
                        </button>
                    </form>

                    <div className="mt-10 text-center">
                        <p className="text-sm text-white/40">
                            Pas encore de compte ?{' '}
                            <button
                                onClick={onNavigateToRegister}
                                className="text-orange-400 font-semibold hover:underline bg-transparent border-none p-0"
                            >
                                Créez-en un ici
                            </button>
                        </p>
                    </div>
                </div>

                {/* Right Side: Image/Decor */}
                <div className="hidden md:block w-1/2 relative">
                    <img
                        src={paintedHands}
                        alt="School life"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-parent-bg-dark/40 backdrop-blur-[2px]"></div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
                        <h3 className="text-4xl font-black mb-4">SchoolHUB</h3>
                        <p className="text-lg text-white/80">L'éducation de votre enfant, <br />à portée de main.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParentLogin;
