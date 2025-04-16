const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const path = require('path');

// Configuration des options Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'Documentation de mon API',
    },
  },
  apis: [path.join(__dirname, '../routes/*.js')], // Adaptation du chemin selon vos fichiers annotés
  url: '/swagger.json' // Utilisation directe du fichier JSON pour Swagger
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Middleware Swagger
const swaggerMiddleware = (app) => {
  // Route pour le JSON Swagger
  app.get('/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerDocs);
  });

  // Route pour Swagger UI
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};

module.exports = swaggerMiddleware;