import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send, CheckCircle, Lock } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulation d'envoi API
    setTimeout(() => setIsSubmitted(true), 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4 relative">
      {/* Bouton Retour */}
      <Link to="/login" className="absolute top-6 left-6 flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
        <ArrowLeft size={20} />
        <span className="font-medium text-sm hidden sm:inline">Retour à la connexion</span>
      </Link>

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        <div className="p-8 text-center">
          <div className="inline-flex justify-center items-center mb-6">
            <div className="h-12 w-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 mb-2">
              {isSubmitted ? <CheckCircle size={24} /> : <Lock size={24} />}
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-slate-900">
            {isSubmitted ? 'Email envoyé !' : 'Mot de passe oublié ?'}
          </h1>
          <p className="text-slate-500 mt-2 text-sm">
            {isSubmitted 
              ? `Un lien de réinitialisation a été envoyé à ${email}.` 
              : "Entrez votre email professionnel pour recevoir les instructions de réinitialisation."}
          </p>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="p-8 pt-0 space-y-5">
            <div className="space-y-1.5">
              <label className="block text-sm font-bold text-slate-700">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-slate-900"
                  placeholder="admin@ecole.com"
                />
              </div>
            </div>

            <button type="submit" className="w-full flex items-center justify-center gap-2 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-bold transition-all shadow-lg shadow-orange-500/20">
              <Send size={18} />
              Envoyer le lien
            </button>
          </form>
        ) : (
          <div className="p-8 pt-0">
            <button onClick={() => setIsSubmitted(false)} className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold transition-all">
              Renvoyer un email
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;