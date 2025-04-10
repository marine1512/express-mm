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
            // Recherchez un Catway par son ID et chargez ses réservations
            const catway = await Catway.findById(new mongoose.Types.ObjectId(catwayId)).populate('reservationId');
            return catway;
        } catch (error) {
            throw error;
        }
    }

    // Ajouter une nouvelle réservation
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

    // Supprimer une réservation
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

    // Récupération de détails d'une réservation spécifique
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