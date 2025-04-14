const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'Documentation de mon API'
    }
  },
  apis: ['./routes/*.js'], // Analyser toutes les routes dans le dossier `routes/`
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
module.exports = swaggerDocs;