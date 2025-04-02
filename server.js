const express = require("express");
const { connectDB } = require("./config/db"); // Import de la connexion MongoDB
require("dotenv").config(); // Charger les variables d'environnement depuis .env
const path = require("path");
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./config/swagger-config'); // Import de votre configuration Swagger


const app = express();

// connexion à la DB
connectDB();

   // Middleware Swagger : affichage de la documentation
   app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Middleware global pour loguer les requêtes entrantes
app.use((req, res, next) => {
  next();
});

// Configuration des middlewares
app.use(express.json()); // Middleware natif pour lire les JSON
app.use(express.urlencoded({ extended: true })); // Middleware pour les requêtes encodées (formulaires)
app.use(express.static(path.join(__dirname, "public"))); // Serveur de fichiers statiques (CSS/JS/Images)

// Configuration du moteur de template EJS (pour les vues HTML dynamiques)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // Chemin des fichiers EJS

const methodOverride = require('method-override');
app.use(methodOverride('_method'));

// Import des routes

const loginRoutes = require("./routes/login"); // Routes pour la connexion dans routes/login.js
const tableauDeBord = require('./routes/tableauDeBord');
const userRoutes = require('./routes/users');
const catwayRoutes = require('./routes/catways'); // Importer les routes catways
const reservationRoutes = require('./routes/reservations'); // Toutes les routes liées au `catway`


// Utilisation des routes
app.use(loginRoutes); // Routage spécifique pour la connexion
app.use(tableauDeBord, );
app.use('/catways', catwayRoutes, reservationRoutes);
app.use('/users', userRoutes);
app.use('/reservations', reservationRoutes);

// Gestion des erreurs 404 (routes non trouvées)
app.use((req, res) => {
  res.status(404).send("Page non trouvée");
});

// Lancement du serveur
const PORT =  3000; 
app.listen(PORT, () => {
  console.log(`Serveur Express démarré sur http://localhost:${PORT}`);
});