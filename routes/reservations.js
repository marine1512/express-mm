const express = require('express');
const router = express.Router();
const ReservationController = require('../controllers/reservationController');

router.get('/', ReservationController.getAll);
router.get('/:id/reservations', ReservationController.getForCatway);
router.get('/:id/reservations/:idReservation', ReservationController.getDetails);
router.post('/:id/reservations', ReservationController.create);
router.delete('/:id/reservations/:idReservation', ReservationController.delete);

module.exports = router;