const mongoose = require('mongoose');

// Schéma utilisateur
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Modèle utilisateur basé sur le schéma
const User = mongoose.model('User', userSchema);

module.exports = User;