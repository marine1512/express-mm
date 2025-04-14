/**
 * @swagger
 * tags:
 *   name: Catways
 *   description: Gestion des Catways
 * components:
 *   schemas:
 *     Catway:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: ID de la catway
 *         catwayNumber:
 *           type: string
 *           description: Numéro de la catway
 *         type:
 *           type: string
 *           description: Type de la catway
 *         catwayState:
 *           type: string 
 *           description: Etat de la catway 
 */


const express = require('express');
const router = express.Router();
const catwayController = require('../controllers/catwayController');
const reservationsRoutes = require('../routes/reservations');


// Routes principales
/** 
 * @swagger
 * /catways:
 *   get:
 *     summary: Liste des catways
 *     tags: [Catways]
 *     responses:
 *       200:
 *         description: Liste des catways
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Catway'
 *       500:
 *         description: Erreur lors de la récupération des catways
 * 
 */
router.get('/', catwayController.getAllCatways); // Liste des catways

/**
 * @swagger
 * /catways/{id}:
 *   get:
 *     summary: Détails d'une catway
 *     tags: [Catways]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID de la catway
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Détails d'une catway
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/Catway'
 *       404:
 *         description: Catway non trouvée
 *       500:
 *         description: Erreur lors de la récupération de la catway
 */
router.get('/:id', catwayController.getCatwayById); // Détails d'une catway

/**
 * @swagger
 * /catways:
 *   post:
 *     summary: Création d'une catway
 *     tags: [Catways]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/components/schemas/Catway'
 *     responses:
 *       201:
 *         description: Catway crée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/Catway'
 *       400:
 *         description: Erreur lors de la création de la catway
 *       500:
 *         description: Erreur lors de la création de la catway
 */
router.post('/', catwayController.createCatway); // Création

/**
 * @swagger
 * /catways/{id}:
 *   put:
 *     summary: Mise à jour d'une catway
 *     tags: [Catways]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID de la catway
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/components/schemas/Catway'
 *     responses:
 *       200:
 *         description: Catway mise à jour
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/Catway'
 *       400:
 *         description: Erreur lors de la mise à jour de la catway
 *       404:
 *         description: Catway non trouvée
 *       500:
 *         description: Erreur lors de la mise à jour de la catway
 */
router.put('/:id', catwayController.updateCatway); // Mise à jour

/**
 * @swagger
 * /catways/{id}:
 *   delete:
 *     summary: Suppression d'une catway
 *     tags: [Catways]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID de la catway
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Catway supprimée
 *       404:
 *         description: Catway non trouvée
 *       500:
 *         description: Erreur lors de la suppression de la catway
 */
router.delete('/:id', catwayController.deleteCatway); // Suppression

// Sous-route pour réservations
router.use('/:id', reservationsRoutes);

module.exports = router;