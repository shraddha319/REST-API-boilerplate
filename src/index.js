require('dotenv').config();

const express = require('express');
const { json } = require('body-parser');
const cors = require('cors');
const { PORT, NODE_ENV } = require('./config');
const { connectDB } = require('./lib');
const { errorHandler, notFoundHandler } = require('./middlewares');
const userRouter = require('./routes/user.routes');
const authRouter = require('./routes/auth.routes');
const docsRouter = require('./routes/docs.routes');

if (NODE_ENV !== 'test') connectDB();

const app = express();

app.get('/', (req, res) => {
  res.json({ message: 'Hello, world!' });
});

app.use(json());
app.use(cors());
app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/docs', docsRouter);

/**
 * 404 Error handler
 * Note: DO NOT MOVE. This should be the last route
 */
app.all('*', notFoundHandler);

/**
 * Error handling middleware
 * DO NOT MOVE
 */
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log('server listening on port: ', PORT);
});

module.exports = { app, server };
