const bcrypt = require('bcrypt');
const User = require('../models/user');

class UserService {
  static async getAllUsers() {
    return await User.find();
  }

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

  static async deleteUser(id) {
    if (!id) {
      throw new Error('ID utilisateur manquant');
    }

    return await User.findByIdAndDelete(id);
  }
}

module.exports = UserService;