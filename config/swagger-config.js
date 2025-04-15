const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'Documentation de mon API'
    },
    customCssUrl: '/swagger/swagger-ui.css',               
    customJs: '/swagger/swagger-ui-bundle.js',            
    customJs2: '/swagger/swagger-ui-standalone-preset.js',
    swaggerUrl: '/swagger.json', // Chemin vers le fichier JSON Swagger
  },
  apis: ['./routes/*.js'], // Analyser toutes les routes dans le dossier `routes/`
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
module.exports = swaggerDocs;