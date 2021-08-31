const { PORT } = require('../config');
const { version } = require('../package.json');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'REST API boilerplate documentation',
      version,
      description:
        'This is a boilerplate to quickly build RESTful APIs with Express, Mongoose and documented with Swagger.',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
      },
    ],
  },
  apis: ['./routes/*.js', './docs/*.yml'],
};

module.exports = swaggerOptions;
