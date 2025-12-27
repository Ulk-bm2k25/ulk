import React, { useState } from 'react';
import {
    CalendarCheck, Search, CheckCircle2,
    XCircle, Save, Clock
} from 'lucide-react';

const AttendanceRegister = ({ className, students = [], onClose }) => {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [isSaving, setIsSaving] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Initialisation du registre
    const [attendance, setAttendance] = useState(
        students.reduce((acc, student) => {
            acc[student.id] = { status: 'present', reason: '' };
            return acc;
        }, {})
    );

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

    const stats = Object.values(attendance).reduce((acc, curr) => {
        acc[curr.status]++;
        return acc;
    }, { present: 0, absent: 0, late: 0 });

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            alert(`Registre d'appel du ${selectedDate} enregistré pour la classe ${className}.`);
            onClose();
        }, 1200);
    };

    const filteredStudents = students.filter(s =>
        (s.firstName + ' ' + s.lastName).toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in zoom-in-95 duration-300">
            <div className="w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden">

                {/* Header (Couleurs sécurisées) */}
                <div className="bg-slate-900 p-6 text-white flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-orange-500/20 flex items-center justify-center text-orange-500">
                            <CalendarCheck size={28} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Registre de Présence</h2>
                            <p className="text-white/60 text-xs">Classe de {className}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="bg-white/10 border border-white/10 rounded-xl px-4 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/50 text-white"
                        />
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <XCircle size={24} className="opacity-60" />
                        </button>
                    </div>
                </div>

                {/* Stats & Search */}
                <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex gap-4">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs font-bold">
                            <CheckCircle2 size={14} /> {stats.present} Présents
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-xs font-bold">
                            <XCircle size={14} /> {stats.absent} Absents
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-100 text-amber-700 rounded-lg text-xs font-bold">
                            <Clock size={14} /> {stats.late} Retards
                        </div>
                    </div>

                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Rechercher un élève..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-orange-500/20 outline-none"
                        />
                    </div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-auto p-6 bg-slate-50/50">
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-100 italic">
                                <tr className="text-[10px] uppercase text-slate-400 font-bold tracking-widest">
                                    <th className="px-6 py-4">Élève</th>
                                    <th className="px-6 py-4 text-center">Statut (Cliquer pour changer)</th>
                                    <th className="px-6 py-4">Observation / Motif</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredStudents.length > 0 ? (
                                    filteredStudents.map((student) => {
                                        const entry = attendance[student.id];
                                        return (
                                            <tr key={student.id} className="hover:bg-slate-50/50 group transition-colors">
                                                <td className="px-6 py-4">
                                                    {/* CORRECTION : Affichage Nom + Prénom */}
                                                    <div className="font-bold text-slate-800 text-sm italic uppercase">{student.lastName} {student.firstName}</div>
                                                    <div className="text-[10px] text-slate-400 font-mono tracking-tighter">{student.id}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex justify-center">
                                                        <button
                                                            onClick={() => toggleStatus(student.id)}
                                                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-2 transition-all active:scale-95 shadow-sm
                                                                ${entry.status === 'present' ? 'bg-green-500 text-white shadow-green-500/20' :
                                                                    entry.status === 'absent' ? 'bg-red-500 text-white shadow-red-500/20' :
                                                                        'bg-amber-500 text-white shadow-amber-500/20'}`}
                                                        >
                                                            {entry.status === 'present' && <CheckCircle2 size={14} />}
                                                            {entry.status === 'absent' && <XCircle size={14} />}
                                                            {entry.status === 'late' && <Clock size={14} />}
                                                            {entry.status === 'present' ? 'Présent' : entry.status === 'absent' ? 'Absent' : 'Retard'}
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <input
                                                        type="text"
                                                        placeholder={entry.status === 'present' ? 'RAS' : 'Motif de l\'absence...'}
                                                        value={entry.reason}
                                                        onChange={(e) => handleReasonChange(student.id, e.target.value)}
                                                        className="w-full bg-slate-50 border-none rounded-lg px-3 py-1.5 text-xs text-slate-600 focus:bg-white focus:ring-1 focus:ring-orange-500/20 outline-none transition-all"
                                                    />
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="px-6 py-12 text-center text-slate-400">
                                            Aucun élève trouvé pour cette recherche.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 bg-white border-t border-slate-100 flex justify-end gap-3 shrink-0">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-8 py-2.5 bg-slate-900 text-white font-bold rounded-xl shadow-lg hover:bg-slate-800 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        {isSaving ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span>Enregistrement...</span>
                            </>
                        ) : (
                            <>
                                <Save size={18} />
                                <span>Valider la Présence</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AttendanceRegister;