import React, { useState, useEffect } from 'react';
import { CreditCard, History, Wallet, Download, X, Smartphone, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import api from '@/api';

import ChildSelector from '../components/ChildSelector';

const Payments = ({ children, selectedChildId, setSelectedChildId }) => {
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentProvider, setPaymentProvider] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [amount, setAmount] = useState('50000');
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [paymentData, setPaymentData] = useState({
        summary: { totalPaid: 0, balance: 0 },
        transactions: []
    });

    useEffect(() => {
        if (selectedChildId) {
            const fetchPayments = async () => {
                setIsLoading(true);
                try {
                    // API endpoint not implemented yet
                    // const response = await api.get(`/parent/children/${selectedChildId}/payments`);
                    // setPaymentData(response.data);

                    // Mock data
                    setPaymentData({
                        summary: { totalPaid: 0, totalOwed: 0, balance: 0, status: 'en attente', currency: 'FCFA' },
                        transactions: []
                    });
                } catch (err) {
                    console.error("Failed to fetch payments", err);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchPayments();
        }
    }, [selectedChildId]);

    const transactions = paymentData.transactions;

    const handlePayment = async (e) => {
        e.preventDefault();
        if (!paymentProvider || !phoneNumber || !amount) {
            alert("Veuillez remplir tous les champs.");
            return;
        }
        setIsProcessing(true);
        try {
            // API endpoint not implemented yet
            // await api.post('/parent/payments/process', {
            //     eleve_id: selectedChildId,
            //     amount: amount,
            //     provider: paymentProvider,
            //     phone: phoneNumber
            // });

            // Mock success
            alert(`Fonctionnalité en développement.\nMontant: ${Number(amount).toLocaleString()} FCFA\nProvider: ${paymentProvider}\nTél: ${phoneNumber}`);
            setPaymentSuccess(true);

            setTimeout(() => {
                setShowPaymentModal(false);
                setPaymentSuccess(false);
                setPaymentProvider('');
                setPhoneNumber('');
            }, 2000);
        } catch (error) {
            console.error("Payment failed", error);
            alert("Erreur lors du traitement du paiement.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="space-y-8 relative">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-white">Paiements & Frais</h1>
                    <p className="text-white/40 mt-1">Gérez les frais de scolarité et consultez l'historique des paiements.</p>
                </div>
                <div className="flex items-center gap-4">
                    <ChildSelector
                        children={children}
                        selectedChildId={selectedChildId}
                        onSelect={setSelectedChildId}
                    />
                    <button
                        onClick={() => setShowPaymentModal(true)}
                        className="parent-btn-primary flex items-center gap-2 whitespace-nowrap"
                    >
                        <CreditCard size={18} />
                        Effectuer un paiement
                    </button>
                </div>
            </header>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/5 rounded-3xl p-6 border border-white/5">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500">
                            <Wallet size={24} />
                        </div>
                        <span className="text-sm text-white/40 font-medium">Total Dû</span>
                    </div>
                    <p className="text-2xl font-bold text-white">
                        {isLoading ? '...' : `${Number(paymentData.summary.totalOwed).toLocaleString()} ${paymentData.summary.currency}`}
                    </p>
                </div>
                <div className="bg-white/5 rounded-3xl p-6 border border-white/5">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-xl bg-green-500/10 text-green-500">
                            <CreditCard size={24} />
                        </div>
                        <span className="text-sm text-white/40 font-medium">Total Payé</span>
                    </div>
                    <p className="text-2xl font-bold text-white">
                        {isLoading ? '...' : `${Number(paymentData.summary.totalPaid).toLocaleString()} ${paymentData.summary.currency}`}
                    </p>
                </div>
                <div className="bg-white/5 rounded-3xl p-6 border border-white/5 relative overflow-hidden">
                    <div className={`absolute top-0 right-0 px-3 py-1 text-[10px] font-bold uppercase rounded-bl-xl ${paymentData.summary.status === 'soldé' ? 'bg-green-500 text-white' : 'bg-orange-500 text-white'}`}>
                        {isLoading ? '...' : paymentData.summary.status}
                    </div>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-xl bg-orange-500/10 text-orange-500">
                            <AlertCircle size={24} />
                        </div>
                        <span className="text-sm text-white/40 font-medium">Reste à payer</span>
                    </div>
                    <p className="text-2xl font-bold text-white">
                        {isLoading ? '...' : `${Number(paymentData.summary.balance).toLocaleString()} ${paymentData.summary.currency}`}
                    </p>
                </div>
            </div>

            {/* History Table */}
            <section className="bg-white/5 rounded-3xl border border-white/5 overflow-hidden">
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white flex items-center gap-3">
                        <History size={20} className="text-white/40" />
                        Historique des Paiements
                    </h2>
                    <button className="text-xs font-bold text-[#eb8e3a] uppercase tracking-wider hover:underline">Tout télécharger</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="text-xs text-white/20 uppercase bg-white/5">
                            <tr>
                                <th className="px-6 py-4">ID</th>
                                <th className="px-6 py-4">Élève</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Méthode</th>
                                <th className="px-6 py-4">Montant</th>
                                <th className="px-6 py-4">Statut</th>
                                <th className="px-6 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-sm">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-20 text-center text-white/20 italic">
                                        <div className="flex flex-col items-center gap-4">
                                            <Loader2 size={48} className="animate-spin" />
                                            <p>Chargement de l'historique...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : transactions.length > 0 ? (
                                transactions.map((tx) => (
                                    <tr key={tx.id} className="text-white/60 hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 font-mono">{tx.id}</td>
                                        <td className="px-6 py-4 text-white font-medium">{tx.student}</td>
                                        <td className="px-6 py-4">{tx.date}</td>
                                        <td className="px-6 py-4">{tx.method}</td>
                                        <td className="px-6 py-4 text-[#eb8e3a] font-bold">{tx.amount}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 rounded-full bg-green-500/10 text-green-500 text-[10px] uppercase font-bold text-center inline-block min-w-[80px]">
                                                {tx.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button className="p-2 hover:bg-white/5 rounded-lg text-white/20 hover:text-white transition-all">
                                                <Download size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="px-6 py-20 text-center text-white/20 italic">
                                        <div className="flex flex-col items-center gap-4">
                                            <History size={48} strokeWidth={1} />
                                            <p>Aucune transaction enregistrée.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Payment Modal */}
            {showPaymentModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/60 backdrop-blur-sm">
                    <div className="glass-card w-full max-w-md animate-in fade-in zoom-in duration-300 relative overflow-hidden">
                        <div className="p-6 border-b border-white/5 flex items-center justify-between">
                            <h3 className="text-xl font-bold flex items-center gap-2 text-white">
                                <Smartphone className="text-orange-400" /> Paiement Mobile Money
                            </h3>
                            <button
                                onClick={() => setShowPaymentModal(false)}
                                className="p-2 hover:bg-white/5 rounded-full text-white/40 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-8">
                            {paymentSuccess ? (
                                <div className="text-center space-y-4 py-8 animate-in slide-in-from-bottom duration-500">
                                    <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto">
                                        <CheckCircle size={32} />
                                    </div>
                                    <h4 className="text-xl font-bold text-white">Paiement Réussi !</h4>
                                    <p className="text-white/60">Votre transaction a été validée avec succès. Vous allez être redirigé...</p>
                                </div>
                            ) : (
                                <form onSubmit={handlePayment} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm text-white/40">Montant à payer (FCFA)</label>
                                        <input
                                            type="number"
                                            className="parent-input"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            placeholder="Ex: 50000"
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-sm text-white/40">Sélectionnez votre opérateur</label>
                                        <div className="grid grid-cols-3 gap-3">
                                            {[
                                                { id: 'orange', name: 'Orange', color: 'bg-[#FF7900]' },
                                                { id: 'mtn', name: 'MTN', color: 'bg-[#FFCC00]' },
                                                { id: 'moov', name: 'Moov', color: 'bg-[#005CA9]' }
                                            ].map((op) => (
                                                <button
                                                    key={op.id}
                                                    type="button"
                                                    onClick={() => setPaymentProvider(op.id)}
                                                    className={`p-3 rounded-xl flex flex-col items-center gap-2 transition-all border-2 ${paymentProvider === op.id ? 'border-orange-400 bg-white/10' : 'border-transparent bg-white/5 hover:bg-white/10'}`}
                                                >
                                                    <div className={`w-8 h-8 rounded-lg ${op.color} flex items-center justify-center font-bold text-white text-[10px]`}>
                                                        {op.name[0]}
                                                    </div>
                                                    <span className="text-[10px] font-bold text-white/80">{op.name}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm text-white/40">Numéro de téléphone</label>
                                        <div className="relative">
                                            <Smartphone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                                            <input
                                                type="tel"
                                                className="parent-input pl-12"
                                                placeholder="01 02 03 04 05"
                                                value={phoneNumber}
                                                onChange={(e) => setPhoneNumber(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 p-4 bg-orange-400/5 rounded-2xl border border-orange-400/10">
                                        <AlertCircle size={16} className="text-orange-400 shrink-0 mt-0.5" />
                                        <p className="text-[10px] text-white/40 leading-relaxed">
                                            Assurez-vous d'avoir le solde nécessaire sur votre compte Mobile Money. Une notification de validation apparaîtra sur votre téléphone après avoir lancé le paiement.
                                        </p>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isProcessing}
                                        className={`parent-btn-primary w-full flex items-center justify-center gap-2 py-4 ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        {isProcessing ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-dark/30 border-t-dark rounded-full animate-spin" />
                                                Traitement...
                                            </>
                                        ) : (
                                            `Payer ${Number(amount).toLocaleString()} FCFA`
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Payments;
