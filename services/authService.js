const bcrypt = require('bcryptjs'); // Hash des mots de passe
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Modèle utilisateur pour interagir avec MongoDB

/** 
 * @module authServices
 * @description Service qui gère les authentifications
*/

/**
 * Authentifie un utilisateur en vérifiant le mot de passe et génère un token JWT.
 * @async
 * @param {string} username - Le nom d'utilisateur.
 * @param {string} password - Le mot de passe de l'utilisateur.
 * @throws {Error} Si l'utilisateur n'est pas trouvé ou si le mot de passe est incorrect.
 * @returns {Promise<{token: string, newUser: {id: string, username: string}}>} Objet contenant le token JWT et les informations utilisateur.
 */
exports.login = async (username, password) => {
  // Valider les informations de l'utilisateur
  const user = await User.findOne({ username });
  if (!user) {
    const error = new Error('Utilisateur introuvable');
    error.status = 404;
    throw error;
  }

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

/**
 * Enregistre un nouvel utilisateur avec un mot de passe sécurisé dans la base de données.
 * @async
 * @param {string} username - Le nom d'utilisateur à enregistrer.
 * @param {string} password - Le mot de passe de l'utilisateur.
 * @throws {Error} Si l'utilisateur existe déjà.
 * @returns {Promise<Object>} L'objet utilisateur nouvellement créé.
 */
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