import React, { useState, useEffect } from 'react';
import { X, Save, User, MapPin, Phone, Calendar, School, Mail } from 'lucide-react';

// Ajoutez `availableClasses` comme prop
const StudentFormModal = ({ isOpen, onClose, onSubmit, initialData = null, availableClasses = [] }) => {
  // Structure initiale vide (mise à jour pour utiliser availableClasses)
  const emptyForm = {
    firstName: '',
    lastName: '',
    gender: 'M',
    dob: '',
    pob: '',
    class: availableClasses.length > 0 ? availableClasses[0].nom : '', // Première classe disponible par défaut
    matricule: '',
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    address: ''
  };

  const [formData, setFormData] = useState(emptyForm);

  // Remplissage si mode Édition ou Réinitialisation à l'ouverture
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        // Adaptez les données reçues au format du formulaire
        setFormData({
          firstName: initialData.firstName || '',
          lastName: initialData.lastName || '',
          gender: initialData.gender || 'M',
          dob: initialData.birthDate || '',
          pob: initialData.pob || '',
          class: initialData.class || (availableClasses.length > 0 ? availableClasses[0].nom : ''),
          matricule: initialData.id || '',
          parentName: typeof initialData.parent === 'object' ? initialData.parent.name : initialData.parent || '',
          parentPhone: typeof initialData.parent === 'object' ? initialData.parent.phone : initialData.phone || '',
          parentEmail: initialData.email || '',
          address: initialData.address || ''
        });
      } else {
        setFormData(emptyForm); // Utilise emptyForm qui prend en compte availableClasses
      }
    }
  }, [initialData, isOpen, availableClasses]); // Ajout de availableClasses aux dépendances

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const studentPayload = {
      id: formData.matricule || `MAT-${Math.floor(Math.random() * 10000)}`,
      firstName: formData.firstName,
      lastName: formData.lastName,
      gender: formData.gender,
      class: formData.class,
      birthDate: formData.dob,
      pob: formData.pob,
      parent: formData.parentName,
      phone: formData.parentPhone,
      email: formData.parentEmail,
      address: formData.address,
      status: 'active'
    };

    onSubmit(studentPayload);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">

        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <User className="text-brand-primary" size={20} />
            {initialData ? 'Modifier l\'élève' : 'Nouvel Élève (Admission Manuelle)'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        <div className="overflow-y-auto p-6">
          <form id="student-form" onSubmit={handleSubmit} className="space-y-6">

            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-1">Informations de l'élève</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">Nom</label>
                  <input required name="lastName" value={formData.lastName} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-primary/20 outline-none" placeholder="Nom de famille" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">Prénoms</label>
                  <input required name="firstName" value={formData.firstName} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-primary/20 outline-none" placeholder="Prénoms complets" />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">Sexe</label>
                  <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-primary/20 outline-none bg-white">
                    <option value="M">Masculin</option>
                    <option value="F">Féminin</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">Classe d'affectation</label>
                  <div className="relative">
                    <School size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <select name="class" value={formData.class} onChange={handleChange} className="w-full pl-9 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-primary/20 outline-none bg-white font-medium">
                      {availableClasses.map(cls => ( // Utilisation de availableClasses ici
                        <option key={cls.id} value={cls.nom}>{cls.nom}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">Date de naissance</label>
                  <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-primary/20 outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">Lieu de naissance</label>
                  <input name="pob" value={formData.pob} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-primary/20 outline-none" placeholder="Ville / Pays" />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-1">Responsable Légal</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-semibold text-slate-700">Nom complet du tuteur</label>
                  <input required name="parentName" value={formData.parentName} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-primary/20 outline-none" placeholder="M. / Mme ..." />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">Téléphone</label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input required name="parentPhone" value={formData.parentPhone} onChange={handleChange} className="w-full pl-9 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-primary/20 outline-none" placeholder="+229 ..." />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">Email (Optionnel)</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="email" name="parentEmail" value={formData.parentEmail} onChange={handleChange} className="w-full pl-9 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-primary/20 outline-none" placeholder="parent@gmail.com" />
                  </div>
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-semibold text-slate-700">Adresse de résidence</label>
                  <div className="relative">
                    <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input name="address" value={formData.address} onChange={handleChange} className="w-full pl-9 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-primary/20 outline-none" placeholder="Quartier, Maison..." />
                  </div>
                </div>
              </div>
            </div>

          </form>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 font-medium rounded-lg hover:bg-slate-50 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            form="student-form"
            className="px-5 py-2.5 bg-brand-primary text-white font-bold rounded-lg hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20 flex items-center gap-2"
          >
            <Save size={18} />
            {initialData ? 'Mettre à jour' : 'Enregistrer'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default StudentFormModal;