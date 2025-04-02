const express = require("express");
require("dotenv").config(); // Charger les variables d'environnement depuis .env
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/user"); // Modèle utilisateur de votre base
const secretKey = process.env.secretKey; // Charge secretKey depuis le .env
const options = process.env.options

/**
 * @swagger
 * /login:
 *   get:
 *     summary: Affiche la page de connexion
 *     tags: [Login]
 *     description: Retourne une page HTML permettant à l'utilisateur de se connecter.
 *     responses:
 *       200:
 *         description: Page de connexion affichée avec succès.
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: "<html>...</html>"
 *       500:
 *         description: Erreur interne du serveur.
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: "<p>Erreur interne du serveur</p>"
 */
router.get('/', (req, res) => {
  res.render('login');
});

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Authentifie un utilisateur
 *     tags: [Login]
 *     description: Permet à un utilisateur de se connecter à l'application en fournissant un nom d'utilisateur et un mot de passe valides. Si les identifiants sont corrects, un token JWT est retourné.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Le nom d'utilisateur de l'utilisateur.
 *               password:
 *                 type: string
 *                 description: Le mot de passe de l'utilisateur.
 *             required:
 *               - username
 *               - password
 *     responses:
 *       200:
 *         description: Authentification réussie.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Authentification réussie."
 *                 token:
 *                   type: string
 *                   description: Jeton JWT généré pour l'utilisateur.
 *       400:
 *         description: Nom d'utilisateur ou mot de passe manquant.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Nom d'utilisateur ou mot de passe manquant."
 *       403:
 *         description: Identifiants incorrects.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Identifiants incorrects."
 *       500:
 *         description: Erreur serveur.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Une erreur serveur est survenue."
 */
router.post("/login",  async (req, res) => {
  const { username, password } = req.body;
  const options = { expiresIn: "1h" };

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
    res.status(500).json({ error: "Une erreur serveur est survenue." });
  }
});

// Exporter la route
module.exports = router;