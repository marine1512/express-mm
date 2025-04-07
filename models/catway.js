const mongoose = require('mongoose');

// Définir le schéma Catway
const catwaySchema = new mongoose.Schema({
    catwayNumber: {
      type: String,
      required: true,
      unique: true, // Assurez-vous que chaque catway a un numéro unique
    },
    type: {
      type: String,
      required: true,
    },
    catwayState: {
      type: String,
      default: 'Libre', // Par défaut, un catway est disponible
    },
      // Lien vers les réservations
  reservationId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reservation' // Référence le modèle `Reservation`
    }
  ]
});

// Exporter le modèle Catway
module.exports = mongoose.model('Catway', catwaySchema);