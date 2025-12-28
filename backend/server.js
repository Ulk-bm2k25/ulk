const express = require('express');
const cors = require('cors');
const app = express();
const notesRoutes = require('./routes/notes.routes');

app.use(cors());
app.use(express.json());

// Route par défaut pour vérifier que le serveur fonctionne
app.get('/', (req, res) => {
    res.json({ message: "API École+ opérationnelle !" });
});

// Activation des routes du Groupe 3
app.use('/api/notes', notesRoutes);

app.listen(5000, () => console.log("Serveur École+ lancé sur le port 5000"));