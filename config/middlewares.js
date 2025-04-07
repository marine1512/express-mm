const express = require('express'); // Importer Express
const path = require('path'); // Pour gérer les fichiers statiques
const swaggerUi = require('swagger-ui-express'); // Intégration Swagger (Documentation);

// Exemple de fonction pour configurer les middlewares
const configureMiddlewares = (app, swaggerDocs) => {
  // Middleware Swagger : pour afficher la documentation interactif des API
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

  // Middleware global pour loguer les requêtes entrantes
  app.use((req, res, next) => {
    console.log(`[Global Middleware] Requête reçue : ${req.method} ${req.url}`);
    next(); // Passer à l'étape suivante
  });

  // Parser les requêtes entrantes en JSON
  app.use(express.json());

  // Pour interpréter les requêtes encodées (dans des formulaires par exemple)
  app.use(express.urlencoded({ extended: true }));

  // Pour servir des fichiers statiques (CSS, JS, images, etc.)
  app.use(express.static(path.join(__dirname, '../public')));

  const bodyParser = require("express");

};

module.exports = configureMiddlewares;