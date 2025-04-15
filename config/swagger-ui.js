const express = require('express');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

// Configuration générale de Swagger-jsdoc
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'Documentation de mon API',
    },
  },
  apis: ['./routes/*.js'], // Adapter le chemin selon l'endroit où se trouvent vos routes
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Middleware pour Swagger
const swaggerMiddleware = (app) => {
  // Servir les fichiers statiques Swagger (CSS/JS)
  app.use('/swagger', express.static(path.join(__dirname, '../public/swagger')));

  // Route pour générer dynamiquement le JSON Swagger
  app.get('/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerDocs); // Génération dynamique des spécifications OpenAPI
  });

  // Configuration de Swagger UI
  const swaggerUiOptions = {
    customCssUrl: '/swagger/swagger-ui.css',  // Chargement de CSS personnalisé
    swaggerUrl: 'https://express-mm.vercel.app/swagger.json',             // Chemin pour télécharger le fichier JSON Swagger
  };

  // Intégration de Swagger UI à l'application
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(null, swaggerUiOptions));
};

module.exports = swaggerMiddleware;