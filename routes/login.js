const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/user"); // Modèle utilisateur de votre base

const secretKey = "123456"; // Clé secrète pour le JWT
const options = { expiresIn: "1h" };

router.get('/', (req, res) => {
  res.render('login');
});

// Route POST /login pour générer un token
router.post("/login",  async (req, res) => {
  const { username, password } = req.body;

  try {
    // Étape 1 : Validation des champs
    if (!username || !password) {
      return res.status(400).json({ error: "Nom d'utilisateur ou mot de passe manquant." });
    }

    // Étape 2 : Vérification dans la base de données (Utilisateur fictif ici comme exemple)
    const user = await User.findOne({ username: username, password: password }).select('+isAdmin');
    if (!user) {
      return res.status(403).json({ error: "Identifiants incorrects." });
    }

    // Étape 3 : Créer un token JWT avec des informations utiles
    const payload = {
      id: user._id, // ID unique de l'utilisateur
      username: user.username, // Nom utilisateur pour le contexte
      isAdmin: true
      
    };
    const token = jwt.sign(payload, secretKey, options);

    // Étape 4 : Retourner le token à l'utilisateur
    return res.status(200).json({
      message: "Authentification réussie.",
      token: token,
    });
  } catch (error) {
    console.error("Erreur lors de la connexion :", error);
    res.status(500).json({ error: "Une erreur serveur est survenue." });
  }
});

// Exporter la route
module.exports = router;