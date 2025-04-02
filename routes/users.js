const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user'); // Import du modèle utilisateur
const mongoose = require('mongoose');

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Récupère la liste des utilisateurs
 *     tags: [Users]
 *     description: Retourne la liste de tous les utilisateurs stockés dans la base de données et les affiche dans une vue HTML.
 *     responses:
 *       200:
 *         description: Succès - La liste des utilisateurs a été récupérée et rendue.
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: Vue HTML contenant la liste des utilisateurs.
 *       500:
 *         description: Erreur interne - Impossible de récupérer les utilisateurs.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erreur lors de la lecture des utilisateurs"
 *                 error:
 *                   type: string
 *                   example: "Détails de l'erreur interne"
 */
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.render('users', { users });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la lecture des utilisateurs', error: error.message });
  }
});

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Crée un nouvel utilisateur
 *     tags: [Users]
 *     description: Cette route permet de créer un nouvel utilisateur, après vérification des champs et du pseudo unique. Le mot de passe est haché avant d'être sauvegardé dans la base de données.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Le pseudo unique de l'utilisateur.
 *                 example: johndoe
 *               password:
 *                 type: string
 *                 description: Le mot de passe de l'utilisateur.
 *                 example: mypassword123
 *             required:
 *               - username
 *               - password
 *     responses:
 *       200:
 *         description: Redirection vers la liste des utilisateurs après création réussie.
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: "Redirection vers /users"
 *       400:
 *         description: Erreur de validation des champs ou si le pseudo est déjà utilisé.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               examples:
 *                 missing_fields:
 *                   value: "Le pseudo et le mot de passe sont requis."
 *                 username_taken:
 *                   value: "Ce pseudo est déjà utilisé."
 *       500:
 *         description: Erreur interne du serveur.
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: "<p>Erreur interne : une erreur est survenue lors de la création de l'utilisateur.</p>"
 */
router.post('/', async (req, res) => {
  try {

    // Récupération des champs
    const { username, password } = req.body;

    // Vérifiez si les champs sont présents
    if (!username || !password) {
      return res.status(400).send('Le pseudo et le mot de passe sont requis.');
    }

    // Vérifiez si l'utilisateur existe déjà
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).send('Ce pseudo est déjà utilisé.');
    }

    // Hachez le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créez un nouvel utilisateur
    const newUser = new User({
      username,
      password: hashedPassword,
    });
    await newUser.save();

    // Redirection ou réponse
    res.redirect('/users');
  } catch (error) {
    res.status(500).send(`<p>Erreur interne : ${error.message}</p>`);
  }
});

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Met à jour un utilisateur
 *     tags: [Users]
 *     description: Cette route permet de mettre à jour les informations d'un utilisateur existant. Si un nouveau mot de passe est fourni, il sera haché avant d'être enregistré.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de l'utilisateur à mettre à jour.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Nouveau nom d'utilisateur.
 *               password:
 *                 type: string
 *                 description: Nouveau mot de passe (facultatif).
 *             example:
 *               username: "nouveau_pseudo"
 *               password: "nouveau_mot_de_passe"
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: ID de l'utilisateur mis à jour.
 *                 username:
 *                   type: string
 *                   description: Nom d'utilisateur mis à jour.
 *                 password:
 *                   type: string
 *                   description: Mot de passe mis à jour (haché).
 *               example:
 *                 id: "64ae0f9c9bcf3a0012ec8a78"
 *                 username: "nouveau_pseudo"
 *                 password: "$2b$10$4DcsVvfVnDtyN9V4Q8hbJe3Ty0kNo2/KncgcWDZP9GNqJABCCkQeq"
 *       400:
 *         description: Mauvaise requête, les données fournies ne sont pas valides.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 example:
 *                   message: "Le mot de passe est requis."
 *       404:
 *         description: Utilisateur introuvable.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: "Utilisateur introuvable"
 *       500:
 *         description: Erreur interne du serveur.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 error:
 *                   type: string
 *               example:
 *                 message: "Erreur serveur"
 *                 error: "Détails de l'erreur"
 */
router.put('/:id', async (req, res) => {
  try {
      const { id } = req.params;

      // Récupérer l'utilisateur à mettre à jour
      const user = await User.findById(id);
      if (!user) {
          return res.status(404).json({ message: "Utilisateur introuvable" });
      }

      // Vérifier si le mot de passe a été fourni dans le body
      if (req.body.password && req.body.password.trim() !== '') {
          // Hacher le mot de passe seulement si un nouveau mot de passe est fourni
          const salt = await bcrypt.genSalt(10);
          req.body.password = await bcrypt.hash(req.body.password, salt);
      } else {
          // Si le mot de passe est vide, supprimer le champ password dans req.body
          delete req.body.password;
      }

      // Mettre à jour les champs de l'utilisateur
      const updatedUser = await User.findByIdAndUpdate(id, req.body, {
          new: true,            // Retourner l'objet mis à jour
          runValidators: true,  // Valider les données selon le schéma Mongoose
      });

      if (!updatedUser) {
          return res.status(500).json({ message: "Impossible de mettre à jour l'utilisateur." });
      }

      // Envoyer une réponse de succès
      res.redirect('/users')
  } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Supprime un utilisateur
 *     tags: [Users]
 *     description: Cette route permet de supprimer un utilisateur à partir de son ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: L'identifiant unique de l'utilisateur (doit être un ObjectId valide).
 *     responses:
 *       200:
 *         description: Utilisateur supprimé avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Utilisateur supprimé avec succès
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: ID unique de l'utilisateur supprimé.
 *                     username:
 *                       type: string
 *                       description: Nom d'utilisateur.
 *       400:
 *         description: ID utilisateur invalide.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: ID utilisateur invalide.
 *       404:
 *         description: Utilisateur introuvable.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Utilisateur introuvable.
 *       500:
 *         description: Erreur interne lors de la suppression.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Erreur lors de la suppression.
 *                 error:
 *                   type: string
 *                   example: Détails techniques de l'erreur.
 */
router.delete('/:id', async (req, res) => {
  try {

    const { id } = req.params;

    // Vérifiez si l'ID est valide dans MongoDB
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID utilisateur invalide' });
    }

    // Tentez de supprimer l'utilisateur
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: 'Utilisateur introuvable' });
    }
    res.status(200).json({ message: 'Utilisateur supprimé avec succès', user: deletedUser });

  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression', error: error.message || 'Erreur inconnue' });
  }
});

// Exporter les routes
module.exports = router;