import React, { useState, useEffect } from 'react';
import StudentCardPreview from './StudentCardPreview';
import {
    ArrowLeft, User, Phone, Mail, MapPin, Calendar,
    School, FileText, Download, Printer, CreditCard,
    Edit, Shield, Clock, Loader2
} from 'lucide-react';
import StudentCardsPage from './StudentCardsPage';
import api from '@/api';

const StudentProfile = ({ student, onBack }) => {
    const [activeTab, setActiveTab] = useState('infos');
    const [showCard, setShowCard] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // 1. État de chargement

    const [fullData, setFullData] = useState(null);
    const [recentNotes, setRecentNotes] = useState([]);
    const [average, setAverage] = useState(null);

    // Fetch student data from API
    useEffect(() => {
        if (student && student.id) {
            const fetchDetails = async () => {
                try {
                    setIsLoading(true);
            const response = await api.get(`/admin/students/${student.id}`);
            setFullData(response.data);
            setRecentNotes(response.data.recent_notes || []);
            setAverage(response.data.average);
            setIsLoading(false);
                } catch (error) {
                    console.error("Failed to fetch student details", error);
                    setIsLoading(false);
                }
            };
            fetchDetails();
        }
    }, [student]);

    const handleDownloadBulletin = async () => {
        try {
            const response = await api.get(`/admin/bulletins/download/${student.id}`, {
                responseType: 'blob', // Important for handling direct file download
                params: { semestre_id: 1 } // Default to semester 1
            });

            // Create a link to download the file
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Bulletin_${student.lastName}_S1.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Bulletin download failed", error);
            alert("Erreur lors du téléchargement du bulletin.");
        }
    };

    if (!student) return null;

    // Helper mapping for display
    const getDisplayData = () => {
        if (!fullData) return student;
        const studentData = fullData.student || fullData;
        return {
            ...student,
            dob: studentData.date_naissance ? new Date(studentData.date_naissance).toLocaleDateString('fr-FR') : '--/--/----',
            pob: studentData.lieu_naissance || '--',
            address: studentData.adresse || '--',
            email: studentData.user?.email || '--',
            history: fullData.inscriptions_history || studentData.inscriptions?.map(i => ({
                year: i.anneeScolaire?.annee || i.annee_scolaire || 'N/A',
                class: studentData.classe?.nom || i.classe_nom || 'N/A',
                result: i.statut === 'inscrit' ? 'En cours' : 'Terminé'
            })) || [],
            documents: studentData.documents?.map(doc => ({
                name: doc.nom_original || doc.type,
                date: doc.date_upload ? new Date(doc.date_upload).toLocaleDateString('fr-FR') : 'N/A',
                type: doc.type
            })) || [],
            finance: fullData.finance || {
                reste: '0 FCFA',
                statut: '--'
            },
            attendance: fullData.attendance || {
                rate: 0,
                justified: '0h',
                absent: '0h'
            }
        };
    };

    const displayData = getDisplayData();

    // 2. Loader
    if (isLoading) {
        return (
            <div className="h-[calc(100vh-150px)] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3 text-slate-400">
                    <Loader2 size={40} className="animate-spin text-brand-primary" />
                    <p className="text-sm font-medium">Chargement du dossier élève...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">

            {/* 1. Navigation Retour */}
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors group mb-2"
            >
                <div className="p-2 bg-white border border-slate-200 rounded-lg group-hover:border-slate-300 shadow-sm">
                    <ArrowLeft size={20} />
                </div>
                <span className="font-medium">Retour à l'annuaire</span>
            </button>

            {/* 2. En-tête Profil */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 relative overflow-hidden">
                {/* Background décoratif */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 rounded-full -mr-32 -mt-32 opacity-50 pointer-events-none"></div>

                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center relative z-10">
                    {/* Avatar */}
                    <div className="w-24 h-24 bg-slate-100 rounded-2xl border-4 border-white shadow-lg flex items-center justify-center text-3xl font-bold text-slate-400">
                        {displayData.firstName[0]}{displayData.lastName[0]}
                    </div>

                    {/* Infos Principales */}
                    <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-1">
                            <h1 className="text-3xl font-bold text-slate-800">{displayData.firstName} {displayData.lastName}</h1>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${displayData.status === 'active' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'}`}>
                                {displayData.status === 'active' ? 'Actif' : 'Inactif'}
                            </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-slate-500 font-medium">
                            <div className="flex items-center gap-1.5">
                                <School size={18} className="text-brand-primary" />
                                Classe : <span className="text-slate-800">{displayData.class}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Shield size={18} className="text-brand-primary" />
                                Matricule : <span className="font-mono text-slate-800">{displayData.id}</span>
                            </div>
                        </div>
                    </div>

                    {/* Modal Carte Scolaire */}
                    {showCard && (
                        <StudentCardPreview
                            student={fullData}
                            onClose={() => setShowCard(false)}
                        />
                    )}

                    {/* Actions Rapides En-tête */}
                    <div className="flex gap-3">
                        <button
                            onClick={() => alert(`Ouverture du mode modification pour ${displayData.firstName} ${displayData.lastName}`)}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors shadow-sm"
                        >
                            <Edit size={16} />
                            Modifier
                        </button>
                        <button
                            onClick={handleDownloadBulletin}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors shadow-sm"
                        >
                            <FileText size={16} className="text-brand-primary" />
                            Bulletin PDF
                        </button>
                        <button
                            onClick={() => setShowCard(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg font-bold hover:bg-orange-600 transition-colors shadow-md shadow-orange-500/20"
                        >
                            <CreditCard size={16} />
                            Carte Scolaire
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* COLONNE GAUCHE (Contenu Principal 2/3) */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Onglets de Navigation */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-1.5 flex gap-2">
                        {['infos', 'scolarite', 'documents'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${activeTab === tab
                                    ? 'bg-slate-800 text-white shadow-md'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                                    }`}
                            >
                                {tab === 'infos' && 'Informations Personnelles'}
                                {tab === 'scolarite' && 'Parcours Scolaire'}
                                {tab === 'documents' && `Documents (${displayData.documents.length})`}
                            </button>
                        ))}
                    </div>

                    {/* Contenu des Onglets */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 min-h-[400px]">

                        {/* VUE 1 : INFOS */}
                        {activeTab === 'infos' && (
                            <div className="space-y-8 animate-in fade-in zoom-in-95 duration-200">
                                {/* État Civil */}
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">État Civil</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <InfoItem icon={Calendar} label="Date de naissance" value={displayData.dob} />
                                        <InfoItem icon={MapPin} label="Lieu de naissance" value={displayData.pob} />
                                        <InfoItem icon={User} label="Genre" value={displayData.gender === 'M' ? 'Masculin' : 'Féminin'} />
                                        <InfoItem icon={MapPin} label="Adresse de résidence" value={displayData.address} />
                                    </div>
                                </div>

                                {/* Moyenne Générale */}
                                {average && (
                                    <div className="bg-brand-primary/10 p-4 rounded-xl border border-brand-primary/20 flex items-center justify-between">
                                        <div>
                                            <div className="text-sm font-bold text-brand-primary uppercase tracking-wider">Moyenne Générale</div>
                                            <div className="text-xs text-slate-500">Calculée sur l'ensemble des notes enregistrées</div>
                                        </div>
                                        <div className="text-3xl font-black text-brand-primary">{average}/20</div>
                                    </div>
                                )}

                                {/* Notes Récentes */}
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Notes Récentes</h3>
                                    <div className="space-y-3">
                                        {recentNotes.length > 0 ? recentNotes.map((note, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center font-bold text-brand-primary shadow-sm border border-slate-100">
                                                        {note.note}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-slate-800">{note.matiere?.nom}</div>
                                                        <div className="text-xs text-slate-500">{note.semestre?.nom}</div>
                                                    </div>
                                                </div>
                                                <div className="text-sm font-black text-brand-primary">
                                                    /20
                                                </div>
                                            </div>
                                        )) : (
                                            <div className="text-center py-4 text-slate-400 text-sm italic">
                                                Aucune note enregistrée pour le moment.
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Responsables */}
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Responsables & Contacts</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <InfoItem icon={User} label="Nom du Responsable" value={displayData.parent} />
                                        <InfoItem icon={Phone} label="Téléphone principal" value={displayData.phone} highlight />
                                        <InfoItem icon={Mail} label="Email" value={displayData.email} />
                                        <InfoItem icon={Phone} label="Téléphone secondaire" value="Non renseigné" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* VUE 2 : SCOLARITÉ */}
                        {activeTab === 'scolarite' && (
                            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
                                <h3 className="text-lg font-bold text-slate-800 mb-4">Historique académique</h3>
                                <div className="relative border-l-2 border-slate-200 ml-3 space-y-8 pb-4">
                                    {displayData.history.map((item, idx) => (
                                        <div key={idx} className="relative pl-8">
                                            <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white ${idx === 0 ? 'bg-brand-primary' : 'bg-slate-300'}`}></div>
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-slate-50 p-4 rounded-lg border border-slate-100">
                                                <div>
                                                    <span className="text-sm font-bold text-brand-primary">{item.year}</span>
                                                    <div className="font-bold text-slate-800 text-lg">{item.class}</div>
                                                </div>
                                                <div className="mt-2 sm:mt-0">
                                                    <span className={`px-3 py-1 rounded text-xs font-bold ${item.result.includes('En cours') ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                                                        {item.result}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* VUE 3 : DOCUMENTS */}
                        {activeTab === 'documents' && (
                            <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-bold text-slate-800">Dossier Numérique</h3>
                                    <button
                                        onClick={async () => {
                                            const input = document.createElement('input');
                                            input.type = 'file';
                                            input.accept = 'image/*,.pdf';
                                            input.onchange = async (e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    const formData = new FormData();
                                                    formData.append('type', 'autre');
                                                    formData.append('file', file);
                                                    try {
                                                        await api.post(`/admin/eleves/${student.id}/documents`, formData, {
                                                            headers: { 'Content-Type': 'multipart/form-data' }
                                                        });
                                                        alert('Document ajouté avec succès');
                                                        // Refresh
                                                        const response = await api.get(`/admin/students/${student.id}`);
                                                        setFullData(response.data);
                                                    } catch (error) {
                                                        alert('Erreur lors de l\'upload: ' + (error.response?.data?.message || error.message));
                                                    }
                                                }
                                            };
                                            input.click();
                                        }}
                                        className="text-sm text-brand-primary font-medium hover:underline"
                                    >
                                        + Ajouter un document
                                    </button>
                                </div>
                                {displayData.documents && displayData.documents.length > 0 ? (
                                    displayData.documents.map((doc, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-red-50 text-red-600 rounded-lg">
                                                    <FileText size={20} />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-slate-800">{doc.name}</div>
                                                    <div className="text-xs text-slate-500">{doc.date} • {doc.type}</div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={async () => {
                                                    try {
                                                        const response = await api.get(`/admin/eleves/${student.id}/documents`, { responseType: 'blob' });
                                                        const url = window.URL.createObjectURL(new Blob([response.data]));
                                                        const link = document.createElement('a');
                                                        link.href = url;
                                                        link.setAttribute('download', doc.name);
                                                        document.body.appendChild(link);
                                                        link.click();
                                                        link.remove();
                                                    } catch (error) {
                                                        alert('Erreur lors du téléchargement');
                                                    }
                                                }}
                                                className="p-2 text-slate-400 hover:text-slate-800"
                                            >
                                                <Download size={18} />
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-slate-400">
                                        <FileText size={48} className="mx-auto mb-3 opacity-50" />
                                        <p>Aucun document joint</p>
                                    </div>
                                )}
                            </div>
                        )}

                    </div>
                </div>

                {/* COLONNE DROITE (Actions & Stats) */}
                <div className="space-y-6">

                    {/* Widget Présence (Lien avec table `presence`) */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Clock size={18} className="text-brand-primary" />
                            Assiduité (Trimestre 1)
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-end">
                                <div className="text-3xl font-bold text-slate-800">{displayData.attendance?.rate || 0}%</div>
                                <div className="text-xs text-green-600 font-bold mb-1">Excellent</div>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2">
                                <div className="bg-green-500 h-2 rounded-full" style={{ width: `${displayData.attendance?.rate || 0}%` }}></div>
                            </div>
                            <div className="text-xs text-slate-500 flex justify-between">
                                <span>Justifiées: {displayData.attendance?.justified || '0h'}</span>
                                <span>Absences: {displayData.attendance?.absent || '0h'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Widget Paiement (Lien avec table `paiement`) */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <CreditCard size={18} className="text-brand-primary" />
                            Scolarité
                        </h3>
                        <div className="p-4 bg-orange-50 rounded-lg border border-orange-100 mb-4">
                            <div className="text-sm text-orange-800 font-medium">Reste à payer</div>
                            <div className="text-2xl font-bold text-orange-600">{displayData.finance?.reste || '0 FCFA'}</div>
                        </div>
                        <button className="w-full py-2 bg-white border border-slate-200 text-slate-600 font-medium rounded-lg text-sm hover:bg-slate-50">
                            Voir détails financiers
                        </button>
                    </div>

                    {/* Autres Actions */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-2">
                        <button
                            onClick={() => alert(`Génération du certificat de scolarité pour ${fullData.lastName}...`)}
                            className="w-full flex items-center justify-start gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors text-sm font-medium"
                        >
                            <Printer size={18} />
                            Imprimer Certificat de scolarité
                        </button>
                        <button
                            onClick={() => alert(`Ouverture du client mail pour : ${fullData.email}`)}
                            className="w-full flex items-center justify-start gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors text-sm font-medium"
                        >
                            <Mail size={18} />
                            Envoyer un mail aux parents
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

// Helper
const InfoItem = ({ icon: Icon, label, value, highlight = false }) => (
    <div className="flex items-start gap-3">
        <div className="mt-1 text-slate-400">
            <Icon size={18} />
        </div>
        <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</div>
            <div className={`font-medium ${highlight ? 'text-brand-primary font-bold' : 'text-slate-800'}`}>
                {value || '-'}
            </div>
        </div>
    </div>
);

export default StudentProfile;