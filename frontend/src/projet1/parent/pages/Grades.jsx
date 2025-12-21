import React from 'react';
import { Star, TrendingUp, BookOpen, AlertCircle } from 'lucide-react';

const Grades = () => {
    const childrenGrades = [
        {
            name: 'Jean Dupont',
            average: '16.5',
            evaluations: [
                { subject: 'Mathematics', score: '18/20', date: '15/12', type: 'Quiz', status: 'Passed' },
                { subject: 'Physics', score: '15/20', date: '10/12', type: 'Exam', status: 'Passed' },
                { subject: 'English', score: '17/20', date: '05/12', type: 'Oral', status: 'Passed' },
            ]
        }
    ];

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-white">Grades & Performance</h1>
                <p className="text-white/40 mt-1">Track academic progress and recent evaluation results.</p>
            </header>

            {childrenGrades.map((child, idx) => (
                <div key={idx} className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white flex items-center gap-3">
                            <BookOpen size={20} className="text-[#eb8e3a]" />
                            {child.name}
                        </h2>
                        <div className="flex items-center gap-2 bg-[#eb8e3a]/10 text-[#eb8e3a] px-4 py-2 rounded-2xl border border-[#eb8e3a]/20">
                            <TrendingUp size={18} />
                            <span className="font-bold">Average: {child.average}/20</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {child.evaluations.map((evalItem, eidx) => (
                            <div key={eidx} className="bg-white/5 rounded-2xl p-6 border border-white/5 flex items-center justify-between hover:bg-white/10 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white/20">
                                        <Star size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white">{evalItem.subject}</h3>
                                        <p className="text-xs text-white/40">{evalItem.type} • {evalItem.date}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-xl font-black text-white">{evalItem.score}</span>
                                    <div className="flex items-center gap-1 text-green-500 text-[10px] font-bold uppercase mt-1">
                                        <AlertCircle size={10} />
                                        <span>Validated</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Grades;
