const db = require('../database');

// Calculer la moyenne et générer le bulletin
exports.getBulletinByEleve = async (req, res) => {
    const eleveId = req.params.id;
    const query = `
        SELECT m.nom as matiere, n.valeur as note, m.coefficient, 
        (n.valeur * m.coefficient) as points
        FROM notes n
        JOIN matieres m ON n.matiere_id = m.id
        WHERE n.eleve_id = ?`; 
        // Note : J'ai retiré 'AND n.statut = VALIDE' temporairement pour tes tests 
        // car tes premières notes n'auront peut-être pas encore de statut.

    try {
        // Avec mysql2/promise, on utilise await et on récupère [rows]
        const [rows] = await db.query(query, [eleveId]);
        
        if (rows.length === 0) {
            return res.status(404).json({ message: "Aucune note trouvée pour cet élève." });
        }

        // Calcul avancé de la moyenne générale
        const totalPoints = rows.reduce((acc, row) => acc + Number(row.points), 0);
        const totalCoeffs = rows.reduce((acc, row) => acc + Number(row.coefficient), 0);
        const moyenneGenerale = totalCoeffs > 0 ? (totalPoints / totalCoeffs).toFixed(2) : 0;

        res.json({
            eleve_id: eleveId,
            details: rows,
            moyenne: moyenneGenerale
        });
    } catch (err) {
        res.status(500).json({ error: "Erreur lors du calcul du bulletin : " + err.message });
    }
};

// Valider une note (Instance de validation)
exports.validerNote = async (req, res) => {
    const { noteId } = req.body;
    
    try {
        // Dans MySQL, db.query renvoie un tableau dont le premier élément contient les infos d'exécution
        await db.query(`UPDATE notes SET statut = 'VALIDE' WHERE id = ?`, [noteId]);
        res.json({ message: "Note validée avec succès" });
    } catch (err) {
        res.status(500).json({ error: "Erreur de validation : " + err.message });
    }
};

// AJOUT : Récupérer toutes les matières (Utile pour ton interface de saisie)
exports.getAllMatieres = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM matieres');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};