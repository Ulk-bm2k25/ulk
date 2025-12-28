import React, { useState, useEffect } from 'react';
import { CalendarCheck, AlertTriangle, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import api from '@/api';

import ChildSelector from '../components/ChildSelector';

const Attendance = ({ children, selectedChildId, setSelectedChildId }) => {
    const [attendanceHistory, setAttendanceHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (selectedChildId) {
            const fetchAttendance = async () => {
                setIsLoading(true);
                try {
                    const response = await api.get(`/parent/children/${selectedChildId}/attendance`);
                    setAttendanceHistory(response.data);
                } catch (err) {
                    console.error("Failed to fetch attendance", err);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchAttendance();
        }
    }, [selectedChildId]);

    const currentChildData = children.find(c => c.id === selectedChildId);

    // Calculate stats
    const totalAbsences = attendanceHistory.filter(a => !a.present).length;
    const attendanceRate = attendanceHistory.length > 0
        ? `${Math.round((attendanceHistory.filter(a => a.present).length / attendanceHistory.length) * 100)}%`
        : '100%';

    const historyUI = attendanceHistory.map(a => ({
        date: new Date(a.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
        time: a.heure,
        status: a.present ? 'Présent' : 'Absent',
        reason: a.reason
    }));

    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-white">Présence</h1>
                    <p className="text-white/40 mt-1">Surveillez la présence quotidienne et examinez l'historique des absences.</p>
                </div>
                <ChildSelector
                    children={children}
                    selectedChildId={selectedChildId}
                    onSelect={setSelectedChildId}
                />
            </header>

            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white/5 rounded-3xl p-8 border border-white/5 flex items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-green-500/10 text-green-500 flex items-center justify-center">
                            <CheckCircle2 size={32} />
                        </div>
                        <div>
                            <p className="text-sm text-white/40 font-medium">Taux de présence</p>
                            <h3 className="text-3xl font-black text-white">{attendanceRate}</h3>
                        </div>
                    </div>
                    <div className="bg-white/5 rounded-3xl p-8 border border-white/5 flex items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center">
                            <AlertTriangle size={32} />
                        </div>
                        <div>
                            <p className="text-sm text-white/40 font-medium">Total des Absences</p>
                            <h3 className="text-3xl font-black text-white">{totalAbsences}</h3>
                        </div>
                    </div>
                </div>

                <section className="bg-white/5 rounded-3xl border border-white/5 overflow-hidden">
                    <div className="p-6 border-b border-white/5 flex items-center gap-3">
                        <CalendarCheck size={20} className="text-[#eb8e3a]" />
                        <h2 className="text-xl font-bold text-white">Registres Récents - {currentChildData?.user?.nom || 'Élève'}</h2>
                    </div>
                    <div className="divide-y divide-white/5">
                        {isLoading ? (
                            <div className="p-20 text-center text-white/20 italic font-medium flex flex-col items-center gap-4">
                                <Loader2 size={48} className="animate-spin" />
                                <p>Chargement de l'historique...</p>
                            </div>
                        ) : historyUI.length > 0 ? (
                            historyUI.map((log, lidx) => (
                                <div key={lidx} className="p-6 flex items-center justify-between hover:bg-white/5 transition-all">
                                    <div className="flex items-center gap-4">
                                        <span className="text-lg font-bold text-white">{log.date}</span>
                                        <span className="text-xs text-white/20">{log.time}</span>
                                    </div>
                                    <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase flex items-center gap-2 ${log.status === 'Présent' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                                        }`}>
                                        {log.status === 'Présent' ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                                        {log.status}
                                        {log.reason && <span className="text-white/40 ml-1">({log.reason})</span>}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-20 text-center text-white/20 italic font-medium flex flex-col items-center gap-4">
                                <CalendarCheck size={48} strokeWidth={1} />
                                <p>Aucun registre de présence disponible.</p>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Attendance;
