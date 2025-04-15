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
  // Route pour générer dynamiquement le fichier JSON Swagger
  app.get('/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerDocs);
  });

  // Intégration de Swagger UI sans gestion manuelle des fichiers CSS/JS
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};

module.exports = swaggerMiddleware;