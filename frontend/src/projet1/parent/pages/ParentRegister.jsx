import React, { useState } from 'react';
import '../styles/theme.css';
import paintedHands from '../assets/painted_handprints.png';

const ParentRegister = ({ onRegister, onNavigateToLogin }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Les mots de passe ne correspondent pas.");
            return;
        }
        onRegister();
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-parent-bg-dark text-white">
            <div className="max-w-4xl w-full flex glass-card overflow-hidden shadow-2xl">
                {/* Left Side: Image/Decor (Hidden on mobile) */}
                <div className="hidden md:block w-1/2 relative">
                    <img
                        src={paintedHands}
                        alt="Join SchoolHub"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-parent-bg-dark/40 backdrop-blur-[2px]"></div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
                        <h3 className="text-4xl font-black mb-4">SchoolHUB</h3>
                        <p className="text-lg text-white/80">Rejoignez notre communauté de parents engagés.</p>
                    </div>
                </div>

                {/* Right Side: Registration Form */}
                <div className="w-full md:w-1/2 p-10 flex flex-col justify-center overflow-y-auto max-h-[90vh]">
                    <div className="mb-8 text-center md:text-left">
                        <h2 className="text-3xl font-bold mb-2">Créer un compte</h2>
                        <p className="text-white/40">Inscrivez-vous pour suivre la scolarité de vos enfants.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold mb-1 text-white/60">Nom complet</label>
                            <input
                                name="fullName"
                                type="text"
                                className="parent-input py-3"
                                placeholder="Jean Dupont"
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold mb-1 text-white/60">Email</label>
                                <input
                                    name="email"
                                    type="email"
                                    className="parent-input py-3"
                                    placeholder="jean@email.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-1 text-white/60">Téléphone</label>
                                <input
                                    name="phone"
                                    type="tel"
                                    className="parent-input py-3"
                                    placeholder="+225 0102030405"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-1 text-white/60">Mot de passe</label>
                            <input
                                name="password"
                                type="password"
                                className="parent-input py-3"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-1 text-white/60">Confirmer le mot de passe</label>
                            <input
                                name="confirmPassword"
                                type="password"
                                className="parent-input py-3"
                                placeholder="••••••••"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="pt-2">
                            <button type="submit" className="parent-btn-primary w-full py-3.5 text-lg font-bold">
                                S'enregistrer
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-white/40">
                            Vous avez déjà un compte ?{' '}
                            <button
                                onClick={onNavigateToLogin}
                                className="text-orange-400 font-semibold hover:underline bg-transparent border-none p-0"
                            >
                                Connectez-vous ici
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParentRegister;
