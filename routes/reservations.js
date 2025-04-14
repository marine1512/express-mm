/**
 * @swagger
 * tags:
 *   name: Reservations
 *   description: Gestion des réservations des Catways
 * components:
 *   schemas:
 *     Reservation:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: ID unique de la réservation
 *         catwayId:
 *           type: string
 *           description: ID du Catway associé
 *         startDate:
 *           type: string
 *           format: date-time
 *           description: Date de début de la réservation
 *         endDate:
 *           type: string
 *           format: date-time
 *           description: Date de fin de la réservation
 *         clientName:
 *           type: string
 *           description: Nom du client effectuant la réservation
 *       required:
 *         - catwayId
 *         - startDate
 *         - endDate
 *         - clientName
 */

const express = require('express');
const router = express.Router();
const ReservationController = require('../controllers/reservationController');

/**
 * @swagger
 * /reservations:
 *   get:
 *     summary: Récupérer toutes les réservations
 *     tags: [Reservations]
 *     responses:
 *       200:
 *         description: Liste de toutes les réservations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reservation'
 *       500:
 *         description: Erreur lors de la récupération des réservations
 */
router.get('/', ReservationController.getAll);

/**
 * @swagger
 * /{id}/reservations:
 *   get:
 *     summary: Récupérer les réservations pour un Catway spécifique
 *     tags: [Reservations]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du Catway
 *     responses:
 *       200:
 *         description: Liste des réservations associées au Catway
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reservation'
 *       404:
 *         description: Catway ou réservations non trouvés
 *       500:
 *         description: Erreur lors de la récupération des réservations
 */
router.get('/:id/reservations', ReservationController.getForCatway);

/**
 * @swagger
 * /{id}/reservations/{idReservation}:
 *   get:
 *     summary: Récupérer les détails d'une réservation spécifique
 *     tags: [Reservations]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du Catway associé
 *       - name: idReservation
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la réservation
 *     responses:
 *       200:
 *         description: Détails de la réservation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       404:
 *         description: Réservation introuvable
 *       500:
 *         description: Erreur lors de la récupération de la réservation
 */
router.get('/:id/reservations/:idReservation', ReservationController.getDetails);

/**
 * @swagger
 * /{id}/reservations:
 *   post:
 *     summary: Créer une réservation pour un Catway
 *     tags: [Reservations]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du Catway pour lequel la réservation est créée
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Reservation'
 *     responses:
 *       201:
 *         description: Réservation créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       404:
 *         description: Catway non trouvé
 *       500:
 *         description: Erreur lors de la création de la réservation
 */
router.post('/:id/reservations', ReservationController.create);

/**
 * @swagger
 * /{id}/reservations/{idReservation}:
 *   delete:
 *     summary: Supprimer une réservation spécifique pour un Catway
 *     tags: [Reservations]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du Catway associé
 *       - name: idReservation
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la réservation à supprimer
 *     responses:
 *       204:
 *         description: Réservation supprimée avec succès
 *       404:
 *         description: Catway ou réservation introuvable
 *       500:
 *         description: Erreur lors de la suppression de la réservation
 */
router.delete('/:id/reservations/:idReservation', ReservationController.delete);

module.exports = router;