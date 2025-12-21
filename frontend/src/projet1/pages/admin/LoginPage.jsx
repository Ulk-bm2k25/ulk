import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onLogin();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-dark p-4 font-sans">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        
        {/* Header de la carte */}
        <div className="p-8 pb-6 text-center">
          <div className="inline-flex justify-center items-center mb-6">
            <div className="h-12 w-12 bg-orange-100 rounded-xl flex items-center justify-center text-brand-primary mb-2">
                <Lock size={24} />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-brand-dark tracking-tight">
            École<span className="text-brand-primary">+</span>
          </h1>
          <p className="text-slate-500 mt-2">Connectez-vous à votre espace d'administration</p>
        </div>

        {/* Formulaire */}
        <div className="p-8 pt-0">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Champ Email */}
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
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg text-slate-900 bg-slate-50 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-all duration-200 ${
                    errors.email 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                      : 'border-slate-200 focus:border-brand-primary focus:ring-orange-100'
                  }`}
                  placeholder="admin@ecole.com"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs font-medium pl-1">{errors.email}</p>
              )}
            </div>

            {/* Champ Mot de passe */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-semibold text-slate-700">
                  Mot de passe
                </label>
                <a href="#" className="text-sm font-medium text-brand-primary hover:text-orange-600 transition-colors">
                  Oublié ?
                </a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-primary transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`block w-full pl-10 pr-10 py-3 border rounded-lg text-slate-900 bg-slate-50 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-all duration-200 ${
                    errors.password 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                      : 'border-slate-200 focus:border-brand-primary focus:ring-orange-100'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs font-medium pl-1">{errors.password}</p>
              )}
            </div>

            {/* Bouton de soumission */}
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-brand-primary hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-all duration-200 transform hover:-translate-y-0.5"
            >
              Se connecter
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-slate-400">
              © 2025 École+ Management System. Tous droits réservés.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;