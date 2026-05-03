const express = require('express');
const cors = require('cors');
require('dotenv').config();


const app = express();

app.use(cors());
app.use(express.json());



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