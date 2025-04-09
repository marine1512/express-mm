/**
 * @swagger
 * tags:
 *   name: Catways
 *   description: Gestion des Catways
 */


const express = require('express');
const router = express.Router();
const catwayController = require('../controllers/catwayController');
const reservationsRoutes = require('../routes/reservations');


// Routes principales
router.get('/', catwayController.getAllCatways); // Liste des catways
router.get('/:id', catwayController.getCatwayById); // Détails d'une catway
router.post('/', catwayController.createCatway); // Création
router.put('/:id', catwayController.updateCatway); // Mise à jour
router.delete('/:id', catwayController.deleteCatway); // Suppression

// Sous-route pour réservations
router.use('/:id', reservationsRoutes);

module.exports = router;