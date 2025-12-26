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
import api from '../../api';
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
  const [teachersData, setTeachersData] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // FETCH DATA FROM API
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [inscResponse, classResponse, teachResponse, studResponse, statsResponse] = await Promise.all([
          api.get('/admin/inscriptions'),
          api.get('/classes'),
          api.get('/admin/teachers'),
          api.get('/admin/students'),
          api.get('/admin/dashboard/stats')
        ]);
        setInscriptions(inscResponse.data.inscriptions);
        setClassesData(classResponse.data);
        setTeachersData((teachResponse.data.teachers || []).map(t => ({
          ...t,
          nom: t.user?.nom || t.nom,
          prenom: t.user?.prenom || t.prenom,
          fullName: `${t.user?.nom || t.nom} ${t.user?.prenom || t.prenom}`
        })));
        setStudentsData((studResponse.data.students || []).map(s => ({
          ...s,
          lastName: s.user?.nom || '',
          firstName: s.user?.prenom || '',
          class: s.classe?.nom || 'N/A',
          gender: s.sexe || '?',
          parent: s.parent_nom || 'Parent',
          phone: s.parent_phone || 'N/A',
          status: 'active' // Default for now
        })));
        setDashboardStats(statsResponse.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch admin data", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated]);

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

  // --- NOUVEAU : Logique de validation réelle ---
  const handleValidateInscription = async (id) => {
    try {
      const response = await api.patch(`/admin/inscriptions/${id}/status`, { statut: 'inscrit' });
      setInscriptions(prev => prev.map(item =>
        item.id === id ? response.data.inscription : item
      ));
      alert("Inscription validée avec succès !");
      setSelectedInscription(null);
    } catch (error) {
      alert("Erreur lors de la validation");
    }
  };

  const handleRejectInscription = async (id) => {
    if (!window.confirm("Voulez-vous vraiment rejeter cette inscription ?")) return;
    try {
      const response = await api.patch(`/admin/inscriptions/${id}/status`, { statut: 'rejete' });
      setInscriptions(prev => prev.map(item =>
        item.id === id ? response.data.inscription : item
      ));
      alert("Inscription rejetée.");
      setSelectedInscription(null);
    } catch (error) {
      alert("Erreur lors du rejet");
    }
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


  // --- LOGIQUE CLASSES REELLE ---
  const handleSaveClass = async (classForm) => {
    try {
      let response;
      if (editingClass) {
        response = await api.patch(`/classes/${editingClass.id}`, classForm);
        setClassesData(prev => prev.map(c => c.id === editingClass.id ? response.data : c));
        alert("Classe mise à jour avec succès !");
      } else {
        response = await api.post('/classes', classForm);
        setClassesData(prev => [...prev, response.data]);
        alert("Nouvelle classe créée !");
      }
      setIsClassModalOpen(false);
    } catch (error) {
      alert("Erreur lors de l'enregistrement de la classe");
    }
  };

  const handleDeleteClass = async (id) => {
    if (!window.confirm("Supprimer cette classe ?")) return;
    try {
      await api.delete(`/classes/${id}`);
      setClassesData(prev => prev.filter(c => c.id !== id));
      alert("Classe supprimée.");
    } catch (error) {
      alert("Erreur lors de la suppression");
    }
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
        return <DashboardPage onNavigate={handleNavigate} inscriptions={inscriptions} stats={dashboardStats} />;

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
            classes={classesData}
            onViewDetails={(cls) => setSelectedClass(cls)}
            onManageAffectations={() => setIsAffectationMode(true)}
            onAddClass={() => {
              setEditingClass(null);
              setIsClassModalOpen(true);
            }}
            onEditClass={(cls) => {
              setEditingClass(cls);
              setIsClassModalOpen(true);
            }}
            onDeleteClass={handleDeleteClass}
          />
        );

      case 'cartes':
        return <StudentCardsPage students={studentsData} />;
      case 'documents':
        return <DocumentsHistory />;
      case 'notifications':
        return <SendNotification classes={classesData} students={studentsData} />;
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