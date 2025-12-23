import { Route } from 'react-router-dom'
import AdminManager from './AdminManager'
import ParentManager from '../parent/ParentManager'

const projet1Routes = (
  <>
    <Route path="/projet1/*" element={<AdminManager />} />
    <Route path="/projet1-parent/*" element={<ParentManager />} />
  </>
)

export default projet1Routes;