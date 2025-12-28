// import React from 'react';
// import { NotificationCenter } from './components/notifications/NotificationCenter';
// import './styles/notification.css';

// function App() {
//   return (
//     <div className="app">
//       <header>
//         <h1>School-HUB Notifications</h1>
//         {/* NotificationCenter contient déjà NotificationBell */}
//         <NotificationCenter />
//       </header>
      
//       <main>
//         <div className="container">
//           <h2>Bienvenue dans le système de gestion</h2>
//           <p>Vos notifications s'affichent en haut à droite.</p>
//         </div>
//       </main>
//     </div>
//   );
// }

// export default App;
// 
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

//  Mes import pour le Dashboard 
import AdminLayout from './components/layouts/AdminLayout';
import StudentLayout from './components/layouts/StudentLayout';

//  Mes import pour gestion des frais et tranche 
import StudentScolarite from './pages/student/StudentScolarite';
import StudentRegistration from './pages/student/StudentRegistration';
import MyPayments from './pages/student/MyPayments';
import AcademicYears from './pages/admin/AcademicYear';
import Fees from './pages/admin/Fees';
import FeeTranches from './pages/admin/FeeTranches';


const Projet2App = () => {
  return (
    <Routes>
      {/* Routes pour les Admins dans la Scolarité */}
      <Route path="admin" element={<AdminLayout />}>
         
        <Route index element={<div>Dashboard Admin Scolarité (En cours...)</div>} />

          <Route path="academic-years" element={<AcademicYears />} />
          
          <Route path="fees" element={<Fees />} />

          <Route path="fee-tranches" element={<FeeTranches />} />

         {/* Routes statistique , gestion des remboursement et etc a mettre ici */}
        {/* Ajoute tes pages admin ici */}

          {/* AJOUT DE LA ROUTE ICI */}

          {/* Frais generaux */}
    {/* <Route path="general-frais" element={<Ici tu met le nom et tu importe le nom vers la ou se trouve le fichier />} /> 
              Remboursement cote admin 
          <Route path="" element={<idem />} />
             statistique 
           <Route path="stats" element={<idem />} /> */}
      </Route>

      {/* Routes pour les Étudiants / Parents */}
      <Route path="student" element={<StudentLayout />}>

        <Route index element={<Navigate to="scolarite" replace />} />

        <Route path="frais-d'inscription" element={<StudentRegistration />} />

        <Route path="scolarite" element={<StudentScolarite />} />

        <Route path="my-payments" element={<MyPayments />} />
      </Route>
    </Routes>
  );
};

export default Projet2App;