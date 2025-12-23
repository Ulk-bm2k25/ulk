import React from 'react';
import { CalendarCheck, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';

const Attendance = () => {
    const attendanceReports = [
        {
            name: 'Jean Dupont',
            rate: '98%',
            absences: 1,
            history: [
                { date: '21/12/2025', status: 'Present', time: '07:55' },
                { date: '20/12/2025', status: 'Present', time: '08:02' },
                { date: '19/12/2025', status: 'Absent', time: '-', reason: 'Medical' },
                { date: '18/12/2025', status: 'Present', time: '07:50' },
            ]
        }
    ];

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-white">Attendance</h1>
                <p className="text-white/40 mt-1">Monitor daily presence and review absence history.</p>
            </header>

            {attendanceReports.map((child, idx) => (
                <div key={idx} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white/5 rounded-3xl p-8 border border-white/5 flex items-center gap-6">
                            <div className="w-16 h-16 rounded-2xl bg-green-500/10 text-green-500 flex items-center justify-center">
                                <CheckCircle2 size={32} />
                            </div>
                            <div>
                                <p className="text-sm text-white/40 font-medium">Attendance Rate</p>
                                <h3 className="text-3xl font-black text-white">{child.rate}</h3>
                            </div>
                        </div>
                        <div className="bg-white/5 rounded-3xl p-8 border border-white/5 flex items-center gap-6">
                            <div className="w-16 h-16 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center">
                                <AlertTriangle size={32} />
                            </div>
                            <div>
                                <p className="text-sm text-white/40 font-medium">Total Absences</p>
                                <h3 className="text-3xl font-black text-white">{child.absences}</h3>
                            </div>
                        </div>
                    </div>

                    <section className="bg-white/5 rounded-3xl border border-white/5 overflow-hidden">
                        <div className="p-6 border-b border-white/5 flex items-center gap-3">
                            <CalendarCheck size={20} className="text-[#eb8e3a]" />
                            <h2 className="text-xl font-bold text-white">Recent Logs - {child.name}</h2>
                        </div>
                        <div className="divide-y divide-white/5">
                            {child.history.map((log, lidx) => (
                                <div key={lidx} className="p-6 flex items-center justify-between hover:bg-white/5 transition-all">
                                    <div className="flex items-center gap-4">
                                        <span className="text-lg font-bold text-white">{log.date}</span>
                                        <span className="text-xs text-white/20">{log.time}</span>
                                    </div>
                                    <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase flex items-center gap-2 ${log.status === 'Present' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                                        }`}>
                                        {log.status === 'Present' ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                                        {log.status}
                                        {log.reason && <span className="text-white/40 ml-1">({log.reason})</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            ))}
        </div>
    );
};

export default Attendance;
