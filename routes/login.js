const express = require('express');
const router = express.Router(); // Crée une instance de routeur
const User = require('../models/User'); // Import du modèle utilisateur

// Middleware spécifique (si nécessaire, sinon déléguez-le au fichier principal)
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// GET /login
router.get('/login', (req, res) => {
    res.render('login');
});

// Route POST pour se connecter
router.post('/login', async (req, res) => {
    console.log("Données reçues :", req.body);
    const { username, password } = req.body;

    // Validation simple des champs requis
    if (!username || !password) {
        return res.status(400).send({
            success: false,
            message: 'Les champs "username" et "password" sont requis.'
        });
    }
        try {
            // Création et sauvegarde d'un nouvel utilisateur
            const newUser = new User({ username, password });
            await newUser.save();

            res.status(201).send({
                success: true,
                message: `Utilisateur ${username} connecté avec succès !`
            });
        } catch (error) {
            console.error('Erreur lors de la connexion de l\'utilisateur :', error);

            return res.status(500).send({
                success: false,
                message: 'Erreur serveur. Réessayez plus tard.'
            });
        }
 
});


// Exporte le routeur
module.exports = router;