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
    return localStorage.getItem('token') !== null || sessionStorage.getItem('token') !== null;
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

  // Données initiales (Vides pour l'intégration Backend)
  const [inscriptions, setInscriptions] = useState([]);
  const [classesData, setClassesData] = useState([]);
  const [studentsData, setStudentsData] = useState([]);

  // 2. MODIFICATION DE LA FONCTION LOGIN
  const handleLogin = (token, rememberMe = false) => {
    setIsAuthenticated(true);

    if (rememberMe) {
      localStorage.setItem('token', token);
    } else {
      sessionStorage.setItem('token', token);
    }
  };

  // 3. MODIFICATION DU LOGOUT
  // On nettoie tout
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
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