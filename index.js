const express = require('express');
require('dotenv').config();
const { PORT } = require('./config');
const { ApplicationError } = require('./lib/index');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const port = PORT || 3000;
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

/**
 * Error handling middleware
 * DO NOT MOVE
 */
app.use(errorHandler);

/**
 * 404 Error handler
 * Note: DO NOT MOVE. This should be the last route
 */
app.all('*', (req, res, next) => {
  const err = new ApplicationError(
    `can't find ${req.originalUrl} on server`,
    404,
  );
  next(err);
});

app.listen(port, () => {
  console.log('server listening on port: ', port);
});
