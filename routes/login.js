const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

app.use(express.json());

// Clé secrète pour signer les JWT (à garder privée)
const JWT_SECRET = "GTGh6rdP54GT76";

// Route d'inscription (register)
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    // Validation des entrées
    if (!username || !password) {
        return res.status(400).json({ message: 'Nom d\'utilisateur et mot de passe requis' });
    }

    // Vérifiez si l'utilisateur existe déjà
    const userExists = users.find(user => user.username === username);
    if (userExists) {
        return res.status(400).json({ message: 'Nom d\'utilisateur déjà utilisé' });
    }

    // Hacher le mot de passe avant de l'enregistrer
    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ username, password: hashedPassword });

    res.status(201).json({ message: 'Utilisateur enregistré avec succès' });
});

// Route de connexion (login)
app.post('/', async (req, res) => {
    const { username, password } = req.body;

    // Validation des entrées
    if (!username || !password) {
        return res.status(400).json({ message: 'Nom d\'utilisateur et mot de passe requis' });
    }

    // Rechercher l'utilisateur
    const user = users.find(user => user.username === username);
    if (!user) {
        return res.status(401).json({ message: 'Nom d\'utilisateur ou mot de passe incorrect' });
    }

    // Vérifier le mot de passe
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        return res.status(401).json({ message: 'Nom d\'utilisateur ou mot de passe incorrect' });
    }

    // Générer un JWT
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'Connexion réussie', token });
});

// Middleware pour vérifier le token (protège les routes privées)
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Récupère le token "Bearer <token>"

    if (!token) {
        return res.status(401).json({ message: 'Non autorisé (token manquant)' });
    }

    // Valider le token
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token invalide' });
        }

        req.user = user;
        next(); // Passe au prochain middleware ou à la route demandée
    });
}

// Route privée (exemple protégé par le middleware authenticateToken)
app.get('/private', authenticateToken, (req, res) => {
    res.status(200).json({ message: `Bienvenue ${req.user.username}, ceci est une route privée.` });
});

// Exporter le router pour l'utiliser dans server.js
module.exports = router;