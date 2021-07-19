const express = require("express");
require("dotenv").config();
const { PORT } = require("./config");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const port = PORT || 3000;
app.get("/", (req, res) => {
  res.send("Hello, world!");
});

/**
 * Error handling middleware
 * DO NOT MOVE
 */
app.use(errorHandler);

app.listen(port, () => {
  console.log("server listening on port: ", port);
});
