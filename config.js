const { PORT, DB_NAME, DB_USERNAME, DB_PASSWORD } = process.env;

const DB_CONNECTION_STRING = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@cluster0.xnwmi.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;

module.exports = {
  PORT,
  DB_NAME,
  DB_USERNAME,
  DB_PASSWORD,
  DB_CONNECTION_STRING,
};
