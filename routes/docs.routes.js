const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerOptions = require('../docs/swaggerOptions');

const router = express.Router();
const swaggerSpecs = swaggerJsdoc(swaggerOptions);

router.use('/', swaggerUi.serve);

router.get('/', swaggerUi.setup(swaggerSpecs, { explorer: true }));

module.exports = router;
