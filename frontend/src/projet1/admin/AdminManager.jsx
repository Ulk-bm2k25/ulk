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

  const [inscriptions, setInscriptions] = useState([
    { id: 'INS-2025-042', firstName: 'Jean', lastName: 'Dupont', class: '2nde C', date: '19 Déc 2025', status: 'pending', payment: 'partial', docs: 'complete', email: 'p.dupont@email.com' },
    { id: 'INS-2025-041', firstName: 'Amina', lastName: 'Kone', class: 'Terminale D', date: '18 Déc 2025', status: 'pending', payment: 'paid', docs: 'complete', email: 'kone.famille@email.com' },
    { id: 'INS-2025-039', firstName: 'Lucas', lastName: 'Martin', class: '1ère A', date: '15 Déc 2025', status: 'rejected', payment: 'unpaid', docs: 'missing', email: 'lucas.m@email.com' },
    { id: 'INS-2025-038', firstName: 'Sarah', lastName: 'Bensoussan', class: '4ème E', date: '14 Déc 2025', status: 'pending', payment: 'paid', docs: 'missing', email: 's.bensoussan@email.com' },
    { id: 'INS-2025-035', firstName: 'Marc', lastName: 'Evan', class: '3ème A', date: '10 Déc 2025', status: 'pending', payment: 'paid', docs: 'complete', email: 'marc.e@email.com' },
  ]);

  const [studentsData, setStudentsData] = useState([
    { id: 'MAT-25-041', firstName: 'Amina', lastName: 'Kone', class: 'Terminale D', gender: 'F', parent: 'Mme Kone', phone: '96554433', status: 'active', level: 'Lycée', birthDate: '03/08/2009' },
    { id: 'MAT-25-035', firstName: 'Marc', lastName: 'Evan', class: '3ème A', gender: 'M', parent: 'Luc Evan', phone: '94778899', status: 'active', level: 'Collège', birthDate: '20/01/2013' },
    { id: 'MAT-25-028', firstName: 'Lina', lastName: 'Sow', class: '2nde B', gender: 'F', parent: 'M. Sow', phone: '91234567', status: 'excluded', level: 'Lycée', birthDate: '11/11/2008' },
  ]);

  const [classesData, setClassesData] = useState([
    { id: 1, name: '4ème E', level: 'Collège', root: '4ème', series: 'E', studentCount: 45, capacity: 50, mainTeacher: 'M. Kpoton' },
    { id: 2, name: '4ème E2', level: 'Collège', root: '4ème', series: 'E', studentCount: 22, capacity: 50, mainTeacher: 'Mme. Bio' },
    { id: 3, name: '3ème A', level: 'Collège', root: '3ème', series: 'A', studentCount: 38, capacity: 40, mainTeacher: 'M. Mensah' },
    { id: 4, name: '2nde C', level: 'Lycée', root: '2nde', series: 'C', studentCount: 32, capacity: 35, mainTeacher: 'M. Sossa' },
    { id: 5, name: '1ère D', level: 'Lycée', root: '1ère', series: 'D', studentCount: 28, capacity: 35, mainTeacher: 'Mme. Agbo' },
    { id: 6, name: 'Tle C', level: 'Lycée', root: 'Terminale', series: 'C', studentCount: 36, capacity: 35, mainTeacher: 'Pr. Zinsou' },
  ]);

  const handleLogin = (token, rememberMe = false) => {
    setIsAuthenticated(true);
    if (rememberMe) localStorage.setItem('token', token);
    else sessionStorage.setItem('token', token);
  };

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
    const freshData = inscriptions.find(i => i.id === inscriptionData.id) || inscriptionData;
    setSelectedInscription(freshData);
  };

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
      class: inscription.class,
      gender: 'M',
      parent: inscription.lastName + ' Parent',
      phone: '0102030405',
      status: 'active',
      level: inscription.class.includes('ème') || inscription.class.includes('CM') ? 'Collège' : 'Lycée',
      birthDate: '01/01/2010'
    };

    setStudentsData(prev => [...prev, newStudent]);
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
      alert("Inscription supprimée.");
    }
  };

  const handleRelanceInscription = (inscription) => {
    alert(`Relance envoyée à ${inscription.email}.`);
  };

  // Logique Classes
  const handleSaveClass = (classForm) => {
    let baseName = `${classForm.root} ${classForm.series || ''}`.trim();
    let finalName = baseName;
    let counter = 2;
    const otherClasses = editingClass ? classesData.filter(c => c.id !== editingClass.id) : classesData;

    while (otherClasses.some(c => c.name === finalName)) {
      finalName = `${baseName}${counter}`;
      counter++;
    }

    const finalClassData = { ...classForm, name: finalName, series: classForm.series || null };

    if (editingClass) {
      setClassesData(prev => prev.map(c => c.id === editingClass.id ? { ...finalClassData, id: editingClass.id, studentCount: c.studentCount } : c));
      alert(`Classe mise à jour : ${finalName}`);
    } else {
      const newClass = { ...finalClassData, id: Date.now(), studentCount: 0 };
      setClassesData(prev => [...prev, newClass]);
      alert(`Classe créée : ${finalName}`);
    }
    setIsClassModalOpen(false);
  };

  // Logique Élèves
  const handleSaveStudent = (studentForm) => {
    if (editingStudent) {
      setStudentsData(prev => prev.map(s => s.id === editingStudent.id ? studentForm : s));
      alert(`Dossier de ${studentForm.firstName} mis à jour !`);
    } else {
      setStudentsData(prev => [studentForm, ...prev]);
      alert(`Nouvel élève inscrit : ${studentForm.firstName}`);
    }
    setIsStudentModalOpen(false);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <DashboardPage onNavigate={handleNavigate} />;

      case 'inscriptions':
        if (selectedInscription) {
          const currentInscription = inscriptions.find(i => i.id === selectedInscription.id);
          return <InscriptionDetail data={currentInscription} onBack={() => setSelectedInscription(null)} onValidate={handleValidateInscription} onReject={handleRejectInscription} onNavigate={handleNavigate} />;
        }
        return <InscriptionsList inscriptions={inscriptions} onViewDetails={handleViewInscriptionDetails} onQuickValidate={handleValidateInscription} onDelete={handleDeleteInscription} onRelance={handleRelanceInscription} />;

      case 'eleves':
        if (selectedStudent) return <StudentProfile student={selectedStudent} onBack={() => setSelectedStudent(null)} />;
        return <StudentsList
          students={studentsData}
          classes={classesData} // Passage essentiel pour MoveStudentModal
          onViewProfile={setSelectedStudent}
          onNavigate={handleNavigate}
          onAddStudent={() => { setEditingStudent(null); setIsStudentModalOpen(true); }}
          onEditStudent={(s) => { setEditingStudent(s); setIsStudentModalOpen(true); }}
          onDelete={(id) => setStudentsData(prev => prev.filter(s => s.id !== id))}
        />;

      case 'classes':
        if (isAffectationMode) return <AffectationsManager onBack={() => setIsAffectationMode(false)} />;
        if (selectedClass) return <ClassDetail classData={selectedClass} students={studentsData} onBack={() => setSelectedClass(null)} onEdit={(cls) => { setEditingClass(cls); setIsClassModalOpen(true); }} />;
        return <ClassesList classes={classesData} onViewDetails={setSelectedClass} onManageAffectations={() => setIsAffectationMode(true)} onAddClass={() => { setEditingClass(null); setIsClassModalOpen(true); }} />;

      case 'cartes': return <StudentCardsPage students={studentsData} />;

      case 'documents': return <DocumentsHistory />;

      case 'notifications': return <SendNotification availableClasses={classesData} />;

      case 'parametres': return <SystemSettings />;
      
      default: return <DashboardPage />;
    }
  };

  if (!isAuthenticated) return <LoginPage onLogin={handleLogin} />;

  return (
    <>
      <AdminLayout currentPage={currentPage} onNavigate={handleNavigate} onLogout={handleLogout}>
        {renderPage()}
      </AdminLayout>
      <ClassFormModal isOpen={isClassModalOpen} onClose={() => setIsClassModalOpen(false)} initialData={editingClass} onSubmit={handleSaveClass} />
      <StudentFormModal isOpen={isStudentModalOpen} onClose={() => setIsStudentModalOpen(false)} initialData={editingStudent} availableClasses={classesData} onSubmit={handleSaveStudent} />
    </>
  );
};

export default AdminManager;