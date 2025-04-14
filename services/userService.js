const bcrypt = require('bcryptjs');
const User = require('../models/user');

/** 
 * @module userServices
 * @description Service qui gère les utilisateurs
*/

class UserService {
  /**
   * Récupère tous les utilisateurs.
   * @returns {Promise<Array<Object>>} Une promesse contenant la liste de tous les utilisateurs.
   */
  static async getAllUsers() {
    return await User.find();
  }

  /**
   * Crée un nouvel utilisateur avec un nom d'utilisateur et un mot de passe.
   * @param {string} username - Le pseudo de l'utilisateur.
   * @param {string} password - Le mot de passe de l'utilisateur.
   * @throws {Error} Si le pseudo ou le mot de passe est manquant, ou si le pseudo est déjà utilisé.
   * @returns {Promise<Object>} Une promesse contenant l'utilisateur créé.
   */
  static async createUser(username, password) {
    if (!username || !password) {
      throw new Error('Le pseudo et le mot de passe sont requis.');
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      throw new Error('Ce pseudo est déjà utilisé.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    return newUser;
  }

  /**
   * Met à jour un utilisateur avec de nouvelles informations.
   * @param {string} id - L'ID de l'utilisateur à mettre à jour.
   * @param {Object} updates - Les nouvelles valeurs pour l'utilisateur.
   * @param {string} [updates.password] - (Optionnel) Le nouveau mot de passe de l'utilisateur.
   * @throws {Error} Si l'utilisateur n'existe pas ou si la mise à jour échoue.
   * @returns {Promise<Object>} Une promesse contenant l'utilisateur mis à jour.
   */
  static async updateUser(id, updates) {
    const user = await User.findById(id);
    if (!user) {
      throw new Error("Utilisateur introuvable");
    }

    if (updates.password && updates.password.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(updates.password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });
    if (!updatedUser) {
      throw new Error("Impossible de mettre à jour l'utilisateur.");
    }
    return updatedUser;
  }

  /**
   * Supprime un utilisateur par son ID.
   * @param {string} id - L'ID de l'utilisateur à supprimer.
   * @throws {Error} Si aucun ID n'est fourni.
   * @returns {Promise<Object|null>} Une promesse contenant l'utilisateur supprimé ou `null` si aucun utilisateur n'a été trouvé.
   */
  static async deleteUser(id) {
    if (!id) {
      throw new Error('ID utilisateur manquant');
    }

    return await User.findByIdAndDelete(id);
  }
}

module.exports = UserService;