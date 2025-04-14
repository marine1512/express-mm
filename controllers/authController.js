const authService = require('../services/authService'); // Import du service approprié

/** 
 * @module authController
 * @category Controllers
 * @description Controller qui gère les catways
*/

/**
 * Récupère et affiche la page de connexion.
 * @function
 * @param {Object} req - L'objet de requête HTTP.
 * @param {Object} res - L'objet de réponse HTTP.
 */
exports.getLoginPage = (req, res) => {
  res.render('login'); // Renvoie la vue de connexion
};

/**
 * Authentifie un utilisateur avec les identifiants fournis et configure un cookie contenant le token.
 * @function
 * @async
 * @param {Object} req - L'objet de requête HTTP.
 * @param {Object} req.body - Le corps de la requête contenant les identifiants de connexion.
 * @param {string} req.body.username - Nom d'utilisateur fourni par le client.
 * @param {string} req.body.password - Mot de passe fourni par le client.
 * @param {Object} res - L'objet de réponse HTTP.
 * @returns {Promise<void>} Renvoie une réponse JSON avec le statut de la connexion ou une erreur.
 */
exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const { token, newUser } = await authService.login(username, password);

    // Configure et envoie le cookie au client
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600000, // 1 heure en millisecondes
    });

    res.status(200).json({ message: 'Connexion réussie', user: newUser });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

/**
 * Déconnecte l'utilisateur en supprimant le cookie contenant le token d'authentification.
 * @function
 * @param {Object} req - L'objet de requête HTTP.
 * @param {Object} res - L'objet de réponse HTTP.
 * @returns {void} Renvoie une réponse JSON indiquant si la déconnexion a réussi ou une erreur.
 */
exports.logout = (req, res) => {
  try {
    // Supprime le cookie lié à l'authentification (token)
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    res.status(200).json({ message: 'Déconnexion réussie.' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la déconnexion.' });
  }
};