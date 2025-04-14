/**
 * @swagger
 * tags:
 *   name: Login
 *   description: Gestion de l'authentification des utilisateurs
 */

const express = require("express");
const router = express.Router();
const authController = require('../controllers/authController'); // Import du contrôleur

/**
 * @swagger
 * /:
 *   get:
 *     summary: Affiche la page de connexion
 *     tags: [Login]
 *     responses:
 *       200:
 *         description: Page de connexion affichée avec succès
 *       500:
 *         description: Erreur serveur lors du chargement de la page
 */
router.get('/', authController.getLoginPage);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Connexion de l'utilisateur
 *     tags: [Login]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Nom d'utilisateur
 *                 example: "admin"
 *               password:
 *                 type: string
 *                 description: Mot de passe de l'utilisateur
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Connexion réussie
 *       400:
 *         description: Erreur dans les données de connexion
 *       401:
 *         description: Utilisateur non autorisé (mauvais identifiants)
 *       500:
 *         description: Erreur serveur lors de la connexion
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Déconnexion de l'utilisateur
 *     tags: [Login]
 *     responses:
 *       200:
 *         description: Déconnexion réussie
 *       500:
 *         description: Erreur serveur lors de la déconnexion
 */
router.post('/logout', authController.logout);

module.exports = router; // Export des routes