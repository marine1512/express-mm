const Reservation = require('../models/reservation');
const Catway = require('../models/catway'); // Nécessaire pour certaines opérations.
const mongoose = require('mongoose');

/** 
 * @module reservationServices
 * @description Service qui gère les reservations
*/

class ReservationService {
    /**
     * Récupère toutes les réservations.
     * @returns {Promise<Array<Object>>} Une promesse contenant une liste de toutes les réservations.
     */
    static async getAllReservations() {
        return await Reservation.find();
    }

    /**
     * Récupère les détails des réservations associées à un Catway spécifique.
     * @param {string} catwayId - L'ID du Catway.
     * @returns {Promise<Object|null>} Une promesse contenant les détails du Catway et ses réservations.
     * @throws {Error} Si une erreur survient lors de la récupération.
     */
    static async getReservationsForCatway(catwayId) {
        try {
            // Recherchez un Catway par son ID et chargez ses réservations
            const catway = await Catway.findById(new mongoose.Types.ObjectId(catwayId)).populate('reservationId');
            return catway;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Ajoute une nouvelle réservation à un Catway.
     * @param {string} catwayId - L'ID du Catway auquel la réservation est associée.
     * @param {Object} reservationData - Les données de la réservation.
     * @param {string} reservationData.customerName - Le nom du client.
     * @param {Date} reservationData.date - La date de la réservation.
     * @returns {Promise<Object>} Une promesse contenant la réservation sauvegardée.
     * @throws {Error} Si le Catway n'existe pas ou en cas d'erreur lors de la sauvegarde.
     */
    static async addReservation(catwayId, reservationData) {
        try {
            // Vérifiez si le Catway existe
            const catway = await Catway.findById(catwayId);
            if (!catway) {
                throw new Error('Catway introuvable');
            }

            // Créez une nouvelle réservation
            const newReservation = new Reservation({
                ...reservationData,
                catwayId: catwayId, // Ajout correct du champ catwayId
            });

            // Sauvegardez la réservation
            const savedReservation = await newReservation.save();
            console.log('Nouvelle réservation sauvegardée :', savedReservation);

            // Ajoutez la référence de la réservation au Catway (dans le champ `reservationId`)
            catway.reservationId.push(savedReservation._id);
            const updatedCatway = await catway.save();
            console.log('Catway mis à jour avec la nouvelle réservation :', updatedCatway);

            return savedReservation;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Supprime une réservation associée à un Catway.
     * @param {string} catwayId - L'ID du Catway.
     * @param {string} reservationId - L'ID de la réservation à supprimer.
     * @returns {Promise<void>} Une promesse indiquant la suppression terminée.
     * @throws {Error} Si aucune réservation n'est trouvée ou en cas d'erreur.
     */
    static async deleteReservation(catwayId, reservationId) {
        try {
            const result = await Reservation.deleteOne({
                _id: reservationId,
                catwayId: catwayId
            });

            if (result.deletedCount === 0) {
                throw new Error('Aucune réservation trouvée pour ces identifiants.');
            }
        } catch (error) {
            throw error;
        }
    }

    /**
     * Récupère les détails d'une réservation spécifique associée à un Catway.
     * @param {string} catwayId - L'ID du Catway associé.
     * @param {string} reservationId - L'ID de la réservation.
     * @returns {Promise<Object|null>} Une promesse contenant les détails de la réservation, ou `null` si les IDs ne sont pas valides.
     * @throws {Error} Si une erreur survient lors de la récupération.
     */
    static async getReservationDetails(catwayId, reservationId) {
        try {
            // Vérifiez la validité des ObjectIds
            if (!mongoose.Types.ObjectId.isValid(catwayId) || !mongoose.Types.ObjectId.isValid(reservationId)) {
                return null;
            }

            // Cherchez la réservation correspondant au catwayId et reservationId
            const reservation = await Reservation.findOne({
                _id: reservationId,
                catwayId
            });
            return reservation;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = ReservationService;