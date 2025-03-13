const express = require('express');
const router = express.Router();
const User = require('../models/user'); // Import du modèle User
const secretKey = "12345"; 

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/login", async (req, res) => {
    try {
      const { username, password } = req.body;
  
      // Vérifiez les champs de la requête
      if (!username || !password) {
        return res.status(400).json({ error: "Nom d'utilisateur ou mot de passe manquant." });
      }
  
      // Récupérez l'utilisateur dans la base de données
      const pseudo = await User.findOne({ username });
      if (!pseudo) {
        return res.status(401).json({ error: "Nom d'utilisateur ou mot de passe incorrect." });
      }
  
      // Vérifiez le mot de passe
      const isPasswordValid = await bcrypt.compare(password, User.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Nom d'utilisateur ou mot de passe incorrect." });
      }
  
      // Générer un token JWT pour l'utilisateur
      const token = jwt.sign({ id: User._id, username: User.username }, secretKey, {
        expiresIn: "1h", // Durée de vie du token
      });
  
      // Tout est bon, renvoyez une réponse avec le token
      return res.status(200).json({ message: "Connexion réussie.", token });
    } catch (error) {
      console.error("Erreur lors de la connexion de l'utilisateur :", error);
      return res.status(500).json({ error: "Erreur serveur, veuillez réessayer plus tard." });
    }
  });

module.exports = router;