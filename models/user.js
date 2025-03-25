const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// **Hook avant sauvegarde (`save`)**
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
      // Si le mot de passe n'a pas été modifié, ne pas le hacher à nouveau
      return next();
  }

  try {
      const salt = await bcrypt.genSalt(10); // Générer un salt
      this.password = await bcrypt.hash(this.password, salt); // Hacher le mot de passe
      next();
  } catch (err) {
      next(err);
  }
});

// **Hook avant mise à jour (`findOneAndUpdate`)**
userSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate();

  if (update.password) {
      try {
          // Hacher le mot de passe avant mise à jour
          const salt = await bcrypt.genSalt(10);
          update.password = await bcrypt.hash(update.password, salt);

          // Pousser les modifications
          this.setUpdate(update);
      } catch (err) {
          return next(err);
      }
  }

  next();
});

// Méthode pour comparer les mots de passe (par exemple pour authentification)
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password); // Retourne vrai si les mots de passe correspondent
};


const User = mongoose.model('User', userSchema);
module.exports = User;