import React, { useState, useEffect } from 'react';
import { CalendarCheck, Search, CheckCircle2, XCircle, Save, Clock, Filter } from 'lucide-react';
import api from '../../../api';

const AttendanceRegister = () => {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [attendance, setAttendance] = useState({});

  useEffect(() => {
    loadClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      loadStudents();
    }
  }, [selectedClass]);

  const loadClasses = async () => {
    try {
      const response = await api.get('/classes');
      setClasses(response.data || []);
    } catch (error) {
      console.error('Erreur chargement classes:', error);
      setClasses([]);
    }
  };

  const loadStudents = async () => {
    if (!selectedClass) return;
    try {
      const response = await api.get(`/eleves?classe_id=${selectedClass}`);
      const studentsData = response.data.data || [];
      setStudents(studentsData);
      
      // Initialiser le registre
      const initialAttendance = {};
      studentsData.forEach(student => {
        initialAttendance[student.id] = { status: 'present', reason: '' };
      });
      setAttendance(initialAttendance);
    } catch (error) {
      console.error('Erreur chargement élèves:', error);
      setStudents([]);
    }
  };

  const toggleStatus = (studentId) => {
    setAttendance(prev => {
      const currentStatus = prev[studentId].status;
      let nextStatus = 'present';
      if (currentStatus === 'present') nextStatus = 'absent';
      else if (currentStatus === 'absent') nextStatus = 'late';

      return {
        ...prev,
        [studentId]: { ...prev[studentId], status: nextStatus }
      };
    });
  };

  const handleReasonChange = (studentId, reason) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], reason }
    }));
  };

  const handleSave = async () => {
    if (!selectedClass) {
      alert('Veuillez sélectionner une classe');
      return;
    }

    try {
      setIsSaving(true);
      const attendanceData = Object.entries(attendance).map(([studentId, data]) => ({
        eleve_id: parseInt(studentId),
        date: selectedDate,
        statut: data.status,
        motif: data.reason || null,
        justifie: data.status === 'present' || data.status === 'late',
      }));

      await api.post('/presence/bulk', { attendance: attendanceData });
      alert(`Registre d'appel du ${selectedDate} enregistré avec succès`);
      setAttendance({});
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      alert(error.response?.data?.message || 'Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  const stats = Object.values(attendance).reduce((acc, curr) => {
    acc[curr.status] = (acc[curr.status] || 0) + 1;
    return acc;
  }, { present: 0, absent: 0, late: 0 });

  const filteredStudents = students.filter(s =>
    `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <CalendarCheck className="text-orange-600" size={28} />
          Registre de Présence
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Marquez la présence des élèves par classe et par date
        </p>
      </div>

      {/* Filtres */}
      <div className="bg-white p-4 rounded-lg border border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Classe *</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500/20 outline-none"
            >
              <option value="">Sélectionner une classe...</option>
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Date *</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500/20 outline-none"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleSave}
              disabled={isSaving || !selectedClass}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={20} />
              {isSaving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      {selectedClass && (
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm font-semibold">
              <CheckCircle2 size={16} /> {stats.present || 0} Présents
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm font-semibold">
              <XCircle size={16} /> {stats.absent || 0} Absents
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-100 text-amber-700 rounded-lg text-sm font-semibold">
              <Clock size={16} /> {stats.late || 0} Retards
            </div>
          </div>
        </div>
      )}

      {/* Liste des élèves */}
      {selectedClass ? (
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Rechercher un élève..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500/20 outline-none"
              />
            </div>
          </div>
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Élève</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-600 uppercase">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Motif</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((student) => {
                const entry = attendance[student.id] || { status: 'present', reason: '' };
                return (
                  <tr key={student.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-800">
                      {student.prenom || student.firstName} {student.nom || student.lastName}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <button
                          onClick={() => toggleStatus(student.id)}
                          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                            entry.status === 'present' ? 'bg-green-500 text-white' :
                            entry.status === 'absent' ? 'bg-red-500 text-white' :
                            'bg-amber-500 text-white'
                          }`}
                        >
                          {entry.status === 'present' ? 'Présent' :
                           entry.status === 'absent' ? 'Absent' : 'Retard'}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        placeholder={entry.status === 'present' ? 'RAS' : 'Motif...'}
                        value={entry.reason}
                        onChange={(e) => handleReasonChange(student.id, e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500/20 outline-none"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-10 text-slate-400 bg-white rounded-lg border border-slate-200">
          Sélectionnez une classe pour commencer
        </div>
      )}
    </div>
  );
};

export default AttendanceRegister;

