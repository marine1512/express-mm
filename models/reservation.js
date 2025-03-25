const mongoose = require('mongoose');

// Schéma de réservation
const reservationSchema = new mongoose.Schema({
    catwayNumber: { type: Number, required: true },
    clientName: { type: String, required: true },
    boatName: { type: String, required: true },
    checkIn: { type: Date, default: null }, 
    checkOut: { type: Date, default: null } 
});

// Export du modèle
module.exports = mongoose.model('Reservation', reservationSchema);