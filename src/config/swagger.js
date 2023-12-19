const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0', // Specify the OpenAPI version (3.0.0 is the latest as of now)
    info: {
      title: 'Your API', // Title of your API
      version: '1.0.0', // Version of your API
      description: 'API documentation for your Express app',
    },
  },
  apis: ['./routes/*.js'], // Path to the API routes
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
