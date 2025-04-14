const UserService = require('../services/userService');

/** 
 * @module userController
 * @description Controller qui gère les utilisateurs
*/

class UserController {

  /**
   * Récupère et affiche tous les utilisateurs.
   * @async
   * @param {Object} req - Objet requête Express.
   * @param {Object} res - Objet réponse Express.
   * @returns {Promise<void>} Renvoie une page contenant tous les utilisateurs ou une erreur serveur.
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
   * Crée un nouvel utilisateur et redirige vers la liste des utilisateurs.
   * @async
   * @param {Object} req - Objet requête Express.
   * @param {Object} res - Objet réponse Express.
   * @property {string} req.body.username - Nom d'utilisateur.
   * @property {string} req.body.password - Mot de passe.
   * @returns {Promise<void>} Redirige vers la liste des utilisateurs ou envoie une erreur.
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
   * Met à jour les informations d'un utilisateur spécifique.
   * @async
   * @param {Object} req - Objet requête Express.
   * @param {Object} res - Objet réponse Express.
   * @property {string} req.params.id - ID de l'utilisateur à mettre à jour.
   * @property {Object} req.body - Les mises à jour de l'utilisateur.
   * @returns {Promise<void>} Redirige vers la liste des utilisateurs ou envoie une erreur.
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
   * Supprime un utilisateur spécifique.
   * @async
   * @param {Object} req - Objet requête Express.
   * @param {Object} res - Objet réponse Express.
   * @property {string} req.params.id - ID de l'utilisateur à supprimer.
   * @returns {Promise<void>} Envoie une confirmation ou une erreur.
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