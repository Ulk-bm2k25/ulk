import React, { useState } from 'react';
import { User, Users, School, CheckCircle, Smartphone, CreditCard, Image as ImageIcon, FileText, Loader2 } from 'lucide-react';
import api from '@/api';
import '../styles/theme.css';
import FileUpload from './FileUpload';

const Registration = ({ mode = 'new', initialData = null, onComplete }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        parentName: '',
        parentPhone: '',
        parentProfession: '',
        parentAddress: '',
        childName: initialData?.prenom ? `${initialData.prenom} ${initialData.nom}` : '',
        childBirthDate: '',
        childGender: initialData?.sexe === 'M' ? 'Masculin' : initialData?.sexe === 'F' ? 'Féminin' : 'Masculin',
        childGrade: initialData?.inscription?.classe?.nom || '6ème'
    });

    // État pour les données parent pré-chargées
    React.useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            setFormData(prev => ({
                ...prev,
                parentName: `${user.prenom} ${user.nom}`,
                parentPhone: user.phone || '',
                parentProfession: user.profession || '',
                parentAddress: user.adresse || ''
            }));
        }
    }, []);

    // États pour les documents
    const [studentPhoto, setStudentPhoto] = useState(null);
    const [birthCertificate, setBirthCertificate] = useState(null);

    const [paymentProvider, setPaymentProvider] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleEnrollment = async () => {
        setIsProcessing(true);
        try {
            await api.post('/parent/enroll-child', formData);
            setIsProcessing(false);
            setStep(3); // Now step 3 is success
        } catch (error) {
            setIsProcessing(false);
            const message = error.response?.data?.message || "Une erreur est survenue lors de l'inscription.";
            alert(message);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <User className="text-orange-400" /> Informations Parentales
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm text-white/60">Nom complet</label>
                                <input name="parentName" type="text" className="parent-input" placeholder="Votre nom complet" value={formData.parentName} onChange={handleInputChange} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-white/60">Téléphone Mobile</label>
                                <input name="parentPhone" type="tel" className="parent-input" placeholder="01 02 03 04 05" value={formData.parentPhone} onChange={handleInputChange} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-white/60">Email de contact</label>
                                <input name="parentEmail" type="email" className="parent-input" placeholder="votre@email.com" value={formData.parentEmail} onChange={handleInputChange} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-white/60">Profession (Optionnel)</label>
                                <input name="parentProfession" type="text" className="parent-input" placeholder="Ex: Enseignant" value={formData.parentProfession} onChange={handleInputChange} />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm text-white/60">Adresse de résidence</label>
                                <input name="parentAddress" type="text" className="parent-input" placeholder="Votre adresse complète" value={formData.parentAddress} onChange={handleInputChange} />
                            </div>
                        </div>
                        <div className="flex justify-end mt-6">
                            <button onClick={() => setStep(2)} className="parent-btn-primary">Suivant</button>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <Users className="text-orange-400" /> Données de l'Élève
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm text-white/60">Nom de l'enfant</label>
                                <input name="childName" type="text" className="parent-input" placeholder="Prénom Nom de l'enfant" value={formData.childName} onChange={handleInputChange} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-white/60">Date de naissance</label>
                                <input name="childBirthDate" type="date" className="parent-input" value={formData.childBirthDate} onChange={handleInputChange} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-white/60">Genre</label>
                                <select name="childGender" className="parent-input" style={{ backgroundColor: 'white', color: 'black' }} value={formData.childGender} onChange={handleInputChange}>
                                    <option value="Masculin">Masculin</option>
                                    <option value="Féminin">Féminin</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-white/60">Classe souhaitée</label>
                                <select name="childGrade" className="parent-input" style={{ backgroundColor: 'white', color: 'black' }} value={formData.childGrade} onChange={handleInputChange}>
                                    <option value="Maternelle">Maternelle</option>
                                    <optgroup label="Primaire">
                                        <option value="CI">CI</option>
                                        <option value="CP">CP</option>
                                        <option value="CE1">CE1</option>
                                        <option value="CE2">CE2</option>
                                        <option value="CM1">CM1</option>
                                        <option value="CM2">CM2</option>
                                    </optgroup>
                                    <optgroup label="Collège">
                                        <option value="6ème">6ème</option>
                                        <option value="5ème">5ème</option>
                                        <option value="4ème">4ème</option>
                                        <option value="3ème">3ème</option>
                                    </optgroup>
                                    <optgroup label="Lycée">
                                        <option value="2nde A">2nde A</option>
                                        <option value="2nde B">2nde B</option>
                                        <option value="2nde C">2nde C</option>
                                        <option value="2nde D">2nde D</option>
                                        <option value="2nde G1">2nde G1</option>
                                        <option value="2nde G2">2nde G2</option>
                                        <option value="1ère A">1ère A</option>
                                        <option value="1ère B">1ère B</option>
                                        <option value="1ère C">1ère C</option>
                                        <option value="1ère D">1ère D</option>
                                        <option value="1ère G1">1ère G1</option>
                                        <option value="1ère G2">1ère G2</option>
                                        <option value="Terminale A">Terminale A</option>
                                        <option value="Terminale B">Terminale B</option>
                                        <option value="Terminale C">Terminale C</option>
                                        <option value="Terminale D">Terminale D</option>
                                        <option value="Terminale G1">Terminale G1</option>
                                        <option value="Terminale G2">Terminale G2</option>
                                    </optgroup>
                                </select>
                            </div>
                        </div>

                        {/* Section Documents Requis */}
                        <div className="mt-8 pt-8 border-t border-white/5 space-y-6">
                            <h4 className="text-sm font-black text-white/40 uppercase tracking-widest">Documents requis</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FileUpload
                                    label="Photo d'identité"
                                    icon={ImageIcon}
                                    selectedFile={studentPhoto}
                                    onFileSelect={setStudentPhoto}
                                    onFileRemove={() => setStudentPhoto(null)}
                                />
                                <FileUpload
                                    label="Extrait de naissance (PDF ou Image)"
                                    icon={FileText}
                                    selectedFile={birthCertificate}
                                    onFileSelect={setBirthCertificate}
                                    onFileRemove={() => setBirthCertificate(null)}
                                />
                            </div>
                        </div>

                        <div className="flex justify-between items-center mt-6">
                            <button onClick={() => setStep(1)} className="text-white/40 hover:text-white">Retour</button>
                            <button
                                onClick={handleEnrollment}
                                disabled={isProcessing}
                                className={`parent-btn-primary flex items-center gap-2 ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {isProcessing ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-dark/30 border-t-dark rounded-full animate-spin" />
                                        Traitement...
                                    </>
                                ) : (
                                    "Confirmer l'inscription"
                                )}
                            </button>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="text-center py-12 space-y-6">
                        <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle size={48} />
                        </div>
                        <h3 className="text-2xl font-bold">Demande reçue !</h3>
                        <p className="text-white/60 max-w-md mx-auto">
                            Votre demande d'inscription a été soumise avec succès. Elle est actuellement en attente de validation par l'administration. Vous recevrez une notification dès qu'elle sera traitée.
                        </p>
                        <button onClick={onComplete} className="parent-btn-primary mt-6">
                            Retour à la liste des enfants
                        </button>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="space-y-8 text-white">
            <header>
                <h1 className="text-3xl font-bold">
                    {mode === 're-enrollment' ? 'Réinscription de l\'élève' : 'Inscription en ligne'}
                </h1>
                <p className="text-white/40 mt-1">
                    {mode === 're-enrollment'
                        ? `Veuillez confirmer les informations pour la réinscription de ${initialData?.name}.`
                        : 'Remplissez les informations pour inscrire votre enfant.'}
                </p>
            </header>

            {/* Steps Indicator */}
            <div className="flex items-center gap-4 mb-8">
                {[1, 2, 3].map((s) => (
                    <div key={s} className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= s ? 'bg-orange-400 text-dark' : 'bg-white/10 text-white/40'}`}>
                            {s}
                        </div>
                        {s < 3 && <div className={`h-1 w-12 rounded ${step > s ? 'bg-orange-400' : 'bg-white/10'}`} />}
                    </div>
                ))}
            </div>

            <div className="glass-card p-8 bg-white/5">
                {renderStep()}
            </div>
        </div>
    );
};

export default Registration;
