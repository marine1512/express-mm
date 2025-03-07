const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Middleware pour traiter les données JSON
router.use(express.json());

// POST - Créer un utilisateur
router.post('/add', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Loggez les champs reçus
        console.log('Requête reçue avec les données :', { name, email, password });

        // Vérifiez que tous les champs nécessaires sont fournis
        if (!name || !email || !password) {
            console.error('Données manquantes dans la requête');
            return res.status(400).json({ message: 'Tous les champs sont requis' });
        }

        // Vérifiez si l'utilisateur existe déjà
        let user = await User.findOne({ email });
        if (user) {
            console.error('Utilisateur déjà existant avec cet email');
            return res.status(400).json({ message: 'Cet email est déjà utilisé' });
        }

        // Création de l'utilisateur
        user = new User({ name, email, password });
        await user.save();

        console.log('Utilisateur créé avec succès');
        res.status(201).json({ message: 'Utilisateur créé avec succès', user });

    } catch (err) {
        // En cas d'erreur, afficher un log spécifique
        console.error('Une erreur serveur est survenue :', err.message);
        res.status(500).json({ message: 'Erreur serveur', error: err.message });
    }
});

module.exports = router;