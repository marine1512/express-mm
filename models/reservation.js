const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Définir le schéma Reservation
const reservationSchema = new Schema({
  CatwayNumber: { type: Number }, 
  clientName: { type: String, required: true },
  boatName: { type: String, required: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },

  catwayId: { type: mongoose.Schema.Types.ObjectId, ref: 'Catway' } 
});

// Export du modèle Reservation
module.exports = mongoose.model('Reservation', reservationSchema);