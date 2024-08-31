const sqlite3 = require('sqlite3').verbose();

// Ouvre (ou crée) une base de données SQLite appelée 'likes.db'
const db = new sqlite3.Database('./likes.db', (err) => {
    if (err) {
        console.error('Erreur lors de l\'ouverture de la base de données :', err.message);
        return;
    }
    console.log('Connecté à la base de données SQLite.');

    // Crée la table 'likes' si elle n'existe pas déjà
    db.run(`CREATE TABLE IF NOT EXISTS likes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        count INTEGER DEFAULT 0
    )`, (err) => {
        if (err) {
            console.error('Erreur lors de la création de la table :', err.message);
        } else {
            console.log('Table "likes" vérifiée/créée avec succès.');

            // Insère une ligne initiale si la table est vide
            db.get("SELECT COUNT(*) AS count FROM likes", (err, row) => {
                if (row.count === 0) {
                    db.run(`INSERT INTO likes (count) VALUES (0)`, (err) => {
                        if (err) {
                            console.error('Erreur lors de l\'insertion initiale :', err.message);
                        } else {
                            console.log('Valeur initiale ajoutée dans la table "likes".');
                        }
                    });
                }
            });
        }
    });
});

// Ferme la base de données après création
db.close((err) => {
    if (err) {
        console.error('Erreur lors de la fermeture de la base de données :', err.message);
    } else {
        console.log('Base de données SQLite fermée.');
    }
});