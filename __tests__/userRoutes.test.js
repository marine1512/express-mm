const request = require('supertest');
const express = require('express');

// Mock du UserController
jest.mock('../controllers/userController', () => ({
  getAllUsers: jest.fn((req, res) => res.status(200).json([{ id: '1', username: 'MockUser' }])),
  createUser: jest.fn((req, res) => res.status(201).json({ id: '2', username: req.body.username })),
  updateUser: jest.fn((req, res) => res.status(200).json({ id: req.params.id, username: req.body.username })),
  deleteUser: jest.fn((req, res) => res.status(200).json({ message: 'Utilisateur supprimé' })),
}));

const userRoutes = require('../routes/users');

const app = express();
app.use(express.json()); // Middleware pour parser le corps des requêtes JSON
app.use('/users', userRoutes); // Utilisation de la route

describe('Tests des routes /users', () => {
  it('GET /users - Devrait retourner tous les utilisateurs', async () => {
    const response = await request(app).get('/users');
    expect(response.status).toBe(200); // Vérifie le statut
    expect(Array.isArray(response.body)).toBe(true); // Vérifie que le résultat est un tableau
    expect(response.body[0]).toHaveProperty('id'); // Vérifie que le premier utilisateur a un ID
    expect(response.body[0]).toHaveProperty('username'); // Vérifie que le premier utilisateur a un username
  });

  it('POST /users - Devrait créer un nouvel utilisateur', async () => {
    const mockUser = { username: 'NewUser' };

    const response = await request(app).post('/users').send(mockUser);
    expect(response.status).toBe(201); // Vérifie le statut
    expect(response.body).toHaveProperty('id'); // Vérifie la présence d'un ID dans la réponse
    expect(response.body.username).toBe(mockUser.username); // Vérifie que le username correspond à celui envoyé
  });

  it('PUT /users/:id - Devrait mettre à jour un utilisateur', async () => {
    const userId = '1';
    const updates = { username: 'UpdatedUser' };

    const response = await request(app).put(`/users/${userId}`).send(updates);
    expect(response.status).toBe(200); // Vérifie le statut
    expect(response.body).toHaveProperty('id', userId); // Vérifie que l'utilisateur mis à jour a le bon ID
    expect(response.body.username).toBe(updates.username); // Vérifie que le username a été mis à jour
  });

  it('DELETE /users/:id - Devrait supprimer un utilisateur', async () => {
    const userId = '1';

    const response = await request(app).delete(`/users/${userId}`);
    expect(response.status).toBe(200); // Vérifie le statut
    expect(response.body.message).toBe('Utilisateur supprimé'); // Vérifie le message de confirmation
  });
});