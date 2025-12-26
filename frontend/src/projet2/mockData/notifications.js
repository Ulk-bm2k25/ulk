// Données de test des notifications 
export const mockNotifications = [
  {
    id: 1,
    title: '✅ Paiement validé',
    content: 'Le paiement de 50 000 FCFA pour la tranche 1 de Jean Kouadio a été validé avec succès.',
    type: 'payment_approved',
    student_name: 'Jean Kouadio',
    amount: 50000,
    is_read: false, // false = non lue
    created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(), 
  },
  {
    id: 2,
    title: '❌ Paiement rejeté',
    content: 'Le paiement de 30 000 FCFA pour Marie Tanoh a été rejeté. Numéro de téléphone incorrect.',
    type: 'payment_rejected',
    student_name: 'Marie Tanoh',
    amount: 30000,
    is_read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // Il y a 30 min
  },
  {
    id: 3,
    title: '⏰ Rappel de paiement',
    content: 'La tranche 2 (75 000 FCFA) pour Ibrahim Diallo arrive à échéance le 25 décembre 2025.',
    type: 'payment_pending',
    student_name: 'Ibrahim Diallo',
    amount: 75000,
    is_read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // Il y a 2h
  },
  {
    id: 4,
    title: '💰 Paiement en attente',
    content: 'Le paiement de 45 000 FCFA pour Fatou Sow est en cours de vérification.',
    type: 'payment_pending',
    student_name: 'Fatou Sow',
    amount: 45000,
    is_read: true, // Lue
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // Il y a 5h
  },
  {
    id: 5,
    title: 'ℹ️ Information',
    content: 'Les frais de scolarité pour le trimestre 2 sont maintenant disponibles dans le système.',
    type: 'info',
    is_read: true, // Déjà lue
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // Hier
  },
  {
    id: 6,
    title: '🎉 Remboursement effectué',
    message: 'Remboursement de 15 000 FCFA pour Awa Ndiaye effectué avec succès.',
    type: 'payment_approved',
    student_name: 'Awa Ndiaye',
    amount: 15000,
    read_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // Il y a 2 jours
  }
];

// Fonction pour générer une notification aléatoire (pour tests)
export const generateRandomNotification = () => {
  const types = ['payment_approved', 'payment_rejected', 'payment_pending', 'info'];
  const students = ['Kofi Mensah', 'Aminata Ba', 'Pierre Koffi', 'Aissatou Diop'];
  const amounts = [25000, 35000, 50000, 75000, 100000];
  
  const type = types[Math.floor(Math.random() * types.length)];
  const student = students[Math.floor(Math.random() * students.length)];
  const amount = amounts[Math.floor(Math.random() * amounts.length)];
  
  const titles = {
    payment_approved: '✅ Paiement validé',
    payment_rejected: '❌ Paiement rejeté',
    payment_pending: '⏰ En attente',
    info: 'ℹ️ Information'
  };
  
  return {
    id: Date.now(),
    title: titles[type],
    message: `Notification pour ${student} - ${amount} FCFA`,
    type,
    student_name: student,
    amount,
    read_at: null,
    created_at: new Date().toISOString(),
  };
};