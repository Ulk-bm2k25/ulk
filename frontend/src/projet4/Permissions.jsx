import React, { useState, useEffect } from 'react';
import { 
  FileText, Calendar, CheckCircle, XCircle, Clock, 
  Search, Plus, User, FileInput, Send, AlertTriangle, 
  Download, Filter 
} from 'lucide-react';

const PermissionsManager = () => {
  const [permissionRequests, setPermissionRequests] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    student_id: '',
    absence_date: '',
    course_id: '',
    reason: '',
    attachment: null,
    notify_email: false,
    notify_sms: false
  });

  // --- SIMULATION DES DONNÉES (Pour affichage immédiat sans Backend) ---
  useEffect(() => {
    // Simulation du délai réseau
    setTimeout(() => {
        // Mock Demandes
        setPermissionRequests([
            { id: 1, student: { name: 'Koffi Alain', class: '6ème A' }, absence_date: '2025-12-20', reason: 'Rendez-vous médical', status: 'pending', course: { subject: 'Mathématiques' } },
            { id: 2, student: { name: 'Sena Béatrice', class: 'Tle D' }, absence_date: '2025-12-18', reason: 'Maladie (Certificat)', status: 'approved', course: { subject: 'Physique' } },
            { id: 3, student: { name: 'Paul Pierre', class: '3ème A' }, absence_date: '2025-12-15', reason: 'Voyage familial', status: 'rejected', course: { subject: 'Anglais' } },
        ]);
        
        // Mock Élèves
        setStudents([
            { id: 1, name: 'Koffi Alain' },
            { id: 2, name: 'Sena Béatrice' },
            { id: 3, name: 'Paul Pierre' }
        ]);

        // Mock Cours
        setCourses([
            { id: 1, subject: 'Mathématiques' },
            { id: 2, subject: 'Physique' },
            { id: 3, subject: 'Français' }
        ]);

        setLoading(false);
    }, 800);
  }, []);

  // --- LOGIQUE MÉTIER CONSERVÉE ---

  const handlePermissionAction = (requestId, status) => {
    // Simulation mise à jour locale
    setPermissionRequests(prev => prev.map(req => 
        req.id === requestId ? { ...req, status: status } : req
    ));
    alert(`Demande ${status === 'approved' ? 'approuvée' : 'refusée'} avec succès`);
  };

  const resendNotification = (requestId) => {
    alert('Notification renvoyée avec succès au parent.');
  };

  const handleSubmitRequest = (e) => {
    e.preventDefault();
    // Simulation création
    const newReq = {
        id: Date.now(),
        student: students.find(s => s.id === parseInt(formData.student_id)) || { name: 'Nouveau', class: '?' },
        absence_date: formData.absence_date,
        course: courses.find(c => c.id === parseInt(formData.course_id)) || { subject: '?' },
        reason: formData.reason,
        status: 'pending'
    };
    setPermissionRequests([newReq, ...permissionRequests]);
    
    // Reset form
    setFormData({
        student_id: '', absence_date: '', course_id: '', reason: '',
        attachment: null, notify_email: false, notify_sms: false
    });
    alert('Demande créée avec succès');
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value
    }));
  };

  const StatusBadge = ({ status }) => {
    const styles = {
        pending: 'bg-orange-100 text-orange-700',
        approved: 'bg-green-100 text-green-700',
        rejected: 'bg-red-100 text-red-700'
    };
    const labels = {
        pending: 'En attente',
        approved: 'Approuvée',
        rejected: 'Refusée'
    };
    return (
        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${styles[status] || 'bg-gray-100'}`}>
            {labels[status]}
        </span>
    );
  };

  // Séparation des listes comme dans le fichier original
  const pendingRequests = permissionRequests.filter(r => r.status === 'pending');
  const processedRequests = permissionRequests.filter(r => r.status !== 'pending');

  if (loading) return <div className="p-10 text-center">Chargement des permissions...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <FileText className="text-orange-600" size={28} />
            Demandes de Permission
        </h1>
        <p className="text-slate-500 text-sm mt-1">Gérez les demandes d'absence et de permission des élèves.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* COLONNE GAUCHE : EN ATTENTE */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-fit">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    En attente
                    {pendingRequests.length > 0 && (
                        <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">{pendingRequests.length}</span>
                    )}
                </h2>
            </div>

            {pendingRequests.length === 0 ? (
                <div className="text-center py-10 text-slate-400 border-2 border-dashed border-slate-100 rounded-xl">
                    <CheckCircle size={32} className="mx-auto mb-2 opacity-50" />
                    <p>Aucune demande en attente</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {pendingRequests.map(request => (
                        <div key={request.id} className="bg-slate-50 border-l-4 border-l-orange-500 rounded-r-xl p-4 shadow-sm">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h3 className="font-bold text-slate-800 text-lg">{request.student?.name}</h3>
                                    <div className="text-sm text-slate-500 flex items-center gap-2">
                                        <Clock size={14} /> {request.absence_date}
                                    </div>
                                </div>
                                <StatusBadge status="pending" />
                            </div>

                            <div className="bg-white p-3 rounded border border-slate-200 text-sm text-slate-700 italic mb-3">
                                "{request.reason}"
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-xs text-slate-500 mb-4">
                                <div>
                                    <span className="block font-bold uppercase text-[10px]">Classe</span>
                                    {request.student?.class || 'N/A'}
                                </div>
                                <div>
                                    <span className="block font-bold uppercase text-[10px]">Cours</span>
                                    {request.course?.subject || 'N/A'}
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button 
                                    onClick={() => handlePermissionAction(request.id, 'approved')}
                                    className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-bold transition-colors"
                                >
                                    ✓ Approuver
                                </button>
                                <button 
                                    onClick={() => handlePermissionAction(request.id, 'rejected')}
                                    className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-bold transition-colors"
                                >
                                    ✗ Refuser
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>

        {/* COLONNE DROITE : HISTORIQUE */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-fit">
            <h2 className="text-lg font-bold text-slate-800 mb-6">Historique</h2>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                        <tr>
                            <th className="p-3">Élève</th>
                            <th className="p-3">Date</th>
                            <th className="p-3">Statut</th>
                            <th className="p-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {processedRequests.map(request => (
                            <tr key={request.id} className="hover:bg-slate-50">
                                <td className="p-3 font-medium text-slate-800">{request.student?.name}</td>
                                <td className="p-3 text-slate-500">{request.absence_date}</td>
                                <td className="p-3"><StatusBadge status={request.status} /></td>
                                <td className="p-3 text-right">
                                    <button 
                                        onClick={() => resendNotification(request.id)}
                                        className="p-1.5 text-slate-400 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 rounded transition-colors"
                                        title="Renvoyer notif"
                                    >
                                        <Send size={14} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

      </div>

      {/* FORMULAIRE NOUVELLE DEMANDE */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Plus size={20} className="text-orange-600" />
            Nouvelle demande de permission
        </h2>

        <form onSubmit={handleSubmitRequest} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">Élève *</label>
                    <select name="student_id" value={formData.student_id} onChange={handleInputChange} required className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500/20 outline-none">
                        <option value="">Sélectionner...</option>
                        {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                </div>
                <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">Date d'absence *</label>
                    <input type="date" name="absence_date" value={formData.absence_date} onChange={handleInputChange} required className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500/20 outline-none" />
                </div>
                <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">Cours concerné *</label>
                    <select name="course_id" value={formData.course_id} onChange={handleInputChange} required className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500/20 outline-none">
                        <option value="">Sélectionner...</option>
                        {courses.map(c => <option key={c.id} value={c.id}>{c.subject}</option>)}
                    </select>
                </div>
            </div>

            <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Raison *</label>
                <textarea name="reason" value={formData.reason} onChange={handleInputChange} rows="3" required className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500/20 outline-none" placeholder="Motif de l'absence..."></textarea>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
                <div className="space-y-1">
                     <label className="text-sm font-medium text-slate-700 block mb-1">Options de notification</label>
                     <div className="flex gap-4">
                        <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                            <input type="checkbox" name="notify_email" checked={formData.notify_email} onChange={handleInputChange} className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500" />
                            Email
                        </label>
                        <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                            <input type="checkbox" name="notify_sms" checked={formData.notify_sms} onChange={handleInputChange} className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500" />
                            SMS
                        </label>
                     </div>
                </div>

                <button type="submit" className="px-6 py-3 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-colors shadow-lg">
                    Soumettre la demande
                </button>
            </div>
        </form>
      </div>

    </div>
  );
};

export default PermissionsManager;