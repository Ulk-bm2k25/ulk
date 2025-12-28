import React, { useState, useEffect } from 'react';
import {
  ArrowLeft, Calendar, MapPin, User, Phone, Mail, FileText,
  CheckCircle, XCircle, AlertTriangle, Download, Printer, Loader2, IdCard, School
} from 'lucide-react';
import api from '@/api';

const InscriptionDetail = ({ data, onBack, onValidate, onReject, onNavigate }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [classes, setClasses] = useState([]);
  const [niveaux, setNiveaux] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedNiveau, setSelectedNiveau] = useState('');
  const [newClassName, setNewClassName] = useState('');
  const [showValidateModal, setShowValidateModal] = useState(false);
  const [showCreateClass, setShowCreateClass] = useState(false);
  const [classeSouhaitee, setClasseSouhaitee] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (data) {
        setIsLoading(false);
        
        // Extraire la classe souhaitée du commentaire
        if (data.commentaire && data.commentaire.includes('Classe souhaitée:')) {
          const match = data.commentaire.match(/Classe souhaitée: (.+?)(?: -|$)/);
          if (match) {
            setClasseSouhaitee(match[1].trim());
            setNewClassName(match[1].trim());
          }
        }
        
        // Charger les classes et niveaux
        try {
          const [classesRes, niveauxRes] = await Promise.all([
            api.get('/classes'),
            api.get('/niveaux')
          ]);
          setClasses(classesRes.data || []);
          setNiveaux(niveauxRes.data || []);
        } catch (error) {
          console.error('Error fetching classes/niveaux', error);
        }
      }
    };
    fetchData();
  }, [data]);

  if (!data) return null;

  const mapStatus = (backendStatus) => {
    switch (backendStatus) {
      case 'inscrit': return 'validated';
      case 'rejete': return 'rejected';
      case 'en attente': return 'pending';
      default: return 'pending';
    }
  };

  const currentTuteur = data.eleve?.tuteurs?.[0] || {};

  const fullData = {
    id: data.id,
    firstName: data.eleve?.user?.prenom || '--',
    lastName: data.eleve?.user?.nom || '--',
    birthDate: data.eleve?.age ? `${data.eleve.age} ans` : '--',
    birthPlace: '--',
    gender: data.eleve?.sexe === 'M' ? 'Masculin' : data.eleve?.sexe === 'F' ? 'Féminin' : '--',
    previousSchool: '--',
    status: mapStatus(data.statut),
    class: data.eleve?.classe?.nom || '--',
    classId: data.eleve?.classe_id,
    parent: {
      name: `${currentTuteur.prenom || ''} ${currentTuteur.nom || '--'}`.trim(),
      job: currentTuteur.profession || '--',
      phone: currentTuteur.telephone || '--',
      email: currentTuteur.email || '--'
    },
    documents: []
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

  const handleValidateClick = () => {
    setShowValidateModal(true);
  };

  const confirmValidation = async () => {
    try {
      let classeId = selectedClass;
      let classeSouhaiteeValue = null;
      let niveauId = null;

      // Si une classe est sélectionnée, l'utiliser
      if (selectedClass) {
        classeId = selectedClass;
      } 
      // Sinon, si on doit créer une nouvelle classe
      else if (showCreateClass && newClassName && selectedNiveau) {
        // Créer la classe d'abord
        try {
          const newClassRes = await api.post('/classes', {
            nom: newClassName,
            niveau_id: selectedNiveau,
            annee_scolaire: data.annee_scolaire || new Date().getFullYear() + '-' + (new Date().getFullYear() + 1),
            capacity_max: 30
          });
          classeId = newClassRes.data.id;
        } catch (error) {
          alert('Erreur lors de la création de la classe: ' + (error.response?.data?.message || error.message));
          return;
        }
      }
      // Sinon, utiliser la classe souhaitée du commentaire
      else if (classeSouhaitee) {
        classeSouhaiteeValue = classeSouhaitee;
        // Essayer de trouver une classe correspondante
        const matchingClass = classes.find(c => c.nom.includes(classeSouhaitee));
        if (matchingClass) {
          classeId = matchingClass.id;
        } else {
          // Demander à créer la classe
          setShowCreateClass(true);
          return;
        }
      }

      // Valider l'inscription avec la classe
      await api.patch(`/admin/inscriptions/${fullData.id}/status`, {
        statut: 'inscrit',
        classe_id: classeId,
        classe_souhaitee: classeSouhaiteeValue,
        niveau_id: selectedNiveau
      });

      onValidate(fullData.id);
      setShowValidateModal(false);
      alert('Inscription validée avec succès !');
    } catch (error) {
      if (error.response?.data?.requires_class_creation) {
        setShowCreateClass(true);
      } else {
        alert('Erreur lors de la validation: ' + (error.response?.data?.message || error.message));
      }
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
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300 relative">
      {/* Validation Modal */}
      {showValidateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg m-4 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <CheckCircle className="text-green-600" />
              Valider l'inscription
            </h2>
            <p className="text-slate-600 mb-6">
              Voulez-vous valider l'inscription de <strong>{fullData.firstName} {fullData.lastName}</strong> ?
            </p>

            {/* Classe souhaitée affichée */}
            {classeSouhaitee && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Classe souhaitée par le parent:</strong> {classeSouhaitee}
                </p>
              </div>
            )}

            {/* Sélection de classe */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Sélectionner une classe existante
              </label>
              <select
                value={selectedClass}
                onChange={(e) => {
                  setSelectedClass(e.target.value);
                  setShowCreateClass(false);
                }}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
              >
                <option value="">-- Choisir une classe --</option>
                {classes.map(classe => (
                  <option key={classe.id} value={classe.id}>
                    {classe.nom} ({classe.niveau_scolaire?.nom || 'N/A'})
                  </option>
                ))}
              </select>
            </div>

            {/* Option: Créer une nouvelle classe */}
            <div className="mb-4">
              <label className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  checked={showCreateClass}
                  onChange={(e) => {
                    setShowCreateClass(e.target.checked);
                    if (e.target.checked) setSelectedClass('');
                  }}
                  className="w-4 h-4"
                />
                <span className="text-sm font-medium text-slate-700">Créer une nouvelle classe</span>
              </label>
              
              {showCreateClass && (
                <div className="mt-3 space-y-3 p-3 bg-slate-50 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nom de la classe</label>
                    <input
                      type="text"
                      value={newClassName}
                      onChange={(e) => setNewClassName(e.target.value)}
                      placeholder="Ex: 6ème A"
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Niveau scolaire</label>
                    <select
                      value={selectedNiveau}
                      onChange={(e) => setSelectedNiveau(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                    >
                      <option value="">-- Choisir un niveau --</option>
                      {niveaux.map(niveau => (
                        <option key={niveau.id} value={niveau.id}>{niveau.nom}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowValidateModal(false);
                  setShowCreateClass(false);
                  setSelectedClass('');
                }}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={confirmValidation}
                disabled={!selectedClass && (!showCreateClass || !newClassName || !selectedNiveau)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirmer Validation
              </button>
            </div>
          </div>
        </div>
      )}

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
                    <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-xs">INS-{fullData.id}</span>
                    {classeSouhaitee && (
                      <>
                        <span>•</span>
                        <span>Classe souhaitée : <strong className="text-slate-800">{classeSouhaitee}</strong></span>
                      </>
                    )}
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
                  onClick={() => onNavigate('cartes')}
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
                  onClick={handleValidateClick}
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
