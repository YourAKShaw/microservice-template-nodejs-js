/**
 * Represents an API response.
 * @typedef {Object} ApiResponse
 */
class ApiResponse {
  statusCode;
  success;
  message;
  data;
  errors;

  /**
   * @constructor
   * @param {number} statusCode
   * @param {boolean} success
   * @param {string} message
   * @param {any} data
   * @param {any[]} errors
   */
  constructor({ statusCode, success, message, data, errors }) {
    this.statusCode = statusCode || 500;
    this.success = success || false;
    this.message = message || '';
    this.data = data || null;
    this.errors = errors || [];
  }
}

export default ApiResponse;
