import React, { useState } from 'react';
import {
    FileText, Download, Eye, Search, Filter,
    Calendar, User, CheckCircle, Clock
} from 'lucide-react';

const DocumentsHistory = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [docType, setDocType] = useState('all');

    const [documents] = useState([]);

    const filteredDocs = documents.filter(doc => {
        const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.student.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = docType === 'all' || doc.type === docType;
        return matchesSearch && matchesType;
    });

    const getDocIcon = (type) => {
        switch (type) {
            case 'Reçu': return 'bg-green-100 text-green-600';
            case 'Certificat': return 'bg-blue-100 text-blue-600';
            case 'Dossier': return 'bg-orange-100 text-orange-600';
            case 'Bulletin': return 'bg-purple-100 text-purple-600';
            default: return 'bg-slate-100 text-slate-600';
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <FileText className="text-brand-primary" size={28} />
                    Historique des Documents
                </h1>
                <p className="text-slate-500 text-sm mt-1">
                    Retrouvez et téléchargez tous les documents générés par le système.
                </p>
            </div>

            {/* Filtres & Recherche */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Rechercher un document ou un élève..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 text-slate-800"
                    />
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                    <select
                        className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-brand-primary/20"
                        value={docType}
                        onChange={(e) => setDocType(e.target.value)}
                    >
                        <option value="all">Tous les types</option>
                        <option value="Reçu">Reçus</option>
                        <option value="Dossier">Dossiers d'inscription</option>
                        <option value="Certificat">Certificats</option>
                        <option value="Bulletin">Bulletins</option>
                    </select>
                </div>
            </div>

            {/* Liste des documents */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden text-slate-800">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Nom du Document</th>
                            <th className="px-6 py-4">Type</th>
                            <th className="px-6 py-4 text-center">Date de génération</th>
                            <th className="px-6 py-4 text-center">Statut</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredDocs.length > 0 ? (
                            filteredDocs.map((doc) => (
                                <tr key={doc.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${getDocIcon(doc.type)}`}>
                                                <FileText size={18} />
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-900">{doc.name}</div>
                                                <div className="text-xs text-slate-500 flex items-center gap-1">
                                                    <User size={12} /> {doc.student} • {doc.class}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs font-medium px-2 py-1 bg-slate-100 rounded-full text-slate-600">
                                            {doc.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="text-sm text-slate-600 flex items-center justify-center gap-1">
                                            <Calendar size={14} className="text-slate-400" />
                                            {doc.date}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${doc.status === 'Signé' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                            }`}>
                                            {doc.status === 'Signé' ? <CheckCircle size={10} /> : <Clock size={10} />}
                                            {doc.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => alert(`Ouverture de l'aperçu sécurisé pour le document : ${doc.name}`)}
                                                className="p-2 text-slate-400 hover:text-brand-primary hover:bg-orange-50 rounded-lg transition-colors border border-transparent hover:border-orange-100"
                                                title="Aperçu"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <button
                                                onClick={() => alert(`Le document "${doc.name}" est en cours de téléchargement...`)}
                                                className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors border border-transparent hover:border-green-100"
                                                title="Télécharger"
                                            >
                                                <Download size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="px-6 py-12 text-center text-slate-500 italic">
                                    Aucun document ne correspond à votre recherche.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DocumentsHistory;
