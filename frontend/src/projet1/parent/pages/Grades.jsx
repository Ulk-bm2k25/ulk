import React, { useState, useEffect } from 'react';
import { Star, TrendingUp, BookOpen, AlertCircle, Download, FileText, Calendar, LayoutGrid, TrendingDown, Minus, Loader2 } from 'lucide-react';
import api from '@/api';

import ChildSelector from '../components/ChildSelector';
import TrimesterSelector from '../components/TrimesterSelector';

const Grades = ({ children, selectedChildId, setSelectedChildId }) => {
    const [selectedTrimesterId, setSelectedTrimesterId] = useState(null);
    const [availableSemesters, setAvailableSemesters] = useState([]);
    const [studentGrades, setStudentGrades] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch Semesters
    useEffect(() => {
        const fetchSemesters = async () => {
            try {
                const response = await api.get('/parent/semestres');
                setAvailableSemesters(response.data);
                if (response.data.length > 0) setSelectedTrimesterId(response.data[0].id);
            } catch (err) {
                console.error("Failed to fetch semesters", err);
            }
        };
        fetchSemesters();
    }, []);

    // Fetch Grades for selected child
    useEffect(() => {
        if (selectedChildId) {
            const fetchGrades = async () => {
                setIsLoading(true);
                try {
                    const response = await api.get(`/parent/children/${selectedChildId}/grades`);
                    setStudentGrades(response.data);
                } catch (err) {
                    console.error("Failed to fetch grades", err);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchGrades();
        }
    }, [selectedChildId]);

    const currentChildData = children.find(c => c.id === selectedChildId);

    // Map data for UI
    const filteredGrades = studentGrades.filter(g => g.semestre_id === selectedTrimesterId);
    const currentTrimester = availableSemesters.find(s => s.id === selectedTrimesterId) || { nom: 'Trimestre' };

    const subjectsUI = filteredGrades.map(g => {
        const note = parseFloat(g.note || 0);
        let trend = 'minus';
        if (note >= 12) trend = 'up';
        else if (note < 10) trend = 'down';

        return {
            name: g.matiere?.nom || 'Matière',
            coef: g.coefficient || g.matiere?.coefficient || 1,
            interros: ['--', '--', '--'],
            devoir: '--',
            composition: '--',
            moyenne: note,
            trend: trend,
            appreciation: g.appreciation
        };
    });

    const globalAverage = subjectsUI.length > 0
        ? (subjectsUI.reduce((acc, s) => acc + (parseFloat(s.moyenne) * s.coef), 0) / subjectsUI.reduce((acc, s) => acc + s.coef, 0)).toFixed(2)
        : '--';

    const handleDownloadBulletin = async () => {
        if (!selectedChildId) return;

        try {
            const response = await api.get(`/parent/children/${selectedChildId}/bulletin`, {
                responseType: 'blob',
                params: { semestre_id: selectedTrimesterId }
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Bulletin_${currentChildData?.firstName || 'Eleve'}_${currentTrimester.nom}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Bulletin download failed", error);
            alert("Erreur lors du téléchargement du bulletin. Vérifiez que des notes sont disponibles.");
        }
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
                        trimesters={availableSemesters.map(s => ({ id: s.id, title: s.nom }))}
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
                            <span className="text-6xl font-black text-blue-400">{globalAverage}</span>
                            <span className="text-2xl font-bold text-blue-400/40">/20</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-12">
                        <div className="text-center md:text-right">
                            <div className="text-3xl font-black">{subjectsUI.length}</div>
                            <div className="text-white/40 text-[12px] font-bold uppercase tracking-wider">Matières</div>
                        </div>
                        <div className="text-center md:text-right">
                            <div className="text-3xl font-black text-green-500 flex items-center justify-center md:justify-end gap-2">
                                100%
                                <TrendingUp size={24} />
                            </div>
                            <div className="text-white/40 text-[12px] font-bold uppercase tracking-wider">Taux de réussite</div>
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
                            {subjectsUI.length > 0 ? (
                                subjectsUI.map((subject, idx) => (
                                    <tr key={idx} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="font-bold group-hover:text-[#eb8e3a] transition-colors">{subject.name}</div>
                                        </td>
                                        <td className="px-4 py-6 text-center">
                                            <span className="bg-white/5 px-2.5 py-1 rounded-lg text-white/60 font-black text-xs border border-white/5">
                                                {subject.coef}
                                            </span>
                                        </td>
                                        <td className="px-4 py-6 text-center text-white/50 font-medium">--</td>
                                        <td className="px-4 py-6 text-center text-white/50 font-medium">--</td>
                                        <td className="px-4 py-6 text-center text-white/50 font-medium">--</td>
                                        <td className="px-4 py-6 text-center text-white/50 font-medium">--</td>
                                        <td className="px-4 py-6 text-center text-white/50 font-medium">--</td>
                                        <td className={`px-4 py-6 text-center font-black text-lg ${getMoyenneColor(subject.moyenne)}`}>
                                            {subject.moyenne}
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
                                            {isLoading ? <Loader2 size={48} className="animate-spin" /> : <Star size={48} strokeWidth={1} />}
                                            <p>{isLoading ? 'Chargement des notes...' : 'Aucune donnée disponible pour ce trimestre.'}</p>
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


