const express = require("express");
const swaggerDocs = require('./config/swagger-config'); // Swagger configuration
const configureMiddlewares = require('./config/middlewares'); // Middlewares globaux
const { connectDB } = require("./config/db"); // Connexion à MongoDB
require("dotenv").config(); // Chargement des variables d'env
const path = require("path");
const authMiddleware = require('./middleware/authMiddleware'); // Authentication middleware
const methodOverride = require('method-override');

const app = express();

// Connexion à la DB
connectDB();

// Configuration du moteur EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // Chemin des fichiers EJS

// Middlewares globaux
app.use(methodOverride('_method')); // Pour les méthodes PUT et DELETE dans les formulaires
configureMiddlewares(app, swaggerDocs); // Middleware général venant de config/middlewares

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
app.use('/tableauDeBord', authMiddleware, tableauDeBordRoutes); // Tableau de bord protégé
app.use('/users', authMiddleware, userRoutes); // Gestion des utilisateurs protégée
app.use('/catways', authMiddleware, catwayRoutes); // Accès aux Catways
app.use('/reservations', authMiddleware, reservationRoutes); // Gestion des réservations protégée

// Gestion des erreurs 404 pour les routes manquantes
app.use((req, res) => {
  res.status(404).render('404'); // Affiche la page 404.ejs
});
const PORT = process.env.PORT; // Définition du port, avec une valeur par défaut
// Lancement du serveur
app.listen(PORT, () => {
  console.log(`Serveur Express démarré sur http://localhost:${PORT}`);
});