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
    tags: [
        {
          name: 'Reservations',
          description: 'Gestion des réservations',
        },
      ],
    apis: ['./routes/*.js'], // Chemin où Swagger analyse vos routes
  };
  
  const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = swaggerDocs;