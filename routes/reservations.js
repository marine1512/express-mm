const express = require('express');
const router = express.Router();
const Reservation = require('../models/reservation'); // Import du modèle

// Route GET : Liste complète des réservations
router.get('/',  async (req, res) => {
    try {
      const reservations = await Reservation.find(); // Récupère toutes les réservations dans la collection
      console.log("Données des réservations :", reservations); 
      res.render('reservations', { reservations });
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération des réservations', error });
    }
  });



// Exporter les routes
module.exports = router;