const express = require("express");
const swaggerDocs = require('./config/swagger-config'); // Swagger configuration
const cookieParser = require('cookie-parser');
const configureMiddlewares = require('./config/middlewares'); // Middlewares globaux
const { connectDB } = require("./config/db"); // Connexion à MongoDB
require("dotenv").config(); // Chargement des variables d'env
const authMiddleware = require('./middleware/authMiddleware'); // Authentication middleware
const methodOverride = require('method-override');
const cors = require('cors');

const app = express();
app.use(cors());

  // Parser les requêtes JSON
  app.use(express.json());

// Connexion à la DB
connectDB();

  // Serveur de fichiers statiques (CSS, JS, images, etc.)
  app.use(express.static(path.join(__dirname, '../public')));

  // Configurer le moteur de vues EJS
  app.set('view engine', 'ejs');
  app.set("views", __dirname + "/views");

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

const PORT = process.env.PORT; // Définition du port, avec une valeur par défaut
// Lancement du serveur
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Serveur Express démarré sur http://localhost:${PORT}`);
  });
}

module.exports = app; // Exporter l'application express pour les tests