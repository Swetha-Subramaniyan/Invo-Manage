/**
 * Custom error class for consistent error responses
 * @extends Error
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code
 * @property {number} statusCode - HTTP status code
 */


class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

module.exports = ErrorResponse;