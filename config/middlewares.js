const express = require('express'); // Importer Express
const path = require('path'); // Pour gérer les chemins de fichiers
const swaggerUi = require('swagger-ui-express'); // Swagger : Documentation API

// Fonction pour configurer les middlewares
const configureMiddlewares = (app, swaggerDocs) => {
  // Middleware pour ignorer l'authentification en mode test
  if (process.env.NODE_ENV === 'test') {
    console.log('Mode test : Ignorer les authentifications.');
  }

  // Intégration de Swagger : affichage interactif de la documentation API
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

  // Middleware global : Logger les requêtes entrantes
  app.use((req, res, next) => {
    console.log(`[Global Middleware] Requête reçue : ${req.method} ${req.url}`);
    next(); // Passe au middleware suivant ou à la route
  });

  // Parser les requêtes JSON
  app.use(express.json());

  // Parser les requêtes encodées (comme les formulaires)
  app.use(express.urlencoded({ extended: true }));

    // Serveur de fichiers statiques (CSS, JS, images, etc.)
    app.use(express.static(path.join(__dirname, '../public')));
};

module.exports = configureMiddlewares;