const request = require('supertest');
const express = require('express');
const catwaysRoutes = require('../routes/catways'); // Remplacez par votre vrai chemin
const catwayController = require('../controllers/catwayController');

// Mock d'une application express
const app = express();
app.use(express.json());
app.use('/catways', catwaysRoutes);

// Mock des fonctions du contrôleur
jest.mock('../controllers/catwayController');

describe('Tests API /catways', () => {
  let mockCatways;

  beforeEach(() => {
    mockCatways = [
      { id: '1', name: 'Catway 1', location: 'Paris' },
      { id: '2', name: 'Catway 2', location: 'Lyon' },
    ];
  });

  afterEach(() => {
    jest.clearAllMocks(); // Nettoie les mocks après chaque test
  });

  it('GET /catways - should return list of all catways', async () => {
    catwayController.getAllCatways.mockImplementation((req, res) =>
      res.status(200).json(mockCatways)
    );

    const response = await request(app).get('/catways');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toEqual(mockCatways);
    expect(catwayController.getAllCatways).toHaveBeenCalledTimes(1);
  });

  it('GET /catways/:id - should return details of a single catway', async () => {
    const mockCatway = mockCatways[0];

    catwayController.getCatwayById.mockImplementation((req, res) => {
      if (req.params.id === mockCatway.id) {
        res.status(200).json(mockCatway);
      } else {
        res.status(404).json({ message: 'Catway not found' });
      }
    });

    const response = await request(app).get(`/catways/${mockCatway.id}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockCatway);
    expect(catwayController.getCatwayById).toHaveBeenCalledTimes(1);
  });

  it('POST /catways - should create a new catway', async () => {
    const newCatway = { id: '3', name: 'Catway 3', location: 'Marseille' };

    catwayController.createCatway.mockImplementation((req, res) => {
      if (req.body.name && req.body.location) {
        res.status(201).json(newCatway);
      } else {
        res.status(400).json({ message: 'Invalid data' });
      }
    });

    const response = await request(app).post('/catways').send(newCatway);

    expect(response.status).toBe(201);
    expect(response.body).toEqual(newCatway);
    expect(catwayController.createCatway).toHaveBeenCalledTimes(1);
  });

  it('PUT /catways/:id - should update details of an existing catway', async () => {
    const updatedCatway = { name: 'Updated Catway', location: 'Nice' };

    catwayController.updateCatway.mockImplementation((req, res) => {
      if (req.params.id === '1') {
        res.status(200).json({ ...mockCatways[0], ...req.body });
      } else {
        res.status(404).json({ message: 'Catway not found' });
      }
    });

    const response = await request(app)
      .put('/catways/1')
      .send(updatedCatway);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe(updatedCatway.name);
    expect(response.body.location).toBe(updatedCatway.location);
    expect(catwayController.updateCatway).toHaveBeenCalledTimes(1);
  });

  it('DELETE /catways/:id - should delete a specific catway', async () => {
    catwayController.deleteCatway.mockImplementation((req, res) => {
      if (req.params.id === '1') {
        res.status(200).json({ message: 'Catway deleted successfully' });
      } else {
        res.status(404).json({ message: 'Catway not found' });
      }
    });

    const response = await request(app).delete('/catways/1');

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Catway deleted successfully');
    expect(catwayController.deleteCatway).toHaveBeenCalledTimes(1);
  });

  it('Sub-route /catways/:id/reservations should pass to reservationsRoutes', async () => {
    // Simule un passage de sous-route
    const mockReservationsRouter = jest.fn((req, res) =>
      res.status(200).json({ message: 'Sub-route reached.' })
    );

    app.use('/catways/:id/reservations', mockReservationsRouter);

    const response = await request(app).get('/catways/1/reservations');

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Sub-route reached.');
  });
});