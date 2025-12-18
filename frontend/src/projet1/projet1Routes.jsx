import { Route } from 'react-router-dom'
import App from './App'
// Import des pages du projet 1 (à venir)
// import HomePage from './pages/HomePage'

const projet1Routes = (
  <>
    <Route path="/projet1/*" element={<App />} />
    {/* <Route path="/projet1" element={<HomePage />} /> */}
    {/* Autres routes du projet 1... */}
  </>
)

export default projet1Routes