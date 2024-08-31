const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const port = 3000;

// Configurer la base de données SQLite
const db = new sqlite3.Database('./database/likes.db', (err) => {
    if (err) {
        console.error('Erreur lors de la connexion à la base de données :', err.message);
    } else {
        console.log('Connecté à la base de données SQLite.');
    }
});

// Créer une table "likes" si elle n'existe pas déjà
db.run(`CREATE TABLE IF NOT EXISTS likes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    count INTEGER DEFAULT 0
)`);

// Limiter les requêtes par utilisateur
const recentLikes = {}; // Pour stocker les timestamps des derniers likes

app.use(express.static('public')); // Servir les fichiers statiques de 'public'
app.use(express.json());

// Route pour obtenir le nombre actuel de likes
app.get('/api/likes', (req, res) => {
    db.get("SELECT count FROM likes WHERE id = 1", (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ count: row ? row.count : 0 });
    });
});

// Route pour incrémenter le compteur de likes
app.post('/api/likes', (req, res) => {
    const ip = req.ip; // Obtenir l'adresse IP du client

    if (recentLikes[ip] && (Date.now() - recentLikes[ip]) < 60000) { // 60 secondes
        return res.status(429).json({ error: 'Trop de requêtes. Veuillez patienter avant de liker à nouveau.' });
    }

    recentLikes[ip] = Date.now(); // Enregistrer le timestamp du dernier like

    db.run(`UPDATE likes SET count = count + 1 WHERE id = 1`, function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Like ajouté avec succès!' });
    });
});

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Serveur en cours d'exécution sur http://localhost:${port}`);
});