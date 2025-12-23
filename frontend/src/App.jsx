// 1. AJOUTER 'Link' DANS LES IMPORTS
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import projet1Routes from './projet1/projet1Routes'

// Simple Landing Page for development
const Home = () => (
  <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-[#1a2035] text-white">
    <div className="max-w-md w-full glass-card p-10 text-center space-y-8">
      {/* ... Le reste du contenu Home est parfait ... */}
      <div className="w-20 h-20 bg-[#eb8e3a] rounded-2xl flex items-center justify-center mx-auto text-[#1a2035]">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
      </div>
      <h1 className="text-4xl font-black">School<span className="text-[#eb8e3a]">Hub</span></h1>
      <p className="text-white/40">Bienvenue sur la plateforme de gestion scolaire.</p>

      <div className="space-y-4 pt-4">
        {/* Ces Links fonctionneront maintenant */}
        <Link
          to="/projet1-parent"
          className="block w-full py-4 px-6 bg-[#eb8e3a] text-[#1a2035] font-bold rounded-2xl hover:opacity-90 transition-all shadow-lg shadow-orange-950/20"
        >
          Accéder à l'Espace Parent
        </Link>
        <Link
          to="/projet1"
          className="block w-full py-4 px-6 bg-white/5 text-white font-bold rounded-2xl hover:bg-white/10 transition-all border border-white/5"
        >
          Portail Administration
        </Link>
      </div>
    </div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        
        {/* Injection des routes du projet 1 */}
        {projet1Routes}
      </Routes>
    </BrowserRouter>
  )
}

export default App