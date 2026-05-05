const express = require('express');
const cors = require('cors');
require('dotenv').config();


const app = express();

// ─── Middlewares globaux ───────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth', require('./routes/auth.routes.js'));
app.use('/api/formateurs', require('./routes/formateur.routes.js'));
app.use('/api/institutions', require('./routes/institution.routes.js'));
// app.use('/api/offres', require('./routes/offre.routes'));
// app.use('/api/candidatures', require('./routes/candidature.routes'));
// app.use('/api/formations', require('./routes/formation.routes'));
// app.use('/api/messages', require('./routes/message.routes'));
// app.use('/api/evaluations', require('./routes/evaluation.routes'));
// Les routes sont commentées pour l'instant, on les décommentera au fur et à mesure


app.get('/', (req, res) =>{
    res.json({ message: 'API find training fonctionne !' });
})

// ─── Gestion des routes inexistantes ──────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: 'Route introuvable' });
});

// ─── Gestion globale des erreurs ──────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Erreur interne du serveur' });
});

// ─── Démarrage du serveur ─────────────────────────────────────────────────
const PORT = process.env.PORT;


app.listen(PORT, () => {
    console.log(`SERVEUR LANCER SUR LE PORT  ${PORT}`);
    
});