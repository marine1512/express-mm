const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

// Connexion à MongoDB (mettre à jour l'URI dans .env pour cacher les informations sensibles)
const DATABASE_URI = process.env.DATABASE_URI || "mongodb://127.0.0.1:27017/express-mm";

mongoose
  .connect(DATABASE_URI)
  .then(() => console.log("Connexion à MongoDB réussie"))
  .catch((err) => console.log("Erreur de connexion à MongoDB :", err));

// Middleware global pour loguer les requêtes entrantes
app.use((req, res, next) => {
  console.log(`Requête reçue : ${req.method} ${req.url}`);
  next();
});

// Configuration des middlewares
app.use(express.json()); // Middleware natif pour lire les JSON
app.use(express.urlencoded({ extended: true })); // Middleware pour les requêtes encodées (formulaires)
app.use(express.static(path.join(__dirname, "public"))); // Serveur de fichiers statiques (CSS/JS/Images)

// Configuration du moteur de template EJS (pour les vues HTML dynamiques)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // Chemin des fichiers EJS

app.get("/test", (req, res) => {
  res.status(200).json({ message: "Route test accessible." });
});

// Import des routes
const routes = require("./routes/index"); // Routes principales dans routes/index.js
const loginRoutes = require("./routes/login"); // Routes pour la connexion dans routes/login.js
const authenticateToken = require("./middleware/auth");
const protectedRoutes = require("./routes/protected");
const catwaysRoutes = require('./routes/catways');


// Utilisation des routes
app.use("/", routes); // Routage principal
app.use(loginRoutes); // Routage spécifique pour la connexion
app.use('/protected', authenticateToken, protectedRoutes);
app.use(catwaysRoutes);



// Gestion des erreurs 404 (routes non trouvées)
app.use((req, res) => {
  res.status(404).send("Page non trouvée");
});

// Lancement du serveur
const PORT = process.env.PORT || 3000; // Port configuré via .env sinon 3000 par défaut
app.listen(PORT, () => {
  console.log(`Serveur Express démarré sur http://localhost:${PORT}`);
});