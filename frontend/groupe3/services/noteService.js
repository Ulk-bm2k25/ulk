// Simulation d'appel API pour récupérer les notes d'une classe
export const fetchNotesByClasse = async (classeId) => {
    // Ici, vous ferez plus tard un fetch(`/api/notes/classe/${classeId}`)
    return []; 
};

// Logique de calcul de moyenne (Aspect Avancé)
export const calculerMoyenne = (notes) => {
    if (!notes || notes.length === 0) return 0;
    const totalPoints = notes.reduce((acc, n) => acc + (n.valeur * n.coefficient), 0);
    const totalCoeffs = notes.reduce((acc, n) => acc + n.coefficient, 0);
    return (totalPoints / totalCoeffs).toFixed(2);
};

// Gestion du statut (Contrainte : Instances de validation)
export const validerNote = async (noteId) => {
    console.log(`Note ${noteId} passée en statut VALIDE`);
    // Appel SQL : UPDATE notes SET statut = 'VALIDE' WHERE id = noteId
};