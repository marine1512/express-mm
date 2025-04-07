const Reservation = require('../models/reservation');
const Catway = require('../models/catway'); // Nécessaire pour certaines opérations.
const mongoose = require('mongoose');

class ReservationService {
    // Récupérer toutes les réservations
    static async getAllReservations() {
        return await Reservation.find();
    }

    // Récupérer les détails des réservations associées à un Catway
    static async getReservationsForCatway(catwayId) {
        try {
            const catway = await Catway.findOne({ _id: catwayId }).populate('reservationId');
    
            // Si aucun Catway trouvé, gestion de l'erreur
            if (!catway) {
                throw new Error(`Catway introuvable pour l'ID ${catwayId}`);
            }
    
            return catway;
        } catch (error) {
            console.error('Erreur dans getReservationsForCatway :', error.message);
            throw error; // Propagation de l'erreur
        }
    }

    // Ajouter une nouvelle réservation
    static async addReservation(catwayId, reservationData) {
        try {
            console.log('ID du Catway pour l’ajout :', catwayId);
    
            // Vérifiez si le Catway existe
            const catway = await Catway.findById(catwayId);
            if (!catway) {
                throw new Error('Catway introuvable');
            }
    
            console.log('Catway trouvé :', catway);
    
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
            console.error('Erreur lors de l’ajout de réservation :', error);
            throw error;
        }
    }

    // Supprimer une réservation
    static async deleteReservation(catwayId, reservationId) {
        try {
            console.log(`Tentative de suppression : Catway ID = ${catwayId}, Reservation ID = ${reservationId}`);
            
            const result = await Reservation.deleteOne({
                _id: reservationId,
                catwayId: catwayId
            });
            
            console.log('Résultat de la requête MongoDB :', result);
            
            if (result.deletedCount === 0) {
                throw new Error('Aucune réservation trouvée pour ces identifiants.');
            }
    
            console.log('Suppression réussie avec MongoDB.');
        } catch (error) {
            console.error('Erreur dans deleteReservation :', error.message);
            throw error;
        }
    }

    // Récupération de détails d'une réservation spécifique
    static async getReservationDetails(catwayId, reservationId) {
        try {
            // Vérifiez la validité des ObjectIds
            if (!mongoose.Types.ObjectId.isValid(catwayId) || !mongoose.Types.ObjectId.isValid(reservationId)) {
                console.warn(`Identifiants invalides : CatwayID (${catwayId}), ReservationID (${reservationId})`);
                return null;
            }
    
            // Cherchez la réservation correspondant au catwayId et reservationId
            const reservation = await Reservation.findOne({ 
                _id: reservationId, 
                catwayId 
            });
    
            if (!reservation) {
                console.warn(`Aucune réservation trouvée pour le Catway ID ${catwayId} avec Réservation ID ${reservationId}`);
            }
    
            return reservation;
        } catch (error) {
            console.error('Erreur dans la méthode getReservationDetails :', error.message);
            throw error;
        }
    }
}

module.exports = ReservationService;