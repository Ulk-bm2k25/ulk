import { BrowserRouter, Routes, Route } from 'react-router-dom'
import adminRoutes from './projet1/admin/adminRoutes'

// Import futur des routes par projet
// import projet1Routes from './projet1/routes'
// import projet2Routes from './projet2/routes'
// etc.

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route d'accueil globale (optionnelle) */}
        <Route path="/" element={<div>Accueil plateforme</div>} />
        {adminRoutes}

        
        {/* Les routes des projets seront montées ici */}
        {/* {projet1Routes} */}
        {/* {projet2Routes} */}
      </Routes>
    </BrowserRouter>
  )
}

export default App