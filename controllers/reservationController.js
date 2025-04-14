const ReservationService = require('../services/reservationService');

/** 
 * @module reservationController
 * @description Controller qui gère les réservations
*/

class ReservationController {
    /**
     * Récupère toutes les réservations et les affiche dans une vue.
     * @param {Object} req - L'objet de requête Express.
     * @param {Object} res - L'objet de réponse Express.
     * @returns {Promise<void>}
     */
    static async getAll(req, res) {
        try {
            const reservations = await ReservationService.getAllReservations();
            res.render('reservation-liste', { reservations });
        } catch (error) {
            res.status(500).json({ message: 'Erreur lors de la récupération des réservations', error });
        }
    }

    /**
     * Récupère les réservations associées à un catway spécifique.
     * @param {Object} req - L'objet de requête Express (inclut req.params.id).
     * @param {Object} res - L'objet de réponse Express.
     * @returns {Promise<void>}
     */
    static async getForCatway(req, res) {
        try {
            const catway = await ReservationService.getReservationsForCatway(req.params.id);
            res.render('reservations', {
                catway,
                reservations: catway.reservationId,
            });
        } catch (error) {
            res.status(500).send('Erreur lors de la récupération des réservations.');
        }
    }

    /**
     * Crée une nouvelle réservation pour un catway.
     * @param {Object} req - L'objet de requête Express (inclut req.params.id et req.body).
     * @param {Object} res - L'objet de réponse Express.
     * @returns {Promise<void>}
     */
    static async create(req, res) {
        try {
            const newReservation = await ReservationService.addReservation(req.params.id, req.body);
            res.redirect(`/catways/${req.params.id}/reservations`);
        } catch (error) {
            res.status(500).send('Erreur lors de la création de la réservation.');
        }
    }

    /**
     * Supprime une réservation spécifique associée à un catway.
     * @param {Object} req - L'objet de requête Express (inclut req.params.id et req.params.idReservation).
     * @param {Object} res - L'objet de réponse Express.
     * @returns {Promise<void>}
     */
    static async delete(req, res) {
        try {
            // Supprimer via le service
            await ReservationService.deleteReservation(req.params.id, req.params.idReservation);

            res.redirect(`/catways/${req.params.id}/reservations`);
        } catch (error) {
            res.status(500).send(error.message || 'Erreur serveur');
        }
    }

    /**
     * Récupère les détails d'une réservation spécifique pour un catway.
     * @param {Object} req - L'objet de requête Express (inclut req.params.id et req.params.idReservation).
     * @param {Object} res - L'objet de réponse Express.
     * @returns {Promise<void>}
     */
    static async getDetails(req, res) {
        try {
            const { id, idReservation } = req.params;
    
            // Appel au service
            const reservation = await ReservationService.getReservationDetails(id, idReservation);
    
            if (!reservation) {
                return res.status(404).json({ message: "Réservation introuvable pour ce catway" });
            }
            // Si une réservation est trouvée, rendre la vue
            res.render('reservation-detail', { 
                reservation,
                catway: { _id: id }   // Transmettez l'ID du catway
            });
        } catch (err) {
            res.status(500).json({ error: 'Erreur serveur' });
        }
    }
}

module.exports = ReservationController;