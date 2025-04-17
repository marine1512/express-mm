const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const path = require('path');
const swaggerUiAssetPath = require('swagger-ui-dist').absolutePath();
const express = require('express');

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
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Middleware Swagger
const swaggerMiddleware = (app) => {
  // Publiez les assets Swagger statiques
  app.use('/api-docs-static', express.static(swaggerUiAssetPath));

  // Configurez Swagger UI avec les fichiers statiques spécifiques
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs, {
      customCssUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.14.0/swagger-ui.css',
      customJsUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.14.0/swagger-ui-bundle.js',
      customJs2Url:
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.14.0/swagger-ui-standalone-preset.js',
  }));
};

module.exports = swaggerMiddleware;
