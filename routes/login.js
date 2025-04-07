const express = require("express");
const bcrypt = require("bcrypt"); // Pour comparer des mots de passe hachés
require("dotenv").config(); // Charger les variables d'environnement depuis .env
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/user"); // Modèle utilisateur pour interagir avec MongoDB
const secretKey = process.env.secretKey; // Charge la clé secrète depuis le fichier .env

router.get('/', (req, res) => {
  res.render('login'); // Affiche la page login.ejs
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Rechercher l'utilisateur par son nom d'utilisateur
    const user = await User.findOne({ username });

    if (!user) {
      // Utilisateur non trouvé
      return res.status(404).json({ error: 'Utilisateur non trouvé.' });
    }

    // Vérifier le mot de passe avec la méthode validatePassword
    const isPasswordValid = await user.validatePassword(password);

    if (!isPasswordValid) {
      // Mot de passe incorrect
      return res.status(401).json({ error: 'Mot de passe incorrect.' });
    }

    // Mot de passe correct (générer un token, exemple)
    const token = "votre_token"; // Générer un JWT dans un vrai cas
    return res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});


module.exports = router; // Exporter la route