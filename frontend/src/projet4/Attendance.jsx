import React, { useState, useEffect } from 'react';
import './attendance-styles.css';

function Attendance({ initialClassId, classesList }) {
  const [currentClass, setCurrentClass] = useState(initialClassId || 1);
  const [currentCourse, setCurrentCourse] = useState('Mathématiques');
  const [attendanceData, setAttendanceData] = useState([]);
  const [courses, setCourses] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Configuration de l'API
  const API_BASE_URL = 'http://localhost:8000/api';

  const getAuthToken = () => localStorage.getItem('token');

  const getHeaders = () => {
    const token = getAuthToken();
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  };

  // Charger les données au montage ou quand la classe/date change
  useEffect(() => {
    fetchAttendanceData();
    fetchCoursesOfDay();
  }, [currentClass, selectedDate]);

  const fetchAttendanceData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/presence/list?classe_id=${currentClass}&date=${selectedDate}`,
        { headers: getHeaders() }
      );
      if (!response.ok) throw new Error('Erreur chargement présences');
      const data = await response.json();
      
      setAttendanceData(data.eleves?.map(e => ({
        id: e.eleve_id,
        name: e.nom,
        present: e.present === true,
        absences: e.absences_count || 0,
        parentEmail: e.parent_email,
        parentPhone: e.parent_phone
      })) || []);
    } catch (err) {
      console.error(err);
      addNotification('Erreur lors du chargement des élèves', 'warning');
    } finally {
      setLoading(false);
    }
  };

  const fetchCoursesOfDay = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/presence/courses-of-day?classe_id=${currentClass}&date=${selectedDate}`,
        { headers: getHeaders() }
      );
      if (!response.ok) throw new Error('Erreur chargement cours');
      const data = await response.json();
      setCourses(data.courses || []);
      if (data.courses && data.courses.length > 0) {
        setCurrentCourse(data.courses[0].subject);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleAttendance = async (studentId) => {
    const student = attendanceData.find(s => s.id === studentId);
    const newPresentState = !student.present;

    try {
      const response = await fetch(`${API_BASE_URL}/presence/mark`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          eleve_id: studentId,
          classe_id: currentClass,
          present: newPresentState,
          date: selectedDate
        })
      });

      if (!response.ok) throw new Error('Erreur enregistrement');

      setAttendanceData(prev =>
        prev.map(s => s.id === studentId ? { ...s, present: newPresentState } : s)
      );

      if (!newPresentState) {
        addNotification(`Absence enregistrée pour ${student.name}`, 'warning');
      }
    } catch (err) {
      console.error(err);
      addNotification('Erreur lors de l\'enregistrement', 'warning');
    }
  };

  const markAllPresent = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/presence/mark-all`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          classe_id: currentClass,
          date: selectedDate,
          status: 'present'
        })
      });

      if (!response.ok) throw new Error('Erreur');

      setAttendanceData(prev => prev.map(s => ({ ...s, present: true })));
      addNotification('Tous les élèves marqués présents', 'success');
    } catch (err) {
      addNotification('Erreur', 'warning');
    }
  };

  const markAllAbsent = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/presence/mark-all`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          classe_id: currentClass,
          date: selectedDate,
          status: 'absent'
        })
      });

      if (!response.ok) throw new Error('Erreur');

      setAttendanceData(prev => prev.map(s => ({ ...s, present: false })));
      addNotification('Tous les élèves marqués absents', 'warning');
    } catch (err) {
      addNotification('Erreur', 'warning');
    }
  };

  const sendParentNotification = async (student, type) => {
    try {
      const response = await fetch(`${API_BASE_URL}/presence/notify`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          eleve_id: student.id,
          date: selectedDate,
          type: type
        })
      });

      if (!response.ok) throw new Error('Erreur notification');
      addNotification(`Notification envoyée aux parents de ${student.name}`, 'info');
    } catch (err) {
      console.error(err);
      addNotification('Erreur lors de l\'envoi de la notification', 'warning');
    }
  };

  const addNotification = (message, type) => {
    const newNotification = {
      id: Date.now(),
      message,
      type,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const currentClassName = classesList?.find(c => c.id === currentClass)?.nom || 'Classe';

  return (
    <div className="attendance-marking">
      <div className="section-header">
        <h2>Marquage de Présence</h2>
        <div className="course-selector">
          <div className="selector-group">
            <span className="selector-label">Cours:</span>
            <select value={currentCourse} onChange={(e) => setCurrentCourse(e.target.value)}>
              {courses.length > 0 ? (
                courses.map((course, idx) => (
                  <option key={idx} value={course.subject}>{course.subject}</option>
                ))
              ) : (
                <option value="">Aucun cours</option>
              )}
            </select>
          </div>
          <div className="selector-group">
            <span className="selector-label">Classe:</span>
            <select value={currentClass} onChange={(e) => setCurrentClass(Number(e.target.value))}>
              {classesList?.map(cls => (
                <option key={cls.id} value={cls.id}>{cls.nom}</option>
              ))}
            </select>
          </div>
          <div className="selector-group">
            <span className="selector-label">Date:</span>
            <input 
              type="date" 
              value={selectedDate} 
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="attendance-controls">
        <div className="control-group">
          <button className="btn primary" onClick={markAllPresent}>
            <span className="btn-icon">✓</span> Tous présents
          </button>
          <button className="btn secondary" onClick={markAllAbsent}>
            <span className="btn-icon">✗</span> Tous absents
          </button>
          <button className="btn warning" onClick={() => {
            const absentStudents = attendanceData.filter(s => !s.present);
            absentStudents.forEach(student => sendParentNotification(student, 'absence'));
            addNotification(`Notifications envoyées aux ${absentStudents.length} parents`, 'info');
          }}>
            Notifier tous les absents
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">Chargement des élèves...</div>
      ) : (
        <>
          <div className="attendance-list-container">
            <div className="list-header">
              <h3>Liste des élèves - {currentClassName}</h3>
              <div className="list-stats">
                <span className="stat present">{attendanceData.filter(s => s.present).length} Présents</span>
                <span className="stat absent">{attendanceData.filter(s => !s.present).length} Absents</span>
                <span className="stat total">{attendanceData.length} Total</span>
              </div>
            </div>
            <div className="attendance-list">
              <table>
                <thead>
                  <tr>
                    <th>N°</th>
                    <th>Nom de l'élève</th>
                    <th>Présent(e)</th>
                    <th>Absences totales</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceData.map((student, index) => (
                    <tr key={student.id} className={`${student.present ? 'present-row' : 'absent-row'} ${student.absences >= 3 ? 'warning-row' : ''}`}>
                      <td>{index + 1}</td>
                      <td>
                        <div className="student-info">
                          <span className="student-name">{student.name}</span>
                          {student.absences >= 3 && <span className="warning-badge">⚠️ 3+ absences</span>}
                        </div>
                      </td>
                      <td>
                        <label className="checkbox-container">
                          <input
                            type="checkbox"
                            checked={student.present}
                            onChange={() => toggleAttendance(student.id)}
                          />
                          <span className="checkmark"></span>
                          <span className="status-label">{student.present ? 'Présent' : 'Absent'}</span>
                        </label>
                      </td>
                      <td>
                        <span className={`absence-count ${student.absences === 0 ? 'none' : student.absences < 3 ? 'low' : 'high'}`}>
                          {student.absences}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn small accent"
                            onClick={() => sendParentNotification(student, 'absence')}
                            disabled={student.present}
                            title="Notifier les parents"
                          >
                            Notifier
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="attendance-summary">
            <h4>Résumé de la séance</h4>
            <div className="summary-cards">
              <div className="summary-card">
                <div className="summary-title">Taux de présence</div>
                <div className="summary-value">
                  {attendanceData.length > 0 
                    ? Math.round((attendanceData.filter(s => s.present).length / attendanceData.length) * 100)
                    : 0}%
                </div>
              </div>
              <div className="summary-card">
                <div className="summary-title">Absences notifiées</div>
                <div className="summary-value">
                  {attendanceData.filter(s => !s.present).length}
                </div>
              </div>
              <div className="summary-card">
                <div className="summary-title">À risque</div>
                <div className="summary-value warning">
                  {attendanceData.filter(s => s.absences >= 3).length}
                </div>
              </div>
              <div className="summary-card">
                <div className="summary-title">Heure d'enregistrement</div>
                <div className="summary-value">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Attendance;