const mongoose = require("mongoose");

// Définir un modèle pour les utilisateurs
const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    motDePasse: { type: String, required: true }
  }, { timestamps: true });
  
  module.exports = mongoose.model('User', UserSchema);