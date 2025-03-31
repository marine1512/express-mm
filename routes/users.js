const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user'); // Import du modèle utilisateur
const mongoose = require('mongoose');

// 1. Lire la liste des utilisateurs
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.render('users', { users });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la lecture des utilisateurs', error: error.message });
  }
});
// 2. Créer un nouvel utilisateur
router.post('/', async (req, res) => {
  try {
    console.log('Requête POST reçue sur /users'); // Vérifie que la route est bien atteinte
    console.log('Corps de la requête :', req.body); // Montre ce qui est envoyé dans la requête

    // Récupération des champs
    const { username, password } = req.body;

    // Vérifiez si les champs sont présents
    if (!username || !password) {
      console.log('Champs manquants : username ou password pas fourni');
      return res.status(400).send('Le pseudo et le mot de passe sont requis.');
    }

    // Vérifiez si l'utilisateur existe déjà
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      console.log('Utilisateur existant trouvé avec ce pseudo :', username);
      return res.status(400).send('Ce pseudo est déjà utilisé.');
    }

    // Hachez le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Mot de passe haché avec succès');

    // Créez un nouvel utilisateur
    const newUser = new User({
      username,
      password: hashedPassword,
    });
    await newUser.save();
    console.log('Nouvel utilisateur créé et sauvegardé :', newUser);

    // Redirection ou réponse
    res.redirect('/users');
  } catch (error) {
    console.error('Erreur dans POST /users :', error.message); // Erreur claire dans les logs
    res.status(500).send(`<p>Erreur interne : ${error.message}</p>`);
  }
});

// 3. Modifier un utilisateur
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
      console.error('Erreur lors de la mise à jour :', error);
      res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// 4. Supprimer un utilisateur
router.delete('/:id', async (req, res) => {
  try {
    console.log('Requête DELETE reçue pour ID :', req.params.id);

    const { id } = req.params;

    // Vérifiez si l'ID est valide dans MongoDB
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.error('ID utilisateur non valide :', id);
      return res.status(400).json({ message: 'ID utilisateur invalide' });
    }

    // Tentez de supprimer l'utilisateur
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      console.error('Utilisateur introuvable avec cet ID :', id);
      return res.status(404).json({ message: 'Utilisateur introuvable' });
    }

    console.log('Utilisateur supprimé avec succès :', deletedUser);
    res.status(200).json({ message: 'Utilisateur supprimé avec succès', user: deletedUser });

  } catch (error) {
    console.error('Erreur critique détectée lors de la suppression :', error); // Log ici
    res.status(500).json({ message: 'Erreur lors de la suppression', error: error.message || 'Erreur inconnue' });
  }
});

// Exporter les routes
module.exports = router;