const express = require("express");

const bcrypt = require("bcryptjs"); // Pour hacher (et comparer) les mots de passe
const jwt = require("jsonwebtoken"); // Pour les tokens auth

const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

app.use(express.json()); // Permet de lire les données JSON envoyées dans les requêtes

const path = require('path');
app.use(bodyParser.json()); // Middleware pour parser les requêtes JSON

app.use(express.static(path.join(__dirname, 'public'))); // Localiser fichier CSS

app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
 // Localiser pages EJS (Html)

const SECRET_KEY = "notre_clé_secrète"; // Clé magique pour faire les badges (JWT)

// Simulation d'une base de données en mémoire
const users = [];

// Connexion à MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/expressAppDB") // Remplacez par votre URL MongoDB si vous utilisez un service cloud comme MongoDB Atlas
  .then(() => console.log("Connecté à la base MongoDB"))
  .catch((err) => console.error("Erreur lors de la connexion :", err));

// Schéma et modèle MongoDB
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Hashed password
});
const User = mongoose.model("User", userSchema);
module.exports = User;

app.get('/', (req, res) => {
    res.render('index');
});

// Route pour afficher tous les utilisateurs
app.get('/users', async (req, res) => {
  try {
    // Récupérer tous les utilisateurs de la base de données
    const users = await User.find(); // Equivalent à SELECT * FROM users

    // Renvoyer les utilisateurs au client
    res.render('users', { users }); // Afficher la vue users.ejs en passant les utilisateurs
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs :', error);
    res.status(500).send('Erreur serveur');
  }
});

app.get("/register", (req, res) => {
  res.render("register"); // Afficher register.ejs
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  // Vérifier si le username existe déjà
  const userExists = users.find((user) => user.username === username);
  if (userExists) {
    return res.status(400).send("Cet utilisateur existe déjà !");
  }

  // Hacher le mot de passe avant de le stocker
  const hashedPassword = await bcrypt.hash(password, 10);

  // Ajouter le nouvel utilisateur
  users.push({ username, password: hashedPassword });

  res.status(201).send("Utilisateur inscrit avec succès !");
});

app.get("/login", (req, res) => {
  res.render("login"); // Afficher login.ejs
});

app.post("/login", async (req, res) => {
  console.log("Requête reçue avec le body :", req.body); // Vérifier ce qui a été envoyé
  const { username, password } = req.body;

  // Chercher l'utilisateur dans notre "base de données"
  const user = users.find((user) => user.username === username);
  if (!user) {
    return res.status(404).send("Utilisateur non trouvé !");
  }

  // Vérifier si le mot de passe est valide
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(403).send("Mot de passe incorrect !");
  }

  // Créer un token pour l'utilisateur
  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });

  res.json({ message: "Connexion réussie !", token });
});

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).send("Accès refusé : aucun token fourni !");
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).send("Accès refusé : token invalide !");
    }
    req.user = user; // Ajoute l'utilisateur au reste de la requête
    next();
  });
};

app.get("/protected", authenticateToken, (req, res) => {
  res.send(`Bienvenue dans la zone protégée, ${req.user.username} !`);
});



// Lancer le serveur
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Serveur Express démarré sur http://localhost:${PORT}`);
});