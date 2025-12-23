import React, { useState } from 'react';
import StudentCardPreview from './StudentCardPreview';
import { 
  ArrowLeft, User, Phone, Mail, MapPin, Calendar, 
  School, FileText, Download, Printer, CreditCard, 
  Edit, Shield, Clock 
} from 'lucide-react';

const StudentProfile = ({ student, onBack }) => {
  const [activeTab, setActiveTab] = useState('infos'); // infos, scolarite, documents
  const [showCard, setShowCard] = useState(false);

  if (!student) return null;

  // Données étendues simulées (car la liste ne donne pas tout)
  const fullData = {
    ...student,
    dob: '12 Mars 2009',
    pob: 'Cotonou',
    address: 'Qtr. Fidjrossè, Maison 124',
    email: 'parent.contact@gmail.com',
    history: [
      { year: '2024-2025', class: student.class, result: 'En cours' },
      { year: '2023-2024', class: '3ème', result: 'Admis (14.50)' },
      { year: '2022-2023', class: '4ème', result: 'Admis (13.20)' },
    ]
  };

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

      {/* 2. En-tête Profil (Carte d'identité visuelle) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 relative overflow-hidden">
        {/* Background décoratif */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 rounded-full -mr-32 -mt-32 opacity-50 pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center relative z-10">
            {/* Avatar */}
            <div className="w-24 h-24 bg-slate-100 rounded-2xl border-4 border-white shadow-lg flex items-center justify-center text-3xl font-bold text-slate-400">
                {fullData.firstName[0]}{fullData.lastName[0]}
            </div>
            
            {/* Infos Principales */}
            <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-1">
                    <h1 className="text-3xl font-bold text-slate-800">{fullData.firstName} {fullData.lastName}</h1>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${fullData.status === 'active' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'}`}>
                        {fullData.status === 'active' ? 'Actif' : 'Inactif'}
                    </span>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-slate-500 font-medium">
                    <div className="flex items-center gap-1.5">
                        <School size={18} className="text-brand-primary" />
                        Classe : <span className="text-slate-800">{fullData.class}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Shield size={18} className="text-brand-primary" />
                        Matricule : <span className="font-mono text-slate-800">{fullData.id}</span>
                    </div>
                </div>
            </div>

            {showCard && (
                <StudentCardPreview 
                student={fullData} 
                onClose={() => setShowCard(false)} 
                />
            )}

            {/* Actions Rapides En-tête */}
            <div className="flex gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors shadow-sm">
                    <Edit size={16} />
                    Modifier
                </button>
                <button 
                    onClick={() => setShowCard(true)} // <--- L'événement ici
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
                        className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
                            activeTab === tab 
                            ? 'bg-slate-800 text-white shadow-md' 
                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                        }`}
                    >
                        {tab === 'infos' && 'Informations Personnelles'}
                        {tab === 'scolarite' && 'Parcours Scolaire'}
                        {tab === 'documents' && 'Documents (4)'}
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
                                <InfoItem icon={Calendar} label="Date de naissance" value={`${fullData.dob} (16 ans)`} />
                                <InfoItem icon={MapPin} label="Lieu de naissance" value={fullData.pob} />
                                <InfoItem icon={User} label="Genre" value={fullData.gender === 'M' ? 'Masculin' : 'Féminin'} />
                                <InfoItem icon={MapPin} label="Adresse de résidence" value={fullData.address} />
                            </div>
                        </div>

                        {/* Responsables */}
                        <div>
                            <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Responsables & Contacts</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InfoItem icon={User} label="Nom du Responsable" value={fullData.parent} />
                                <InfoItem icon={Phone} label="Téléphone principal" value={fullData.phone} highlight />
                                <InfoItem icon={Mail} label="Email" value={fullData.email} />
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
                            {fullData.history.map((item, idx) => (
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
                            <button className="text-sm text-brand-primary font-medium hover:underline">+ Ajouter un document</button>
                        </div>
                        {[
                            { name: 'Acte de naissance.pdf', date: 'Ajouté le 12 Sept 2024' },
                            { name: 'Photo identité.jpg', date: 'Ajouté le 12 Sept 2024' },
                            { name: 'Certificat scolarité an dernier.pdf', date: 'Ajouté le 15 Sept 2024' },
                            { name: 'Fiche inscription signée.pdf', date: 'Ajouté le 20 Sept 2024' },
                        ].map((doc, i) => (
                            <div key={i} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-red-50 text-red-600 rounded-lg">
                                        <FileText size={20} />
                                    </div>
                                    <div>
                                        <div className="font-medium text-slate-800">{doc.name}</div>
                                        <div className="text-xs text-slate-500">{doc.date}</div>
                                    </div>
                                </div>
                                <button className="p-2 text-slate-400 hover:text-slate-800">
                                    <Download size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>

        {/* COLONNE DROITE (Actions & Stats) */}
        <div className="space-y-6">
            
            {/* Widget Présence (Placeholder pour Projet 4 mais utile ici) */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Clock size={18} className="text-brand-primary"/> 
                    Assiduité (Trimestre 1)
                </h3>
                <div className="space-y-4">
                    <div className="flex justify-between items-end">
                        <div className="text-3xl font-bold text-slate-800">98%</div>
                        <div className="text-xs text-green-600 font-bold mb-1">Excellent</div>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '98%' }}></div>
                    </div>
                    <div className="text-xs text-slate-500 flex justify-between">
                        <span>Heures justifiées: 12h</span>
                        <span>Absences: 2h</span>
                    </div>
                </div>
            </div>

            {/* Widget Paiement (Placeholder pour Projet 2) */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <CreditCard size={18} className="text-brand-primary"/> 
                    Scolarité
                </h3>
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-100 mb-4">
                    <div className="text-sm text-orange-800 font-medium">Reste à payer</div>
                    <div className="text-2xl font-bold text-orange-600">75.000 FCFA</div>
                </div>
                <button className="w-full py-2 bg-white border border-slate-200 text-slate-600 font-medium rounded-lg text-sm hover:bg-slate-50">
                    Voir détails financiers
                </button>
            </div>

            {/* Autres Actions */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-2">
                <button className="w-full flex items-center justify-start gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors text-sm font-medium">
                    <Printer size={18} />
                    Imprimer Certificat de scolarité
                </button>
                <button className="w-full flex items-center justify-start gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors text-sm font-medium">
                    <Mail size={18} />
                    Envoyer un mail aux parents
                </button>
            </div>

        </div>
      </div>
    </div>
  );
};

// Petit composant helper pour les lignes d'info
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