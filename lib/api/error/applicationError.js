class ApplicationError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = 'ApplicationError';
    this.statusCode = statusCode;
  }
}

module.exports = ApplicationError;
