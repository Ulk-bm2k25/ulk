import { Route } from 'react-router-dom'
import App from './App'
import ParentManager from './parent/ParentManager'

const projet1Routes = (
  <>
    <Route path="/projet1/*" element={<App />} />
    <Route path="/projet1-parent" element={<ParentManager />} />
  </>
)

export default projet1Routes