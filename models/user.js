const mongoose = require('mongoose');

// Schéma utilisateur
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
});

// Modèle utilisateur basé sur le schéma
const User = mongoose.model('User', userSchema);

module.exports = User;