const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb'); // Si vous utilisez MongoDB
const Reservation = require('../models/reservation');
const Catway = require('../models/catway');
const { validationResult } = require('express-validator');


// 1. Liste complète des réservations
router.get('/',  async (req, res) => {
    try {
      const reservations = await Reservation.find(); // Récupère toutes les réservations dans la collection
      console.log("Données des réservations :", reservations); 
      res.render('reservation-liste', { reservations });
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération des réservations', error });
    }
  });


// 2. Récupéré les reservations par ID
router.get('/:id/reservations', async (req, res) => {
  try {
    // Récupérer le catway par son ID
    const catwayId = req.params.id;

    // Assurez-vous que l'ID fourni est valide
    if (!ObjectId.isValid(catwayId)) {
      return res.status(400).send('ID de catway invalide.');
    }

    // Requête pour récupérer le Catway
    const catway = await Catway.findOne({ _id: new ObjectId(catwayId) });
    if (!catway) {
      return res.status(404).send('Catway non trouvé.');
    }
console.log(catway);


    // Récupérer les détails des réservations associées
    const reservations = await Reservation
      .find({ _id: { $in: catway.reservation } });
      // .toArray()
console.log(reservations);


    // Rendre la page avec les données récupérées
    res.render('reservations', {
      catway,
      reservations, // Transmettre les détails des réservations à la vue
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des données :', error);
    res.status(500).send('Erreur interne du serveur.');
  }
});


// 2. GET /catways/:id/reservations/:idReservation
router.get("/:id/reservations/:idReservation", async (req, res) => {
  try {
    const reservation = await Reservation.findOne({
      _id: req.params.idReservation,
      catway: req.params.id,
    });

    if (!reservation)
      return res.status(404).json({ message: "Reservation not found" });

    res.render('reservation-detail', { reservation });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Créer une nouvelle réservation
router.post('/:id/reservations', async (req, res) => {
  try {
    console.log("ID du Catway reçu :", req.params.id);

    // Rechercher le Catway par son ID dans req.params.id
    const catway = await Catway.findById(req.params.id);
    if (!catway) {
      return res.status(404).send('Catway introuvable');
    }

    // Vérifier ou initialiser la propriété `reservation` si elle est undefined
    if (!Array.isArray(catway.reservation)) {
      catway.reservation = []; // Initialiser comme un tableau vide
    }

    // Récupération des données envoyées dans le corps de la requête
    const { catwayNumber ,clientName, boatName, checkIn, checkOut } = req.body;

    console.log("Données de la réservation :", { clientName, boatName, checkIn, checkOut });

    // Créer une nouvelle réservation
    const newReservation = new Reservation({
      catwayNumber,
      clientName,
      boatName,
      checkIn,
      checkOut,
      CatwayNumber: catway.catwayNumber,
      catwayId: catway._id
    });

    // Sauvegarder la réservation dans la collection MongoDB
    await newReservation.save();

    // Ajouter l'ID de la nouvelle réservation à la liste `reservation` du Catway
    catway.reservation.push(newReservation._id);

    // Sauvegarder le Catway mis à jour
    await catway.save();

    console.log("Nouvelle réservation ajoutée :", newReservation);
    res.redirect(`/catways/${catway._id}/reservations`);
  } catch (error) {
    console.error("Erreur détectée :", error);
    res.status(500).send('Erreur serveur.');
  }
});

// 4. Supprimer une reservation par ID de reservation
router.delete('/:id/reservations/:idReservation', async (req, res) => {
  try {
    console.log("Tentative de suppression d'une réservation...");
    console.log("ID Catway :", req.params.id);
    console.log("ID Réservation :", req.params.idReservation);

    const { id, idReservation } = req.params;

    // Rechercher le Catway
    const catway = await Catway.findById(id);
    if (!catway) {
      console.log("Catway introuvable !");
      return res.status(404).send('Catway introuvable');
    }

    // Rechercher et confirmer la réservation avant de supprimer
    const reservationToDelete = await Reservation.findById(idReservation);
    if (!reservationToDelete) {
      console.log("Réservation introuvable !");
      return res.status(404).send('Réservation introuvable');
    }

    // Supprimer la réservation par ID
    await Reservation.findByIdAndDelete(idReservation);

    // Supprimer l'ID de la réservation du tableau du Catway
    catway.reservation = catway.reservation.filter(
      (reservationId) => reservationId.toString() !== idReservation
    );
    await catway.save();

    console.log("Réservation supprimée :", reservationToDelete);

    res.redirect(`/catways/${catway._id}/reservations`);
  } catch (error) {
    console.error("Erreur lors de la suppression :", error);
    res.status(500).send('Erreur serveur');
  }
});


// 5. PATCH /catways/:id
router.patch("/catways/:id", async (req, res) => {
  try {
    const updatedCatway = await Catway.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!updatedCatway)
      return res.status(404).json({ message: "Catway not found" });
    res.redirect('/catways');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// Exporter les routes
module.exports = router;