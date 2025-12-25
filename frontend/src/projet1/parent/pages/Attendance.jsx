import React from 'react';
import { CalendarCheck, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';

import ChildSelector from '../components/ChildSelector';

const Attendance = ({ children, selectedChildId, setSelectedChildId }) => {
    // Data map (Empty for Backend integration)
    const attendanceDataMap = {};

    const currentChildAttendance = attendanceDataMap[selectedChildId] || {
        name: 'Élève',
        rate: '--',
        absences: 0,
        history: []
    };

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
                            <h3 className="text-3xl font-black text-white">{currentChildAttendance.rate}</h3>
                        </div>
                    </div>
                    <div className="bg-white/5 rounded-3xl p-8 border border-white/5 flex items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center">
                            <AlertTriangle size={32} />
                        </div>
                        <div>
                            <p className="text-sm text-white/40 font-medium">Total des Absences</p>
                            <h3 className="text-3xl font-black text-white">{currentChildAttendance.absences}</h3>
                        </div>
                    </div>
                </div>

                <section className="bg-white/5 rounded-3xl border border-white/5 overflow-hidden">
                    <div className="p-6 border-b border-white/5 flex items-center gap-3">
                        <CalendarCheck size={20} className="text-[#eb8e3a]" />
                        <h2 className="text-xl font-bold text-white">Registres Récents - {currentChildAttendance.name}</h2>
                    </div>
                    <div className="divide-y divide-white/5">
                        {currentChildAttendance.history.map((log, lidx) => (
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
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Attendance;
