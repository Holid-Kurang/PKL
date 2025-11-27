/**
 * Custom Error Class untuk aplikasi
 * Extends dari Error class bawaan JavaScript
 */
class AppError extends Error {
    constructor(message, statusCode, isOperational = true) {
        super(message);

        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = isOperational;

        // Capture stack trace
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;
