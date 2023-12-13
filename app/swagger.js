const swaggerJSDoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SolideDB API',
      version: '1.0.0',
      description: 'API documentation for the SolideDB API',
    },
  },
  // Path to the API routes
  apis: ['./app/routes/*.js'], 
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

module.exports = swaggerSpec;