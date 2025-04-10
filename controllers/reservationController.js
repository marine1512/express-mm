const ReservationService = require('../services/reservationService');

class ReservationController {
    static async getAll(req, res) {
        try {
            const reservations = await ReservationService.getAllReservations();
            res.render('reservation-liste', { reservations });
        } catch (error) {
            res.status(500).json({ message: 'Erreur lors de la récupération des réservations', error });
        }
    }

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

    static async create(req, res) {
        try {
            const newReservation = await ReservationService.addReservation(req.params.id, req.body);
            res.redirect(`/catways/${req.params.id}/reservations`);
        } catch (error) {
            res.status(500).send('Erreur lors de la création de la réservation.');
        }
    }

    static async delete(req, res) {
        try {
// Supprimer via le service
            await ReservationService.deleteReservation(req.params.id, req.params.idReservation);

            res.redirect(`/catways/${req.params.id}/reservations`);
        } catch (error) {
            res.status(500).send(error.message || 'Erreur serveur');
        }
    }
    
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