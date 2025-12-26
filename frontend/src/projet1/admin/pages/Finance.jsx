import React, { useState, useEffect } from 'react';
import {
    Wallet, CreditCard, TrendingUp, History,
    ArrowUpRight, ArrowDownRight, Search, Filter,
    Download, Printer, AlertCircle, Loader2,
    Users, DollarSign, Calendar, Smartphone
} from 'lucide-react';
import api from '@/api';

const Finance = () => {
    const [stats, setStats] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview'); // overview, transactions, debts
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchFinanceData = async () => {
            try {
                setIsLoading(true);
                const [statsRes, transRes] = await Promise.all([
                    api.get('/admin/finance/stats'),
                    api.get('/admin/finance/payments')
                ]);
                setStats(statsRes.data.stats);
                setTransactions(transRes.data);
                setIsLoading(false);
            } catch (error) {
                console.error("Failed to fetch finance data", error);
                setIsLoading(false);
            }
        };

        fetchFinanceData();
    }, []);

    if (isLoading) {
        return (
            <div className="h-[calc(100vh-150px)] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3 text-slate-400">
                    <Loader2 size={40} className="animate-spin text-brand-primary" />
                    <p className="text-sm font-medium">Chargement des données financières...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Gestion Financière</h1>
                    <p className="text-slate-500 text-sm">Suivi des revenus, des paiements et des impayés.</p>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
                        <Download size={16} />
                        Exporter Rapport
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg text-sm font-bold hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20">
                        <Printer size={16} />
                        Imprimer Reçus
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Revenu Total"
                    value={`${Number(stats?.total_revenue || 0).toLocaleString()} FCFA`}
                    trend="+12.5%"
                    icon={DollarSign}
                    color="text-green-600"
                    bgColor="bg-green-50"
                />
                <StatCard
                    title="Taux de Recouvrement"
                    value={`${stats?.recovery_rate || 0}%`}
                    trend="Objectif: 100%"
                    icon={TrendingUp}
                    color="text-brand-primary"
                    bgColor="bg-orange-50"
                />
                <StatCard
                    title="Reste à Collecter"
                    value={`${Number(stats?.balance_to_collect || 0).toLocaleString()} FCFA`}
                    trend="Automne 2024"
                    icon={Wallet}
                    color="text-blue-600"
                    bgColor="bg-blue-50"
                />
                <StatCard
                    title="Transactions (Mois)"
                    value={transactions.length}
                    trend="Derniers 30 jours"
                    icon={History}
                    color="text-purple-600"
                    bgColor="bg-purple-50"
                />
            </div>

            {/* Main Content Area */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="border-b border-slate-200 bg-slate-50/50 p-4">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="flex bg-slate-200 p-1 rounded-lg w-full sm:w-auto">
                            {['overview', 'transactions'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`flex-1 sm:flex-none px-6 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === tab ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    {tab === 'overview' ? 'Vue d\'ensemble' : 'Historique Complet'}
                                </button>
                            ))}
                        </div>
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                placeholder="Rechercher une transaction..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-brand-primary text-slate-800"
                            />
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4">Réf / Date</th>
                                <th className="px-6 py-4">Élève / Classe</th>
                                <th className="px-6 py-4">Mode</th>
                                <th className="px-6 py-4">Tranche</th>
                                <th className="px-6 py-4 text-right">Montant</th>
                                <th className="px-6 py-4 text-center">Statut</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {transactions.length > 0 ? transactions.map((tx) => (
                                <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-mono text-slate-800 font-bold">{tx.reference_paiement || `#${tx.id}`}</div>
                                        <div className="text-[10px] text-slate-400 mt-0.5">{tx.date_paiement}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-slate-800">{tx.eleve?.user?.nom} {tx.eleve?.user?.prenom}</div>
                                        <div className="text-xs text-brand-primary font-medium">{tx.eleve?.classe?.nom}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-slate-600">
                                            <Smartphone size={14} className="text-slate-400" />
                                            {tx.mode_paiement}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 italic">
                                        {tx.tranche?.nom || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 text-right font-black text-slate-800">
                                        {Number(tx.montant_paye).toLocaleString()} FCFA
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${tx.statut === 'payé' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-orange-100 text-orange-700 border border-orange-200'}`}>
                                            {tx.statut}
                                        </span>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-slate-500 italic">
                                        Aucune transaction enregistrée.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, trend, icon: Icon, color, bgColor }) => (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
        <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{title}</p>
            <h3 className={`text-xl font-black ${color}`}>{value}</h3>
            <p className="text-[10px] text-slate-500 mt-2 font-medium">{trend}</p>
        </div>
        <div className={`p-3 ${bgColor} ${color} rounded-xl`}>
            <Icon size={24} />
        </div>
    </div>
);

export default Finance;
