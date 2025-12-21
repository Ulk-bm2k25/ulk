import React, { useState } from 'react';
import '../styles/theme.css';

const ParentLogin = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onLogin();
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-parent-bg-dark">
            <div className="max-w-4xl w-full flex glass-card overflow-hidden shadow-2xl">
                {/* Left Side: Login Form */}
                <div className="w-full md:w-1/2 p-12 flex flex-col justify-center">
                    <div className="mb-10">
                        <h2 className="text-3xl font-bold mb-2">Bon retour !</h2>
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
                            <input
                                type="password"
                                className="parent-input"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <input type="checkbox" id="remember" className="rounded border-white/20 bg-white/5" />
                            <label htmlFor="remember" className="text-sm text-white/60">Se souvenir de moi</label>
                        </div>

                        <button type="submit" className="parent-btn-primary w-full py-4 text-lg">
                            Se connecter
                        </button>
                    </form>

                    <div className="mt-10 text-center">
                        <p className="text-sm text-white/40">
                            Pas encore de compte ? <a href="#" className="text-orange-400 font-semibold hover:underline">Inscrivez votre enfant</a>
                        </p>
                    </div>
                </div>

                {/* Right Side: Image/Decor */}
                <div className="hidden md:block w-1/2 relative">
                    <img
                        src="https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
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
