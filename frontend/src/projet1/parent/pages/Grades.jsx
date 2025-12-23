import React from 'react';
import { Star, TrendingUp, BookOpen, AlertCircle, Download, FileText } from 'lucide-react';

import ChildSelector from '../components/ChildSelector';

const Grades = ({ children, selectedChildId, setSelectedChildId }) => {
    // Extended mock data for different children
    const childrenGradesMap = {
        1: {
            name: 'Jean Dupont',
            average: '16.5',
            terms: [
                {
                    id: 1,
                    title: '1er Trimestre',
                    isClosed: true,
                    average: '16.8',
                    evaluations: [
                        { subject: 'Mathématiques', score: '18/20', date: '15/12', type: 'Quiz', status: 'Validé' },
                        { subject: 'Physique-Chimie', score: '15/20', date: '10/12', type: 'Examen', status: 'Validé' },
                        { subject: 'Anglais', score: '17/20', date: '05/12', type: 'Oral', status: 'Validé' },
                    ]
                },
                {
                    id: 2,
                    title: '2ème Trimestre',
                    isClosed: false,
                    average: '16.2',
                    evaluations: [
                        { subject: 'Mathématiques', score: '17/20', date: '20/01', type: 'Devoir', status: 'Validé' },
                        { subject: 'SVT', score: '14/20', date: '12/01', type: 'Quiz', status: 'Validé' },
                    ]
                },
                {
                    id: 3,
                    title: '3ème Trimestre',
                    isClosed: false,
                    average: '--',
                    evaluations: []
                }
            ]
        },
        2: {
            name: 'Marie-Laure Dupont',
            average: '14.2',
            terms: [
                {
                    id: 1,
                    title: '1er Trimestre',
                    isClosed: true,
                    average: '14.5',
                    evaluations: [
                        { subject: 'Français', score: '15/20', date: '12/12', type: 'Dictée', status: 'Validé' },
                        { subject: 'Histoire-Géo', score: '13/20', date: '08/12', type: 'Examen', status: 'Validé' },
                    ]
                }
            ]
        }
    };

    const currentChildGrades = childrenGradesMap[selectedChildId] || childrenGradesMap[1];

    const handleDownloadBulletin = (childName, termTitle) => {
        alert(`Téléchargement du bulletin de ${childName} (${termTitle}) en cours...`);
    };

    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-white">Notes & Bulletins</h1>
                    <p className="text-white/40 mt-1">Suivez les progrès académiques et les résultats des évaluations récentes.</p>
                </div>
                <ChildSelector
                    children={children}
                    selectedChildId={selectedChildId}
                    onSelect={setSelectedChildId}
                />
            </header>

            <div className="space-y-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h2 className="text-2xl font-black text-white flex items-center gap-3">
                        <BookOpen size={24} className="text-[#eb8e3a]" />
                        {currentChildGrades.name}
                    </h2>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-[#eb8e3a]/10 text-[#eb8e3a] px-5 py-2.5 rounded-2xl border border-[#eb8e3a]/20">
                            <TrendingUp size={20} />
                            <span className="font-black text-lg">Moyenne Générale: {currentChildGrades.average}/20</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-12">
                    {currentChildGrades.terms.map((term) => (
                        <div key={term.id} className="space-y-6">
                            <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                <div className="flex items-center gap-4">
                                    <h3 className="text-xl font-bold text-white/90">{term.title}</h3>
                                    {term.isClosed && (
                                        <span className="px-2 py-0.5 bg-green-500/20 text-green-500 text-[10px] font-bold rounded uppercase tracking-wider">
                                            Clôturé
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-sm font-bold text-white/40">
                                        Moyenne: <span className="text-[#eb8e3a]">{term.average}/20</span>
                                    </div>
                                    <button
                                        onClick={() => handleDownloadBulletin(currentChildGrades.name, term.title)}
                                        className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/5 rounded-xl text-xs font-bold transition-all group"
                                    >
                                        <Download size={14} className="group-hover:translate-y-0.5 transition-transform" />
                                        Télécharger bulletin
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {term.evaluations.length > 0 ? (
                                    term.evaluations.map((evalItem, eidx) => (
                                        <div key={eidx} className="bg-white/5 rounded-2xl p-5 border border-white/5 hover:bg-white/10 transition-all flex justify-between items-start group">
                                            <div className="flex gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/20 group-hover:bg-[#eb8e3a]/10 group-hover:text-[#eb8e3a] transition-all">
                                                    <FileText size={20} />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-white text-sm">{evalItem.subject}</h4>
                                                    <p className="text-[10px] text-white/40 uppercase font-black mt-0.5 tracking-wider">
                                                        {evalItem.type} • {evalItem.date}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-lg font-black text-white">{evalItem.score}</span>
                                                <div className="flex items-center justify-end gap-1 text-green-500 text-[9px] font-bold uppercase mt-1">
                                                    <AlertCircle size={8} />
                                                    <span>Validé</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-full py-8 text-center bg-white/2 rounded-2xl border border-dashed border-white/5">
                                        <p className="text-sm text-white/20 italic">Aucune note enregistrée pour ce trimestre.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Grades;
