const UserService = require('../services/userService');

/**
 * Contrôleur pour gérer les opérations liées aux utilisateurs.
 */
class UserController {
  /**
   * Récupère tous les utilisateurs.
   *
   * @param {Object} req - L'objet de requête Express.
   * @param {Object} res - L'objet de réponse Express.
   * @returns {Promise<void>} Promesse résolue une fois que la réponse est envoyée.
   */
  static async getAllUsers(req, res) {
    try {
      const users = await UserService.getAllUsers();
      res.render('users', { users });
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la lecture des utilisateurs', error: error.message });
    }
  }

  /**
   * Crée un nouvel utilisateur.
   *
   * @param {Object} req - L'objet de requête Express contenant les données utilisateur (username, password).
   * @param {Object} res - L'objet de réponse Express.
   * @returns {Promise<void>} Promesse résolue une fois que la réponse est envoyée.
   */
  static async createUser(req, res) {
    try {
      const { username, password } = req.body;
      await UserService.createUser(username, password);
      res.redirect('/users');
    } catch (error) {
      res.status(500).send(`Erreur: ${error.message}`);
    }
  }

  /**
   * Met à jour un utilisateur existant.
   *
   * @param {Object} req - L'objet de requête Express contenant l'ID utilisateur dans les paramètres et les mises à jour dans le corps.
   * @param {Object} res - L'objet de réponse Express.
   * @returns {Promise<void>} Promesse résolue une fois que la réponse est envoyée.
   */
  static async updateUser(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;
      await UserService.updateUser(id, updates);
      res.redirect('/users');
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  }

  /**
   * Supprime un utilisateur.
   *
   * @param {Object} req - L'objet de requête Express contenant l'ID utilisateur dans les paramètres.
   * @param {Object} res - L'objet de réponse Express.
   * @returns {Promise<void>} Promesse résolue une fois que la réponse est envoyée.
   */
  static async deleteUser(req, res) {
    try {
      const { id } = req.params;
      await UserService.deleteUser(id);
      res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la suppression', error: error.message });
    }
  }
}

module.exports = UserController;