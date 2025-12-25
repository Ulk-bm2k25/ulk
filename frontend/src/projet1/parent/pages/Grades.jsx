import React, { useState } from 'react';
import { Star, TrendingUp, BookOpen, AlertCircle, Download, FileText, Calendar, LayoutGrid, TrendingDown, Minus } from 'lucide-react';

import ChildSelector from '../components/ChildSelector';
import TrimesterSelector from '../components/TrimesterSelector';

const Grades = ({ children, selectedChildId, setSelectedChildId }) => {
    const [selectedTrimesterId, setSelectedTrimesterId] = useState(1);

    // Enhanced mock data to match the requirements from the image
    const childrenGradesMap = {
        1: {
            name: 'Lucas Dupont',
            moyenneGenerale: '14.43',
            matièresCount: 6,
            progression: 3,
            trimesters: [
                {
                    id: 1,
                    title: '1er Trimestre',
                    isClosed: true,
                    average: '14.43',
                    subjects: [
                        { name: 'Mathématiques', coef: 5, interros: ['16', '15', '14'], devoir: '17', composition: '17', moyenne: '16.2', trend: 'up' },
                        { name: 'Physique-Chimie', coef: 4, interros: ['14', '15', '13'], devoir: '15', composition: '14', moyenne: '14.3', trend: 'neutral' },
                        { name: 'SVT', coef: 3, interros: ['13', '14', '12'], devoir: '14', composition: '15', moyenne: '14.0', trend: 'up' },
                        { name: 'Français', coef: 3, interros: ['12', '11', '13'], devoir: '11', composition: '13', moyenne: '12.0', trend: 'down' },
                    ]
                },
                {
                    id: 2,
                    title: '2ème Trimestre',
                    isClosed: false,
                    average: '15.10',
                    subjects: [
                        { name: 'Mathématiques', coef: 5, interros: ['17', '18', '--'], devoir: '16', composition: '--', moyenne: '17.0', trend: 'up' },
                        { name: 'Physique-Chimie', coef: 4, interros: ['15', '16', '--'], devoir: '14', composition: '--', moyenne: '15.2', trend: 'up' },
                    ]
                },
                {
                    id: 3,
                    title: '3ème Trimestre',
                    isClosed: false,
                    average: '--',
                    subjects: []
                }
            ]
        },
        2: {
            name: 'Marie-Laure Dupont',
            moyenneGenerale: '15.20',
            matièresCount: 5,
            progression: 2,
            trimesters: [
                {
                    id: 1,
                    title: '1er Trimestre',
                    isClosed: true,
                    average: '15.20',
                    subjects: [
                        { name: 'Mathématiques', coef: 5, interros: ['15', '14', '16'], devoir: '15', composition: '16', moyenne: '15.4', trend: 'neutral' },
                    ]
                }
            ]
        }
    };

    const currentChild = childrenGradesMap[selectedChildId] || childrenGradesMap[1];
    const currentTrimester = currentChild.trimesters.find(t => t.id === selectedTrimesterId) || currentChild.trimesters[0];

    const handleDownloadBulletin = () => {
        alert(`Téléchargement du bulletin de ${currentChild.name} (${currentTrimester.title}) en cours...`);
    };

    const getTrendIcon = (trend) => {
        switch (trend) {
            case 'up': return <TrendingUp size={16} className="text-green-500" />;
            case 'down': return <TrendingDown size={16} className="text-red-500" />;
            default: return <Minus size={16} className="text-white/20" />;
        }
    };

    const getMoyenneColor = (moyenne) => {
        const val = parseFloat(moyenne);
        if (val >= 15) return 'text-green-500';
        if (val >= 12) return 'text-[#eb8e3a]';
        if (val >= 10) return 'text-blue-400';
        return 'text-red-500';
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 text-white">
            {/* Header Section */}
            <div className="space-y-6">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black tracking-tight">Notes & Résultats</h1>
                    <p className="text-white/40 font-medium">Consultez les notes et téléchargez les bulletins de votre enfant.</p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <ChildSelector
                        children={children}
                        selectedChildId={selectedChildId}
                        onSelect={setSelectedChildId}
                    />
                    <TrimesterSelector
                        trimesters={currentChild.trimesters}
                        selectedTrimesterId={selectedTrimesterId}
                        onSelect={setSelectedTrimesterId}
                    />
                    <button
                        onClick={handleDownloadBulletin}
                        className="flex items-center gap-3 px-6 py-3 bg-[#eb8e3a] hover:bg-[#d47d2f] text-white rounded-2xl font-bold shadow-lg shadow-orange-950/20 transition-all active:scale-95 group"
                    >
                        <Download size={20} className="group-hover:translate-y-0.5 transition-transform" />
                        <span>Télécharger le bulletin</span>
                    </button>
                </div>
            </div>

            {/* Summary Statistics Card */}
            <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 backdrop-blur-sm shadow-xl overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#eb8e3a]/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
                <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="space-y-1">
                        <span className="text-white/40 font-bold uppercase tracking-widest text-[11px]">Moyenne Générale</span>
                        <div className="flex items-baseline gap-2">
                            <span className="text-6xl font-black text-blue-400">{currentTrimester.average}</span>
                            <span className="text-2xl font-bold text-blue-400/40">/20</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-12">
                        <div className="text-center md:text-right">
                            <div className="text-3xl font-black">{currentChild.matièresCount}</div>
                            <div className="text-white/40 text-[12px] font-bold uppercase tracking-wider">Matières</div>
                        </div>
                        <div className="text-center md:text-right">
                            <div className="text-3xl font-black text-green-500 flex items-center justify-center md:justify-end gap-2">
                                {currentChild.progression}
                                <TrendingUp size={24} />
                            </div>
                            <div className="text-white/40 text-[12px] font-bold uppercase tracking-wider">En progression</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Detailed Grades Table */}
            <div className="bg-white/5 border border-white/10 rounded-[32px] overflow-hidden shadow-xl">
                <div className="p-8 border-b border-white/5">
                    <h2 className="text-2xl font-black">Détail des notes</h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/[0.02] text-white/40 text-[10px] font-black uppercase tracking-widest border-b border-white/5">
                                <th className="px-8 py-6">Matière</th>
                                <th className="px-4 py-6 text-center">Coefficient</th>
                                <th className="px-4 py-6 text-center text-white/20">Interro 1</th>
                                <th className="px-4 py-6 text-center text-white/20">Interro 2</th>
                                <th className="px-4 py-6 text-center text-white/20">Interro 3</th>
                                <th className="px-4 py-6 text-center text-[#eb8e3a]/40">Devoir</th>
                                <th className="px-4 py-6 text-center text-blue-400/40">Composition</th>
                                <th className="px-4 py-6 text-center">Moyenne /20</th>
                                <th className="px-4 py-6 text-center">Tendance</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {currentTrimester.subjects.length > 0 ? (
                                currentTrimester.subjects.map((subject, idx) => (
                                    <tr key={idx} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="font-bold group-hover:text-[#eb8e3a] transition-colors">{subject.name}</div>
                                        </td>
                                        <td className="px-4 py-6 text-center">
                                            <span className="bg-white/5 px-2.5 py-1 rounded-lg text-white/60 font-black text-xs border border-white/5">
                                                {subject.coef}
                                            </span>
                                        </td>
                                        <td className="px-4 py-6 text-center text-white/50 font-medium">
                                            {subject.interros[0] !== '--' ? `${subject.interros[0]}/20` : '--'}
                                        </td>
                                        <td className="px-4 py-6 text-center text-white/50 font-medium">
                                            {subject.interros[1] !== '--' ? `${subject.interros[1]}/20` : '--'}
                                        </td>
                                        <td className="px-4 py-6 text-center text-white/50 font-medium">
                                            {subject.interros[2] !== '--' ? `${subject.interros[2]}/20` : '--'}
                                        </td>
                                        <td className="px-4 py-6 text-center text-white/50 font-medium">
                                            {subject.devoir !== '--' ? `${subject.devoir}/20` : '--'}
                                        </td>
                                        <td className="px-4 py-6 text-center text-white/50 font-medium">
                                            {subject.composition !== '--' ? `${subject.composition}/20` : '--'}
                                        </td>
                                        <td className={`px-4 py-6 text-center font-black text-lg ${getMoyenneColor(subject.moyenne)}`}>
                                            {subject.moyenne !== '--' ? subject.moyenne : '--'}
                                        </td>
                                        <td className="px-4 py-6 text-center">
                                            <div className="flex justify-center">
                                                {getTrendIcon(subject.trend)}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="9" className="px-8 py-20 text-center text-white/20 italic font-medium">
                                        <div className="flex flex-col items-center gap-4">
                                            <Star size={48} strokeWidth={1} />
                                            <p>Aucune donnée disponible pour ce trimestre.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* Formula Hint */}
            <div className="mt-8 flex items-center gap-3 px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white/40 text-xs font-medium">
                <AlertCircle size={16} className="text-[#eb8e3a]" />
                <p>
                    <span className="text-white/60 font-bold uppercase">Calcul :</span> (Moyenne Interros + Devoir + 2 × Composition) / 4.
                    La moyenne finale est ensuite multipliée par le <span className="text-[#eb8e3a] font-bold">Coefficient</span> de la matière.
                </p>
            </div>
        </div>

    );
};

export default Grades;


