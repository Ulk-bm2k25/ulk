const express = require('express');
const router = express.Router();
const notesController = require('../controllers/notes.controller');

// --- ROUTES DU GROUPE 3 ---

// 1. Récupérer le bulletin d'un élève (Calcul de moyenne inclus)
// URL : localhost:5000/api/notes/bulletin/1
router.get('/bulletin/:id', notesController.getBulletinByEleve);

// 2. Valider une note (Instance de validation réclamée dans le projet)
// URL : localhost:5000/api/notes/valider
router.post('/valider', notesController.validerNote);

// 3. Récupérer la liste des matières (Pour remplir tes menus déroulants en Frontend)
// URL : localhost:5000/api/notes/matieres
router.get('/matieres', notesController.getAllMatieres);

// 4. (Optionnel) Récupérer les stats par classe
// router.get('/stats/classe/:classeId', notesController.getStatsClasse);

module.exports = router;