const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

/**
 * Error Handler Middleware Terpusat
 * Menangani semua error yang terjadi di aplikasi
 */

// Helper function untuk log error detail
const logError = (err, req) => {
    const errorDetails = {
        timestamp: new Date().toISOString(),
        url: req.originalUrl,
        method: req.method,
        ip: req.ip,
        userAgent: req.get('user-agent'),
        message: err.message,
        statusCode: err.statusCode || 500,
        stack: err.stack
    };

    logger.error('Error occurred:', errorDetails);
};

// Handle MongoDB Duplicate Key Error
const handleDuplicateKeyError = (err) => {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    const message = `Data dengan ${field} '${value}' sudah ada. Gunakan nilai yang berbeda.`;
    return new AppError(message, 400);
};

// Handle MongoDB Validation Error
const handleValidationError = (err) => {
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Data tidak valid: ${errors.join('. ')}`;
    return new AppError(message, 400);
};

// Handle MongoDB Cast Error (Invalid ID)
const handleCastError = (err) => {
    const message = `Data tidak ditemukan. ID tidak valid: ${err.value}`;
    return new AppError(message, 400);
};

// Handle JWT Errors
const handleJWTError = (req) => {
    const message = req.res.locals.translate('errors.401');
    return new AppError(message, 401);
};

const handleJWTExpiredError = (req) => {
    const message = req.res.locals.translate('errors.401');
    return new AppError(message, 401);
};

// Handle Mongoose Connection Error
const handleMongooseConnectionError = (req) => {
    const message = req.res.locals.translate('errors.503');
    return new AppError(message, 503);
};

// Send error response untuk Development
const sendErrorDev = (err, req, res) => {
    // Log error ke console
    logError(err, req);

    // API Error
    if (req.originalUrl.startsWith('/api')) {
        return res.status(err.statusCode).json({
            success: false,
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack
        });
    }

    const { languages } = require('../../config/lang');
    const currentLang = req.language || 'id';

    // Rendered Website Error
    return res.status(err.statusCode).render('404page', {
        title: `Error ${err.statusCode}`,
        message: err.message,
        error: err,
        stack: err.stack,
        isLogin: req.session?.isLogin || false,
        pageTranslations: JSON.stringify(languages[currentLang])
    });
};

// Send error response untuk Production
const sendErrorProd = (err, req, res) => {
    // Log error ke console (tanpa stack trace di production)
    console.error('ERROR:', err.message);

    const { languages } = require('../../config/lang');
    const currentLang = req.language || 'id';

    // Operational error yang diprediksi - kirim ke client
    if (err.isOperational) {
        // API Error
        if (req.originalUrl.startsWith('/api')) {
            return res.status(err.statusCode).json({
                success: false,
                status: err.status,
                message: err.message
            });
        }

        // Rendered Website Error
        return res.status(err.statusCode).render('404page', {
            title: `Error ${err.statusCode}`,
            message: err.message,
            isLogin: req.session?.isLogin || false,
            pageTranslations: JSON.stringify(languages[currentLang])
        });
    }

    // Programming error atau unexpected error - jangan bocorkan detail ke client
    // Log full error untuk debugging
    logError(err, req);

    const genericMessage = res.locals.translate('errors.500');

    // API Error
    if (req.originalUrl.startsWith('/api')) {
        return res.status(500).json({
            success: false,
            status: 'error',
            message: genericMessage
        });
    }

    // Rendered Website Error
    return res.status(500).render('404page', {
        title: 'Error 500',
        message: genericMessage,
        isLogin: req.session?.isLogin || false,
        pageTranslations: JSON.stringify(languages[currentLang])
    });
};

// Main Error Handler Middleware
const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, req, res);
    } else if (process.env.NODE_ENV === 'production') {
        let error = { ...err };
        error.message = err.message;

        // Handle specific error types
        if (err.code === 11000) error = handleDuplicateKeyError(err);
        if (err.name === 'ValidationError') error = handleValidationError(err);
        if (err.name === 'CastError') error = handleCastError(err);
        if (err.name === 'JsonWebTokenError') error = handleJWTError(req);
        if (err.name === 'TokenExpiredError') error = handleJWTExpiredError(req);
        if (err.name === 'MongooseServerSelectionError') error = handleMongooseConnectionError(req);

        // Handle specific status codes if message is generic
        if (error.statusCode === 404 && (!error.message || error.message.includes('not found') || error.message.includes('tidak ditemukan'))) {
            error.message = res.locals.translate('errors.404');
        } else if (error.statusCode === 429) {
            error.message = res.locals.translate('errors.429');
        } else if (error.statusCode === 403) {
            error.message = res.locals.translate('errors.403');
        } else if (error.statusCode === 401) {
            error.message = res.locals.translate('errors.401');
        } else if (error.statusCode === 400 && error.message === err.message) {
             // only override if it's not already a specific validation/duplicate error
             if (!['ValidationError', 'CastError'].includes(err.name) && err.code !== 11000) {
                error.message = res.locals.translate('errors.400');
             }
        }

        sendErrorProd(error, req, res);
    }
};

// Wrapper function untuk async functions - menangkap error dan pass ke next()
const catchAsync = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};

module.exports = {
    errorHandler,
    catchAsync
};
