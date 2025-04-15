const express = require("express");
const swaggerDocs = require('./config/swagger-config'); // Swagger configuration
const swaggerUi = require('swagger-ui-express'); // Swagger : Documentation API
const cookieParser = require('cookie-parser');
const configureMiddlewares = require('./middleware/middlewares'); // Middlewares globaux
const path = require('path');
const { connectDB } = require("./config/db"); // Connexion à MongoDB
require("dotenv").config(); // Chargement des variables d'env
const authMiddleware = require('./middleware/authMiddleware'); // Authentication middleware
const methodOverride = require('method-override');
const cors = require('cors');

const corsOptions = {
  origin: ['https://express-mm-vercel.vercel.app/'], // Remplacez par votre URL Vercel
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true // Si vous transférez des cookies
};


const app = express();
app.use(cors(corsOptions));

  // Parser les requêtes JSON
  app.use(express.json());

// Connexion à la DB
connectDB();

app.get('/api-docs', (req, res) => res.redirect(301, '/api-docs/'));
  // Intégration de Swagger : affichage interactif de la documentation API
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


  // Serveur de fichiers statiques (CSS, JS, images, etc.)
  app.use(express.static(path.join(__dirname, 'public')));

  // Configurer le moteur de vues EJS
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'ejs');

app.use(methodOverride('_method')); // Pour les méthodes PUT et DELETE dans les formulaires
configureMiddlewares(app, swaggerDocs); // Middleware général venant de config/middlewares
app.use(cookieParser()); 

// Routes importées
const loginRoutes = require("./routes/login"); // Routes de connexion
const tableauDeBordRoutes = require('./routes/tableauDeBord'); // Dashboard routes
const userRoutes = require('./routes/users'); // User management routes
const catwayRoutes = require('./routes/catways'); // Routes pour les Catways
const reservationRoutes = require('./routes/reservations'); // Routes pour les Réservations

// *** ROUTES ***

// Routes publiques, sans authentification
app.use('/', loginRoutes);

// Routes protégées par `authMiddleware` (nécessitent être connecté)
app.use('/', authMiddleware, tableauDeBordRoutes); // Tableau de bord protégé
app.use('/users', authMiddleware, userRoutes); // Gestion des utilisateurs protégée
app.use('/catways', authMiddleware, catwayRoutes, reservationRoutes); // Accès aux Catways
app.use('/reservations', authMiddleware, reservationRoutes); // Gestion des réservations protégée

app.use((req, res) => {
  res.status(404).render('404');
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('[Error Handler]', err.stack); // Log the error stack
  res.status(500).send('Internal Server Error'); // Send a generic error response
});

    
// Ensure the server starts correctly
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
}).on('error', (err) => {
  console.error('[Server Error]', err.message); // Log server startup errors
  process.exit(1); // Exit the process with failure status
});

module.exports = app; // Exporter l'application express pour les tests