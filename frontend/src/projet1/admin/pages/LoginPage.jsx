import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, ArrowLeft, Loader2, Check } from 'lucide-react';
import api from '@/api';

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false); // 1. État pour la checkbox
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email invalide';
    }
    if (!password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      try {
        // Appel API réel
        const response = await api.post('/login', { email, password });
        // Vérification basique du rôle (le backend doit aussi le faire, mais on filtre ici)
        if (response.data.user.role !== 'ADMIN' && response.data.user.role !== 'RESPONSABLE') {
          throw new Error("Accès interdit: Ce compte n'est pas administrateur.");
        }

        onLogin(response.data.token, response.data.user, rememberMe);
      } catch (error) {
        setIsLoading(false);
        const msg = error.response?.data?.message || error.message || "Erreur de connexion serveur.";
        setErrors({ general: msg });
      }
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
            School-hub Admin
          </h1>
          <p className="text-slate-500 mt-2">Connectez-vous à votre espace d'administration</p>
        </div>

        <div className="p-8 pt-0">
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
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg text-slate-900 bg-slate-50 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-all duration-200 ${errors.email
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                    : 'border-slate-200 focus:border-brand-primary focus:ring-orange-100'
                    } ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  placeholder="admin@ecole.com"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs font-medium pl-1">{errors.email}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-700">
                Mot de passe
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-primary transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className={`block w-full pl-10 pr-10 py-3 border rounded-lg text-slate-900 bg-slate-50 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-all duration-200 ${errors.password
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                    : 'border-slate-200 focus:border-brand-primary focus:ring-orange-100'
                    } ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors focus:outline-none disabled:opacity-50"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs font-medium pl-1">{errors.password}</p>
              )}
            </div>

            {/* 3. Zone "Se souvenir de moi" et "Mdp oublié" */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${rememberMe
                  ? 'bg-brand-primary border-brand-primary text-white'
                  : 'border-slate-300 bg-white group-hover:border-brand-primary'
                  }`}>
                  {rememberMe && <Check size={14} strokeWidth={3} />}
                </div>
                <input
                  type="checkbox"
                  className="hidden"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="text-sm text-slate-600 font-medium">Se souvenir de moi</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white transition-all duration-200 ${isLoading
                ? 'bg-brand-primary/70 cursor-wait'
                : 'bg-brand-primary hover:bg-orange-600 hover:-translate-y-0.5'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary`}
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin mr-2" />
                  Connexion...
                </>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-slate-400">
              © 2025 School-hub Management System. Tous droits réservés.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;