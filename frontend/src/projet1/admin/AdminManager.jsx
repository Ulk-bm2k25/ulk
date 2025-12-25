import React, { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import AdminLayout from './layout/AdminLayout';
import DashboardPage from './pages/DashboardPage';
import InscriptionsList from './pages/inscriptions/InscriptionsList';
import InscriptionDetail from './pages/inscriptions/InscriptionDetail';
import StudentsList from './pages/eleves/StudentsList';
import StudentProfile from './pages/eleves/StudentProfile';
import StudentCardsPage from './pages/eleves/StudentCardsPage';
import StudentFormModal from './pages/eleves/StudentFormModal';
import ClassesList from './pages/classes/ClassesList';
import ClassDetail from './pages/classes/ClassDetail';
import ClassFormModal from './pages/classes/ClassFormModal';
import AffectationsManager from './pages/classes/AffectationsManager';
import SendNotification from './pages/SendNotification';
import SystemSettings from './pages/SystemSettings';
import DocumentsHistory from './pages/documents/DocumentsHistory';
import { FileText, Users, School, FileCheck, Bell, Settings } from 'lucide-react';

const AdminManager = () => {
  // 1. INITIALISATION INTELLIGENTE
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('auth_token') === 'true' || sessionStorage.getItem('auth_token') === 'true';
  });

  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedInscription, setSelectedInscription] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [isAffectationMode, setIsAffectationMode] = useState(false);
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null)

  // Données initiales pour les classes (MODIFIÉ)
  const [classesData, setClassesData] = useState([
    { id: 1, name: '6ème A', level: 'Collège', root: '6ème', series: null, studentCount: 45, capacity: 50, mainTeacher: 'M. Kpoton' },
    { id: 2, name: '6ème B', level: 'Collège', root: '6ème', series: null, studentCount: 22, capacity: 50, mainTeacher: 'Mme. Bio' },
    { id: 3, name: '3ème A', level: 'Collège', root: '3ème', series: 'A', studentCount: 38, capacity: 40, mainTeacher: 'M. Mensah' }, // Série 'A' pour 3ème
    { id: 4, name: '2nde C', level: 'Lycée', root: '2nde', series: 'C', studentCount: 32, capacity: 35, mainTeacher: 'M. Sossa' },     // Série 'C' pour 2nde
    { id: 5, name: '1ère D', level: 'Lycée', root: '1ère', series: 'D', studentCount: 28, capacity: 35, mainTeacher: 'Mme. Agbo' },     // Série 'D' pour 1ère
    { id: 6, name: 'Tle C', level: 'Lycée', root: 'Terminale', series: 'C', studentCount: 36, capacity: 35, mainTeacher: 'Pr. Zinsou' }, // Série 'C' pour Tle
    { id: 7, name: 'Terminale D', level: 'Lycée', root: 'Terminale', series: 'D', studentCount: 30, capacity: 35, mainTeacher: 'Mme. Dupont' }, // Ajout pour Amina
    { id: 8, name: '1ère A', level: 'Lycée', root: '1ère', series: 'A', studentCount: 25, capacity: 35, mainTeacher: 'M. Petit' },     // Ajout pour Lucas
    { id: 9, name: '2nde B', level: 'Lycée', root: '2nde', series: 'B', studentCount: 28, capacity: 35, mainTeacher: 'Mme. Duval' },     // Ajout pour Lina
  ]);


  // Données initiales pour les inscriptions (MODIFIÉ)
  const [inscriptions, setInscriptions] = useState([
    { id: 'INS-2025-042', firstName: 'Jean', lastName: 'Dupont', class: '2nde C', date: '19 Déc 2025', status: 'pending', payment: 'partial', docs: 'complete', email: 'p.dupont@email.com' },
    { id: 'INS-2025-041', firstName: 'Amina', lastName: 'Kone', class: 'Terminale D', date: '18 Déc 2025', status: 'pending', payment: 'paid', docs: 'complete', email: 'kone.famille@email.com' },
    { id: 'INS-2025-039', firstName: 'Lucas', lastName: 'Martin', class: '1ère A', date: '15 Déc 2025', status: 'rejected', payment: 'unpaid', docs: 'missing', email: 'lucas.m@email.com' },
    { id: 'INS-2025-038', firstName: 'Sarah', lastName: 'Bensoussan', class: '6ème A', date: '14 Déc 2025', status: 'pending', payment: 'paid', docs: 'missing', email: 's.bensoussan@email.com' },
    { id: 'INS-2025-035', firstName: 'Marc', lastName: 'Evan', class: '3ème A', date: '10 Déc 2025', status: 'pending', payment: 'paid', docs: 'complete', email: 'marc.e@email.com' },
  ]);

  // Données initiales pour les élèves (MODIFIÉ)
  const [studentsData, setStudentsData] = useState([
    { id: 'MAT-25-041', firstName: 'Amina', lastName: 'Kone', class: 'Terminale D', gender: 'F', parent: 'Mme Kone', phone: '96554433', status: 'active', level: 'Lycée', birthDate: '03/08/2009' },
    { id: 'MAT-25-035', firstName: 'Marc', lastName: 'Evan', class: '3ème A', gender: 'M', parent: 'Luc Evan', phone: '94778899', status: 'active', level: 'Collège', birthDate: '20/01/2013' },
    { id: 'MAT-25-028', firstName: 'Lina', lastName: 'Sow', class: '2nde B', gender: 'F', parent: 'M. Sow', phone: '91234567', status: 'excluded', level: 'Lycée', birthDate: '11/11/2008' },
  ]);

  // 2. MODIFICATION DE LA FONCTION LOGIN
  // Elle accepte maintenant le paramètre "rememberMe"
  const handleLogin = (rememberMe = false) => {
    setIsAuthenticated(true);

    // Si "Se souvenir de moi", on stocke dans localStorage (persistant même après fermeture)
    // Sinon, on stocke dans sessionStorage (persistant au refresh, mais effacé à la fermeture)
    if (rememberMe) {
      localStorage.setItem('auth_token', 'true');
    } else {
      sessionStorage.setItem('auth_token', 'true');
    }
  };

  // 3. MODIFICATION DU LOGOUT
  // On nettoie tout
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('auth_token');
    sessionStorage.removeItem('auth_token');
    setCurrentPage('dashboard');
    setSelectedInscription(null);
    setSelectedStudent(null);
    setSelectedClass(null);
    setIsAffectationMode(false);
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
    setSelectedInscription(null);
    setSelectedStudent(null);
    setSelectedClass(null);
    setIsAffectationMode(false);
  };

  const handleViewInscriptionDetails = (inscriptionData) => {
    // On s'assure de passer l'objet le plus à jour venant du state
    const freshData = inscriptions.find(i => i.id === inscriptionData.id) || inscriptionData;
    setSelectedInscription(freshData);
  };

  const handleBackToInscriptionsList = () => {
    setSelectedInscription(null);
  };

  // --- NOUVEAU : Logique de validation ---
  const handleValidateInscription = (id) => {
    const inscription = inscriptions.find(i => i.id === id);
    if (!inscription) return;

    setInscriptions(prev => prev.map(item =>
      item.id === id ? { ...item, status: 'validated' } : item
    ));

    const newStudent = {
      id: `MAT-25-${id.split('-')[2]}`, 
      firstName: inscription.firstName,
      lastName: inscription.lastName,
      class: inscription.class, // La classe est déjà le nom complet ex: "2nde C"
      gender: 'M', // Par défaut pour la démo
      parent: inscription.lastName + ' Parent',
      phone: '0102030405',
      status: 'active',
      level: inscription.class.includes('ème') || inscription.class.includes('CM') ? 'Collège' : 'Lycée', // Adapter la détection du niveau
      birthDate: '01/01/2010'
    };

    setStudentsData(prev => [...prev, newStudent]); // Correction de la variable ici aussi
    setSelectedInscription(null);
  };

  const handleRejectInscription = (id) => {
    setInscriptions(prev => prev.map(item =>
      item.id === id ? { ...item, status: 'rejected' } : item
    ));
    setSelectedInscription(null);
  };

  const handleDeleteInscription = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette demande d'inscription ?")) {
      setInscriptions(prev => prev.filter(item => item.id !== id));
      alert("Inscription supprimée avec succès.");
    }
  };

  //FONCTION DE RELANCE (Simulation)
  const handleRelanceInscription = (inscription) => {
    alert(`Un email de relance a été envoyé à ${inscription.email} pour compléter son dossier.`);
  };


  // --- LOGIQUE CLASSES (CRUD & NOMMAGE AUTO) ---
  const handleSaveClass = (classForm) => {
    // 1. Construction du nom de base (Ex: "2nde C" ou "6ème")
    let baseName = `${classForm.root} ${classForm.series || ''}`.trim();
    
    // 2. Algorithme de nommage unique (Ex: 2nde C -> 2nde C2 -> 2nde C3)
    let finalName = baseName;
    let counter = 2; // On commence à incrémenter à partir de 2

    // On récupère toutes les classes SAUF celle qu'on est en train de modifier (si édition)
    const otherClasses = editingClass 
        ? classesData.filter(c => c.id !== editingClass.id)
        : classesData;

    // Tant qu'une classe porte ce nom, on incrémente
    while (otherClasses.some(c => c.name === finalName)) {
        finalName = `${baseName}${counter}`; // Ex: 2nde C2
        counter++;
    }

    // 3. Construction de l'objet final
    const finalClassData = {
        ...classForm,
        name: finalName, // On force le nom calculé
        series: classForm.series || null // Nettoyage si vide
    };

    if (editingClass) {
      // UPDATE
      setClassesData(prev => prev.map(c => 
        c.id === editingClass.id 
          ? { ...finalClassData, id: editingClass.id, studentCount: c.studentCount } 
          : c
      ));
      alert(`Classe mise à jour : ${finalName}`);
    } else {
      // CREATE
      const newClass = { 
          ...finalClassData, 
          id: Date.now(), 
          studentCount: 0 
      };
      setClassesData(prev => [...prev, newClass]);
      alert(`Nouvelle classe créée : ${finalName}`);
    }
    
    setIsClassModalOpen(false);
  };

  // --- LOGIQUE ÉLÈVES (CRUD) ---
  const handleSaveStudent = (studentForm) => {
    if (editingStudent) {
      setStudentsData(prev => prev.map(s => s.id === editingStudent.id ? studentForm : s));
      alert(`Dossier de ${studentForm.firstName} mis à jour !`);
    } else {
      setStudentsData(prev => [studentForm, ...prev]);
      alert(`Nouvel élève inscrit : ${studentForm.firstName} ${studentForm.lastName}`);
    }
    setIsStudentModalOpen(false);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage onNavigate={handleNavigate} />;

      case 'inscriptions':
        if (selectedInscription) {
          // On s'assure de passer l'objet le plus à jour
          const currentInscription = inscriptions.find(i => i.id === selectedInscription.id);
          return (
            <InscriptionDetail
              data={currentInscription}
              onBack={handleBackToInscriptionsList}
              onValidate={handleValidateInscription}
              onReject={handleRejectInscription}
              onNavigate={handleNavigate}
            />
          );
        }
        return (
          <InscriptionsList
            inscriptions={inscriptions}
            onViewDetails={handleViewInscriptionDetails}
            onQuickValidate={handleValidateInscription}
            onDelete={handleDeleteInscription}
            onRelance={handleRelanceInscription}
          />
        );

      case 'eleves':
        if (selectedStudent) {
          return <StudentProfile student={selectedStudent} onBack={() => setSelectedStudent(null)} />;
        }
        return (
          <StudentsList
            students={studentsData} // On passe le state centralisé
            onViewProfile={(student) => setSelectedStudent(student)}
            onNavigate={handleNavigate}
            // On passe les handlers pour le modal
            onAddStudent={() => {
                setEditingStudent(null);
                setIsStudentModalOpen(true);
            }}
            onEditStudent={(student) => {
                setEditingStudent(student);
                setIsStudentModalOpen(true);
            }}
          />
        );

      case 'classes':
        if (isAffectationMode) return <AffectationsManager onBack={() => setIsAffectationMode(false)} />;
        if (selectedClass) {
            return (
                <ClassDetail 
                   classData={selectedClass} 
                   onBack={() => setSelectedClass(null)} 
                   onEdit={(cls) => {
                       setEditingClass(cls);
                       setIsClassModalOpen(true);
                   }}
                />
            );
        }
        return (
          <ClassesList
            classes={classesData} // IMPORTANT : ClassesList doit accepter cette prop maintenant !
            onViewDetails={(cls) => setSelectedClass(cls)}
            onManageAffectations={() => setIsAffectationMode(true)}
            onAddClass={() => {
              setEditingClass(null);
              setIsClassModalOpen(true);
            }}
          />
        );
        
      case 'cartes':
        return <StudentCardsPage students={studentsData} />;
      case 'documents':
        return <DocumentsHistory />;
      case 'notifications':
        return <SendNotification />;
      case 'parametres':
        return <SystemSettings />;
      default:
        return <DashboardPage />;
    }
  };

  if (!isAuthenticated) return <LoginPage onLogin={handleLogin} />;

  return (
    <>
      <AdminLayout
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      >
        {renderPage()}
      </AdminLayout>

      {/* MODAL CLASSE */}
      <ClassFormModal
        isOpen={isClassModalOpen}
        onClose={() => setIsClassModalOpen(false)}
        initialData={editingClass}
        onSubmit={handleSaveClass} // On branche la fonction CRUD
      />

      {/* MODAL ÉLÈVE (NOUVEAU) */}
      <StudentFormModal
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
        initialData={editingStudent}
        availableClasses={classesData}
        onSubmit={handleSaveStudent} // On branche la fonction CRUD
      />
    </>
  );
};

export default AdminManager;