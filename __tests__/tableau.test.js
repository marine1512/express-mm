const request = require('supertest');
const app = require('../server'); // Chemin vers votre application principale

describe('GET /tableau', () => {
  it('should render the tableauDeBord view', async () => {
    const response = await request(app).get('/tableau');

    expect(response.status).toBe(200); // Vérifie que le statut est 200
    expect(response.text).toContain('<title>Tableau de Bord</title>'); // Vérifie le titre dans le HTML
  });
});