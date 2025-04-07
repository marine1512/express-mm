const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false, // Assurez-vous que ce champ est sélectionné par défaut
  },
  roles: {
    type: [String],
    default: [],
  },
});

userSchema.methods.validatePassword = async function (password) {
  console.log("Mot de passe fourni :", password); // Mot de passe en clair
  console.log("Mot de passe stocké (hash) :", this.password); // Hash stocké

  if (!password || !this.password) {
    throw new Error('Mot de passe ou hash manquant');
  }

  return await bcrypt.compare(password, this.password);
};

// Middleware pour hacher le mot de passe avant de sauvegarder
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10); // Génère un sel pour le hachage
  this.password = await bcrypt.hash(this.password, salt); // Remplace le mot de passe par sa version hachée
  next();
});

module.exports = mongoose.model("User", userSchema);