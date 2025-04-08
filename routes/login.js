const express = require("express");
const bcrypt = require("bcryptjs"); // Pour comparer des mots de passe hachés
require("dotenv").config(); // Charger les variables d'environnement depuis .env
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/user"); // Modèle utilisateur pour interagir avec MongoDB

router.get('/', (req, res) => {
  res.render('login'); // Affiche la page login.ejs
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Vérifiez si l'utilisateur existe
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur introuvable' });
    }

    // Comparez les mots de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Mot de passe incorrect' });
    }

    // Créez le token JWT
    const token = jwt.sign(
      { id: user._id, username: user.username }, // Données du token
      process.env.secretKey,
      { expiresIn: '1h' } // La durée d'expiration du token
    );

    // Configurez et envoyez le cookie
    res.cookie('token', token, {
      httpOnly: true,           // Empêche l'accès au cookie via JavaScript
      secure: process.env.NODE_ENV === 'production', // Utilisez HTTPS en production
      sameSite: 'strict',       // Prévient les attaques de type CSRF
      maxAge: 3600000           // Durée de 1 heure (en millisecondes)
    });

    res.status(200).json({ message: 'Connexion réussie' });
  } catch (error) {
    console.error('Erreur lors de la connexion :', error.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});



module.exports = router; // Exporter la route