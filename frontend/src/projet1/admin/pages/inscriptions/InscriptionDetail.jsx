import React, { useState, useEffect } from 'react';
import {
  ArrowLeft, Calendar, MapPin, User, Phone, Mail, FileText,
  CheckCircle, XCircle, AlertTriangle, Download, Printer, Loader2, IdCard
} from 'lucide-react';

const InscriptionDetail = ({ data, onBack, onValidate, onReject, onNavigate }) => {
  const [isLoading, setIsLoading] = useState(true);

  // 1. Simulation du chargement des détails complets
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  if (!data) return null;

  // 2. Utilisation des données réelles (sera hydraté par l'API)
  const fullData = {
    ...data,
    birthDate: data.birthDate || '--',
    birthPlace: data.birthPlace || '--',
    gender: data.gender || '--',
    previousSchool: data.previousSchool || '--',
    parent: data.parent || {
      name: '--',
      job: '--',
      phone: '--',
      email: data.email || '--'
    },
    documents: data.documents || []
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'validated': return 'bg-green-100 text-green-700 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-orange-100 text-orange-700 border-orange-200';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'validated': return 'Inscription Validée';
      case 'rejected': return 'Dossier Rejeté';
      default: return 'En attente de validation';
    }
  };

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-150px)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <Loader2 size={40} className="animate-spin text-brand-primary" />
          <p className="text-sm font-medium">Récupération du dossier...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
      {/* 1. Header & Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors group"
        >
          <div className="p-2 bg-white border border-slate-200 rounded-lg group-hover:border-slate-300 shadow-sm">
            <ArrowLeft size={20} />
          </div>
          <span className="font-medium">Retour à la liste</span>
        </button>

        <div className="flex gap-3">
          <button
            onClick={() => alert(`Impression de la fiche d'inscription complète de ${fullData.firstName}...`)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 font-medium shadow-sm transition-colors"
          >
            <Printer size={18} />
            Imprimer fiche
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* COLONNE GAUCHE : Informations (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Carte Identité Élève */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-start">
              <div className="flex gap-4">
                <div className="w-20 h-20 bg-slate-100 rounded-xl flex items-center justify-center text-2xl font-bold text-slate-400 border border-slate-200">
                  {fullData.firstName[0]}{fullData.lastName[0]}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-800">{fullData.firstName} {fullData.lastName}</h1>
                  <div className="text-slate-500 mt-1 flex items-center gap-2">
                    <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-xs">{fullData.id}</span>
                    <span>•</span>
                    <span>Classe demandée : <strong className="text-slate-800">{fullData.class}</strong></span>
                  </div>
                  <div className={`mt-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(fullData.status)}`}>
                    {getStatusLabel(fullData.status)}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Date de naissance</label>
                <div className="flex items-center gap-2 text-slate-800 font-medium">
                  <Calendar size={16} className="text-slate-400" />
                  {fullData.birthDate}
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Lieu de naissance</label>
                <div className="flex items-center gap-2 text-slate-800 font-medium">
                  <MapPin size={16} className="text-slate-400" />
                  {fullData.birthPlace}
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Genre</label>
                <div className="flex items-center gap-2 text-slate-800 font-medium">
                  <User size={16} className="text-slate-400" />
                  {fullData.gender}
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Ancienne École</label>
                <div className="flex items-center gap-2 text-slate-800 font-medium">
                  <MapPin size={16} className="text-slate-400" />
                  {fullData.previousSchool}
                </div>
              </div>
            </div>
          </div>

          {/* Carte Parents / Tuteurs */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-800">Informations Responsable</h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Nom complet</label>
                <div className="text-slate-800 font-medium">{fullData.parent.name}</div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Profession</label>
                <div className="text-slate-800 font-medium">{fullData.parent.job}</div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Téléphone</label>
                <div className="flex items-center gap-2 text-slate-800 font-medium">
                  <Phone size={16} className="text-slate-400" />
                  {fullData.parent.phone}
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Email</label>
                <div className="flex items-center gap-2 text-slate-800 font-medium">
                  <Mail size={16} className="text-slate-400" />
                  {fullData.parent.email}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* COLONNE DROITE : Actions & Documents */}
        <div className="space-y-6">
          {/* Panneau d'action INTELLIGENT */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h3 className="font-bold text-slate-800 mb-4">Traitement du dossier</h3>

            {fullData.status === 'validated' && (
              <div className="space-y-4">
                <div className="p-3 bg-green-50 text-green-700 text-sm rounded-lg border border-green-100 flex items-center gap-2">
                  <CheckCircle size={16} />
                  <span>Ce dossier est déjà validé.</span>
                </div>
                <button
                  onClick={() => onNavigate('qr')}
                  className="w-full h-12 flex items-center justify-center gap-3 bg-brand-dark text-white rounded-lg font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10"
                >
                  <IdCard size={20} className="text-brand-primary" />
                  Générer la carte scolaire
                </button>
                <div className="h-px bg-slate-100 my-4"></div>
              </div>
            )}
            {fullData.status === 'rejected' && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100 flex items-center gap-2">
                <XCircle size={16} />
                <span>Ce dossier a été rejeté.</span>
              </div>
            )}

            <div className="space-y-3">
              {(fullData.status === 'pending' || fullData.status === 'rejected') && (
                <button
                  onClick={() => onValidate(fullData.id)}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold shadow-sm shadow-green-500/20 transition-all"
                >
                  <CheckCircle size={18} />
                  {fullData.status === 'rejected' ? 'Reconsidérer et Valider' : "Valider l'inscription"}
                </button>
              )}

              {fullData.status === 'pending' && (
                <button
                  onClick={() => onReject(fullData.id)}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-lg font-bold transition-all"
                >
                  <XCircle size={18} />
                  Rejeter le dossier
                </button>
              )}

              <button
                onClick={() => alert(`Relance envoyée à ${fullData.parent.email}.\nLe parent recevra une notification pour compléter le dossier.`)}
                className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-orange-200 text-orange-600 hover:bg-orange-50 rounded-lg font-medium text-sm transition-all"
              >
                <AlertTriangle size={18} />
                {fullData.status === 'validated' ? 'Demander un document supplémentaire' : 'Demander complément'}
              </button>
            </div>
          </div>

          {/* Liste des documents */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800">Pièces jointes</h3>
              <span className="text-xs bg-slate-100 px-2 py-1 rounded font-medium text-slate-600">{fullData.documents.length} fichiers</span>
            </div>
            <div className="space-y-3">
              {fullData.documents.map((doc, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 border border-slate-100 rounded-lg hover:bg-slate-50 group cursor-pointer transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded">
                      <FileText size={16} />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-800">{doc.name}</div>
                      <div className="text-xs text-slate-500">{doc.size} • {doc.type}</div>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      alert(`Téléchargement du fichier : ${doc.name}`);
                    }}
                    className="text-slate-300 hover:text-brand-primary"
                  >
                    <Download size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InscriptionDetail;
