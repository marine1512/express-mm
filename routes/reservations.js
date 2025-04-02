const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb'); // Si vous utilisez MongoDB
const Reservation = require('../models/reservation');
const Catway = require('../models/catway');



/**
 * @swagger
 * /reservations:
 *   get:
 *     summary: Liste des réservations
 *     tags: [Reservations]
 *     description: Récupère toutes les réservations disponibles dans la base de données.
 *     responses:
 *       200:
 *         description: Succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: "string"
 *                     description: ID de la réservation.
 *                   clientName:
 *                     type: "string"
 *                     description: Nom du client.
 *                   boatName:
 *                     type: "string"
 *                     description: Nom du bateau.
 *                   checkIn:
 *                     type: "string"
 *                     format: date
 *                     description: Date d'arrivée.
 *                   checkOut:
 *                     type: "string"
 *                     format: date
 *                     description: Date de départ.
 *       500:
 *         description: Erreur interne du serveur.
 */
router.get('/',  async (req, res) => {
    try {
      const reservations = await Reservation.find(); // Récupère toutes les réservations dans la collection
      res.render('reservation-liste', { reservations });
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération des réservations', error });
    }
  });

/**
 * @swagger
 * /catways/{id}/reservations:
 *   get:
 *     summary: Récupère les réservations associées à un Catway
 *     tags: [Reservations]
 *     description: Cette route récupère un Catway spécifique basé sur son ID et retourne les détails des réservations associées.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: "string"
 *         description: ID unique du Catway.
 *     responses:
 *       200:
 *         description: Détails du Catway et de ses réservations récupérés avec succès.
 *         content:
 *           text/html:
 *             schema:
 *               type: object
 *               properties:
 *                 catway:
 *                   type: object
 *                   description: Détails du Catway récupéré.
 *                   example:
 *                     _id: "64f7a3b7a68dab0012345678"
 *                     name: "Catway Exemple"
 *                     location: "Paris"
 *                     reservation: ["64f7a3c7defdab0012345679", "64f7a3c8defdab001234567a"]
 *                 reservations:
 *                   type: array
 *                   description: Liste des réservations associées.
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: "string"
 *                         description: ID unique de la réservation.
 *                       date:
 *                         type: "string"
 *                         format: date
 *                         description: Date de la réservation.
 *                       client:
 *                         type: "string"
 *                         description: Nom du client ayant effectué la réservation.
 *                       details:
 *                         type: "string"
 *                         description: Autres détails de la réservation.
 *                   example:
 *                     - _id: "64f7a3c7defdab0012345679"
 *                       date: "2023-10-05"
 *                       client: "Marie Dupont"
 *                       details: "Réservation spéciale"
 *                     - _id: "64f7a3c8defdab001234567a"
 *                       date: "2023-10-10"
 *                       client: "Jean Martin"
 *                       details: "Réservation habituelle"
 *       400:
 *         description: ID de Catway invalide.
 *         content:
 *           text/plain:
 *             schema:
 *               type: "string"
 *               example: "ID de catway invalide."
 *       404:
 *         description: Catway non trouvé.
 *         content:
 *           text/plain:
 *             schema:
 *               type: "string"
 *               example: "Catway non trouvé."
 *       500:
 *         description: Erreur interne du serveur.
 *         content:
 *           text/plain:
 *             schema:
 *               type: "string"
 *               example: "Erreur interne du serveur."
 */
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


    // Rendre la page avec les données récupérées
    res.render('reservations', {
      catway,
      reservations, // Transmettre les détails des réservations à la vue
    });
  } catch (error) {
    res.status(500).send('Erreur interne du serveur.');
  }
});

/**
 * @swagger
 * /catways/{id}/reservations/{idReservation}:
 *   get:
 *     summary: Récupère une réservation spécifique
 *     tags: [Reservations]
 *     description: Cette route permet de récupérer les détails d'une réservation spécifique associée à un utilisateur donné.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: "string"
 *         description: L'identifiant unique de l'utilisateur ou du catway.
 *       - in: path
 *         name: idReservation
 *         required: true
 *         schema:
 *           type: "string"
 *         description: L'identifiant unique de la réservation.
 *     responses:
 *       200:
 *         description: Les détails de la réservation.
 *         content:
 *           text/html:
 *             schema:
 *               type: "string"
 *               example: Une vue HTML affichant les détails de la réservation.
 *       404:
 *         description: Aucune réservation trouvée pour les identifiants fournis.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: "string"
 *                   example: "Reservation not found"
 *       500:
 *         description: Erreur interne sur le serveur.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: "string"
 *                   example: "Erreur du serveur - détails de l'erreur."
 */
router.get("/:id/reservations/:idReservation", async (req, res) => {
  const { id, idReservation } = req.params;

  try {
    // Trouver une réservation spécifique par son ID et son Catway
    const reservation = await Reservation.findOne({
      _id: idReservation,
      catway: id, // Vérifie si la réservation appartient bien au catway
    });

    // Si la réservation n'est pas trouvée, retournez une erreur 404
    if (!reservation) {
      return res.status(404).json({ message: "Réservation introuvable" });
    }

    // Rendre la vue avec le détail de la réservation spécifique
    res.render("reservation-detail", { 
      reservation, // Transmet uniquement la réservation au template
      catway: id, // ID du catway auquel appartient la réservation
    });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur lors de la récupération de la réservation" });
  }
});

/**
 * @swagger
 * /catways/{id}/reservations:
 *   post:
 *     summary: Ajoute une réservation à un Catway
 *     tags: [Reservations]
 *     description: Permet d'ajouter une nouvelle réservation associée à un Catway spécifique basé sur son ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID du Catway pour lequel la réservation est créée.
 *         schema:
 *           type: "string"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               catwayNumber:
 *                 type: "string"
 *                 description: Numéro du Catway.
 *               clientName:
 *                 type: "string"
 *                 description: Nom du client qui effectue la réservation.
 *               boatName:
 *                 type: "string"
 *                 description: Nom du bateau du client.
 *               checkIn:
 *                 type: "string"
 *                 format: date-time
 *                 description: Date et heure d'arrivée du client.
 *               checkOut:
 *                 type: "string"
 *                 format: date-time
 *                 description: Date et heure de départ du client.
 *             required:
 *               - catwayNumber
 *               - clientName
 *               - boatName
 *               - checkIn
 *               - checkOut
 *     responses:
 *       201:
 *         description: Réservation ajoutée avec succès.
 *         content:
 *           text/html:
 *             schema:
 *               type: "string"
 *               example: Redirection vers la liste des réservations pour ce Catway.
 *       400:
 *         description: Requête invalide (champs manquants ou données incorrectes).
 *         content:
 *           text/plain:
 *             schema:
 *               type: "string"
 *               example: "Catway introuvable ou Champs manquants."
 *       404:
 *         description: Catway introuvable.
 *         content:
 *           text/plain:
 *             schema:
 *               type: "string"
 *               example: "Catway introuvable."
 *       500:
 *         description: Erreur interne sur le serveur.
 *         content:
 *           text/plain:
 *             schema:
 *               type: "string"
 *               example: "Erreur serveur."
 */
router.post('/:id/reservations', async (req, res) => {
  try {

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

    res.redirect(`/catways/${catway._id}/reservations`);
  } catch (error) {
    res.status(500).send('Erreur serveur.');
  }
});

/**
 * @swagger
 * /catways/{id}/reservations/{idReservation}:
 *   delete:
 *     summary: Supprime une réservation pour un Catway spécifique
 *     tags: [Reservations] # S'assurer que ce tag existe ou sera reconnu
 *     description: Supprime une réservation associée à un Catway en fonction des identifiants spécifiés. La réservation sera également retirée du tableau de réservations du Catway.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID du Catway auquel appartient la réservation.
 *         schema:
 *           type: "string"
 *       - name: idReservation
 *         in: path
 *         required: true
 *         description: ID de la réservation à supprimer.
 *         schema:
 *           type: "string"
 *     responses:
 *       200:
 *         description: Réservation supprimée avec succès.
 *         content:
 *           text/html:
 *             schema:
 *               type: "string"
 *               example: Redirection vers la page des réservations du Catway.
 *       404:
 *         description: Catway ou réservation introuvable.
 *         content:
 *           text/plain:
 *             schema:
 *               type: "string"
 *               example: "Catway introuvable ou Réservation introuvable"
 *       500:
 *         description: Erreur interne sur le serveur.
 *         content:
 *           text/html:
 *             schema:
 *               type: "string"
 *               example: "Erreur serveur."
 */
router.delete('/:id/reservations/:idReservation', async (req, res) => {
  try {

    const { id, idReservation } = req.params;

    // Rechercher le Catway
    const catway = await Catway.findById(id);
    if (!catway) {
      return res.status(404).send('Catway introuvable');
    }

    // Rechercher et confirmer la réservation avant de supprimer
    const reservationToDelete = await Reservation.findById(idReservation);
    if (!reservationToDelete) {
      return res.status(404).send('Réservation introuvable');
    }

    // Supprimer la réservation par ID
    await Reservation.findByIdAndDelete(idReservation);

    // Supprimer l'ID de la réservation du tableau du Catway
    catway.reservation = catway.reservation.filter(
      (reservationId) => reservationId.toString() !== idReservation
    );
    await catway.save();

    res.redirect(`/catways/${catway._id}/reservations`);
  } catch (error) {
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