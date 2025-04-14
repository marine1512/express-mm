const request = require('supertest');
const express = require('express');
const router = require('../routes/reservations');
const ReservationController = require('../controllers/reservationController');

const app = express();
app.use(express.json());
app.use('/api/v1/reservations', router);

// Mock des méthodes du contrôleur
jest.mock('../controllers/reservationController', () => ({
  getAll: jest.fn((req, res) => res.status(200).json({ reservations: [] })),
  getForCatway: jest.fn((req, res) =>
    res.status(200).json({ id: req.params.id, reservations: [] })
  ),
  getDetails: jest.fn((req, res) =>
    res
      .status(200)
      .json({ id: req.params.id, idReservation: req.params.idReservation })
  ),
  create: jest.fn((req, res) =>
    res.status(201).json({ message: 'Reservation created' })
  ),
  delete: jest.fn((req, res) =>
    res.status(200).json({ message: 'Reservation deleted' })
  ),
}));

describe('Reservation Routes', () => {
  it('GET /api/v1/reservations should return all reservations', async () => {
    const response = await request(app).get('/api/v1/reservations');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ reservations: [] });
    expect(ReservationController.getAll).toHaveBeenCalled(); // Vérifie que la méthode est bien appelée
  });

  it('GET /api/v1/reservations/:id/reservations should return reservations for a specific Catway', async () => {
    const response = await request(app).get('/api/v1/reservations/1/reservations');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id: '1', reservations: [] });
    expect(ReservationController.getForCatway).toHaveBeenCalledWith(
      expect.objectContaining({ params: { id: '1' } }),
      expect.any(Object),
      expect.any(Function)
    );
  });

  it('GET /api/v1/reservations/:id/reservations/:idReservation should return reservation details', async () => {
    const response = await request(app).get(
      '/api/v1/reservations/1/reservations/99'
    );
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: '1',
      idReservation: '99',
    });
    expect(ReservationController.getDetails).toHaveBeenCalledWith(
      expect.objectContaining({ params: { id: '1', idReservation: '99' } }),
      expect.any(Object),
      expect.any(Function)
    );
  });

  it('POST /api/v1/reservations/:id/reservations should create a new reservation', async () => {
    const response = await request(app)
      .post('/api/v1/reservations/1/reservations')
      .send({ name: 'TestReservation', date: '2023-12-01' });
    expect(response.status).toBe(201);
    expect(response.body).toEqual({ message: 'Reservation created' });
    expect(ReservationController.create).toHaveBeenCalledWith(
      expect.objectContaining({
        params: { id: '1' },
        body: { name: 'TestReservation', date: '2023-12-01' },
      }),
      expect.any(Object),
      expect.any(Function)
    );
  });

  it('DELETE /api/v1/reservations/:id/reservations/:idReservation should delete a reservation', async () => {
    const response = await request(app).delete(
      '/api/v1/reservations/1/reservations/99'
    );
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Reservation deleted' });
    expect(ReservationController.delete).toHaveBeenCalledWith(
      expect.objectContaining({ params: { id: '1', idReservation: '99' } }),
      expect.any(Object),
      expect.any(Function)
    );
  });
});