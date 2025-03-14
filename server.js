const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

// Connexion à MongoDB (modifiez l'URI au besoin)
const DATABASE_URI = "mongodb://127.0.0.1:27017/express-mm";

mongoose
  .connect(DATABASE_URI)
  .then(() => console.log("Connexion à MongoDB réussie"))
  .catch((err) => console.log("Erreur de connexion à MongoDB :", err));

// Middleware global pour loguer les requêtes entrantes
app.use((req, res, next) => {
  console.log(`Requête reçue : ${req.method} ${req.url}`);
  next();
});

// Pour capturer toutes les requêtes et leur méthode
app.use((req, res, next) => {
  console.log(`Requête reçue : ${req.method} ${req.url}`);
  next();
});

// Configuration des middlewares
app.use(express.json()); // Middleware natif pour lire les JSON
app.use(express.urlencoded({ extended: true })); // Middleware pour les requêtes encodées (form)
app.use(express.static(path.join(__dirname, "public"))); // Serveur de fichiers statiques (CSS/JS)

// Configuration du moteur de template EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // Chemin des fichiers EJS

const routes = require("./routes"); // Cela va automatiquement charger routes/index.js
const loginRoutes = require("./routes/login"); // Route de connexion (login.js)

app.use('/', routes);
app.use("/login", loginRoutes);

// Gestion des erreurs pour les routes inexistantes

app.use((req, res, next) => {
  console.log(`Requête non capturée : ${req.method} ${req.url}`);
  next();
});


// Lancement du serveur
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Serveur Express démarré sur http://localhost:${PORT}`);
});