import React from 'react';
import { CreditCard, History, Wallet, Download } from 'lucide-react';

const Payments = () => {
    const transactions = [
        { id: 'TX001', student: 'Jean Dupont', date: '15/10/2025', amount: '150,000 FCFA', method: 'Momo', status: 'Completed' },
        { id: 'TX002', student: 'Marie Dupont', date: '12/09/2025', amount: '200,000 FCFA', method: 'Card', status: 'Completed' },
    ];

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-white">Payments & Fees</h1>
                <p className="text-white/40 mt-1">Manage school fees and view payment history.</p>
            </header>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/5 rounded-3xl p-6 border border-white/5">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-xl bg-green-500/10 text-green-500">
                            <Wallet size={24} />
                        </div>
                        <span className="text-sm text-white/40 font-medium">Total Paid</span>
                    </div>
                    <p className="text-2xl font-bold text-white">350,000 FCFA</p>
                </div>
                <div className="bg-white/5 rounded-3xl p-6 border border-white/5">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-xl bg-orange-500/10 text-orange-500">
                            <CreditCard size={24} />
                        </div>
                        <span className="text-sm text-white/40 font-medium">Remaining Balance</span>
                    </div>
                    <p className="text-2xl font-bold text-white">150,000 FCFA</p>
                </div>
            </div>

            {/* History Table */}
            <section className="bg-white/5 rounded-3xl border border-white/5 overflow-hidden">
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white flex items-center gap-3">
                        <History size={20} className="text-white/40" />
                        Payment History
                    </h2>
                    <button className="text-xs font-bold text-[#eb8e3a] uppercase tracking-wider hover:underline">Download All</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="text-xs text-white/20 uppercase bg-white/5">
                            <tr>
                                <th className="px-6 py-4">ID</th>
                                <th className="px-6 py-4">Student</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Method</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-sm">
                            {transactions.map((tx) => (
                                <tr key={tx.id} className="text-white/60 hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 font-mono">{tx.id}</td>
                                    <td className="px-6 py-4 text-white font-medium">{tx.student}</td>
                                    <td className="px-6 py-4">{tx.date}</td>
                                    <td className="px-6 py-4">{tx.method}</td>
                                    <td className="px-6 py-4 text-[#eb8e3a] font-bold">{tx.amount}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 rounded-full bg-green-500/10 text-green-500 text-[10px] uppercase font-bold">
                                            {tx.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button className="p-2 hover:bg-white/5 rounded-lg text-white/20 hover:text-white transition-all">
                                            <Download size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
};

export default Payments;
