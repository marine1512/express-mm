const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const authenticateToken = require("../middleware/auth"); // Middleware
const User = require("../models/user"); // Modèle utilisateur de votre base

const secretKey = "123456"; // Clé secrète pour le JWT

// Route POST /login pour générer un token
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Étape 1 : Validation des champs
    if (!username || !password) {
      return res.status(400).json({ error: "Nom d'utilisateur ou mot de passe manquant." });
    }

    // Étape 2 : Vérification dans la base de données (Utilisateur fictif ici comme exemple)
    const user = await User.findOne({ username, password });
    if (!user) {
      return res.status(403).json({ error: "Identifiants incorrects." });
    }

    // Étape 3 : Créer un token JWT avec des informations utiles
    const payload = {
      id: user._id, // ID unique de l'utilisateur
      username: user.username, // Nom utilisateur pour le contexte
    };
    const token = jwt.sign(payload, secretKey, { expiresIn: "1h" });

    // Étape 4 : Retourner le token à l'utilisateur
    res.status(200).json({ message: "Connexion réussie.", token });
  } catch (error) {
    console.error("Erreur lors de la connexion :", error);
    res.status(500).json({ error: "Une erreur serveur est survenue." });
  }
});

// Route GET /protected (exemple d'authentification via middleware)
router.get("/protected", authenticateToken, (req, res) => {
  // Accessible uniquement si le JWT est authentifié
  res.status(200).json({ message: "Vous avez accédé à une route protégée.", user: req.user });
});

module.exports = router;