const request = require('supertest'); // Import de Supertest pour tester les routes
const express = require('express'); // Framework Express
const authRoutes = require('../routes/login'); // Import de vos routes
const authController = require('../controllers/authController'); // Mock du contrôleur
const app = express(); // Initialisation de l'app express

// Middleware nécessaire pour parser les requêtes POST (formulaires ou JSON)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Utiliser vos routes d'authentification
app.use('/auth', authRoutes);

// Mock des méthodes du contrôleur
jest.mock('../controllers/authController');

describe('Tests des routes d\'authentification', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Réinitialise les mocks avant chaque test
  });

  // Tester la route GET '/'
  it('GET /auth/ - devrait appeler getLoginPage du contrôleur', async () => {
    authController.getLoginPage.mockImplementation((req, res) => {
      res.status(200).send('Page de connexion'); // Mock de la réponse
    });

    const response = await request(app).get('/auth/'); // Effectuer une requête GET
    expect(response.status).toBe(200); // Vérifier le statut de la réponse
    expect(response.text).toBe('Page de connexion'); // Vérifier si le texte est celui attendu
    expect(authController.getLoginPage).toHaveBeenCalledTimes(1); // Vérifier si le contrôleur a été appelé
  });

  // Tester la route POST '/login'
  it('POST /auth/login - devrait appeler login du contrôleur', async () => {
    const mockRequestBody = { username: 'testuser', password: 'testpassword' }; // Exemple de données POST

    authController.login.mockImplementation((req, res) => {
      res.status(200).json({ message: 'Connexion réussie' });
    });

    const response = await request(app).post('/auth/login').send(mockRequestBody);
    expect(response.status).toBe(200); // Vérifie que la réponse est un succès
    expect(response.body.message).toBe('Connexion réussie'); // Vérifie le message JSON retourné
    expect(authController.login).toHaveBeenCalledTimes(1); // Vérifie si le contrôleur a été appelé une fois
    expect(authController.login).toHaveBeenCalledWith(
      expect.any(Object), // Vérifie que le contrôleur a reçu un objet req
      expect.any(Object)  // Vérifie que le contrôleur a reçu un objet res
    );
  });

  // Tester la route POST '/logout'
  it('POST /auth/logout - devrait appeler logout du contrôleur', async () => {
    authController.logout.mockImplementation((req, res) => {
      res.status(200).json({ message: 'Déconnexion réussie' });
    });

    const response = await request(app).post('/auth/logout');
    expect(response.status).toBe(200); // Vérifie que la réponse est un succès
    expect(response.body.message).toBe('Déconnexion réussie'); // Vérifie le message JSON retourné
    expect(authController.logout).toHaveBeenCalledTimes(1); // Vérifie que la méthode a été appelée une fois
    expect(authController.logout).toHaveBeenCalledWith(
      expect.any(Object), // Vérifie que le contrôleur a reçu un objet req
      expect.any(Object)  // Vérifie que le contrôleur a reçu un objet res
    );
  });
});