const mongoose = require('mongoose');

// Définir le schéma Catway
const CatwaySchema = new mongoose.Schema({
    catwayNumber: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    catwayState: {
        type: String,
        required: true
    }
});

// Exporter le modèle
module.exports = mongoose.model('Catway', CatwaySchema);