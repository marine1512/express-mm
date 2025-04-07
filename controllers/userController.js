const UserService = require('../services/userService');

class UserController {
  static async getAllUsers(req, res) {
    try {
      const users = await UserService.getAllUsers();
      res.render('users', { users });
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la lecture des utilisateurs', error: error.message });
    }
  }

  static async createUser(req, res) {
    try {
      const { username, password } = req.body;
      await UserService.createUser(username, password);
      res.redirect('/users');
    } catch (error) {
      res.status(500).send(`Erreur : ${error.message}`);
    }
  }

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