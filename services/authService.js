const bcrypt = require('bcryptjs'); // Hash des mots de passe
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Modèle utilisateur pour interagir avec MongoDB

// Gestion de la connexion utilisateur
exports.login = async (username, password) => {
  // Valider les informations de l'utilisateur
  const user = await User.findOne({ username });
  if (!user) {
    const error = new Error('Utilisateur introuvable');
    error.status = 404;
    throw error;
  }

  // Comparer les mots de passe
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error('Mot de passe incorrect');
    error.status = 401;
    throw error;
  }

  // Génération d'un token JWT
  const token = jwt.sign(
    { id: user._id, username: user.username },
    process.env.secretKey,
    { expiresIn: '1h' }
  );

  return { token, newUser: { id: user._id, username: user.username } };
};

// Gestion de l'enregistrement utilisateur (facultatif mais utile pour extension future)
exports.register = async (username, password) => {
  // Vérifier si l'utilisateur existe déjà
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    const error = new Error('Utilisateur déjà enregistré');
    error.status = 400;
    throw error;
  }

  // Hacher le mot de passe
  const hashedPassword = await bcrypt.hash(password, 12);

  // Enregistrer un nouvel utilisateur dans la base de données
  const newUser = new User({ username, password: hashedPassword });
  await newUser.save();

  return newUser;
};