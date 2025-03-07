const express = require("express");

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

// Middleware pour parser le corps des requêtes
app.use(bodyParser.json());

// Lancer le serveur
const PORT = 3000;


// Importer les routes principales depuis routes/index.js
const routes = require('./routes');
app.use('/', routes); // Utiliser ces routes pour le chemin "/"
app.use('/api/users', require('./routes/user'));

app.listen(PORT, () => {
  console.log(`Serveur Express démarré sur http://localhost:${PORT}`);
});