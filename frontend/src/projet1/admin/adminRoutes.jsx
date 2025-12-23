import { Route } from 'react-router-dom'
import AdminManager from './admin/AdminManager'
import ParentManager from './parent/ParentManager'

const adminRoutes = (
  <>
    <Route path="/projet1/*" element={<AdminManager />} />
    <Route path="/projet1-parent" element={<ParentManager />} />
  </>
)

export default adminRoutes;