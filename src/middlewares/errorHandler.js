const AppError = require('../utils/AppError');

/**
 * Error Handler Middleware Terpusat
 * Menangani semua error yang terjadi di aplikasi
 */

// Helper function untuk log error detail
const logError = (err, req) => {
    console.error('═══════════════════════════════════════════════════');
    console.error('🚨 ERROR OCCURRED');
    console.error('═══════════════════════════════════════════════════');
    console.error('Timestamp:', new Date().toISOString());
    console.error('URL:', req.originalUrl);
    console.error('Method:', req.method);
    console.error('IP:', req.ip);
    console.error('User Agent:', req.get('user-agent'));
    console.error('Error Message:', err.message);
    console.error('Status Code:', err.statusCode || 500);
    console.error('Stack Trace:', err.stack);
    console.error('═══════════════════════════════════════════════════\n');
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
const handleJWTError = () => {
    return new AppError('Token tidak valid. Silakan login kembali.', 401);
};

const handleJWTExpiredError = () => {
    return new AppError('Sesi Anda telah berakhir. Silakan login kembali.', 401);
};

// Handle Mongoose Connection Error
const handleMongooseConnectionError = () => {
    return new AppError('Koneksi ke database gagal. Silakan coba lagi.', 503);
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

    // Rendered Website Error
    return res.status(err.statusCode).render('404page', {
        title: `Error ${err.statusCode}`,
        message: err.message,
        error: err,
        stack: err.stack,
        isLogin: req.session?.isLogin || false
    });
};

// Send error response untuk Production
const sendErrorProd = (err, req, res) => {
    // Log error ke console (tanpa stack trace di production)
    console.error('ERROR:', err.message);

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
            isLogin: req.session?.isLogin || false
        });
    }

    // Programming error atau unexpected error - jangan bocorkan detail ke client
    // Log full error untuk debugging
    logError(err, req);

    // API Error
    if (req.originalUrl.startsWith('/api')) {
        return res.status(500).json({
            success: false,
            status: 'error',
            message: 'Terjadi kesalahan pada server. Silakan coba lagi nanti.'
        });
    }

    // Rendered Website Error
    return res.status(500).render('404page', {
        title: 'Error 500',
        message: 'Terjadi kesalahan pada server. Silakan coba lagi nanti.',
        isLogin: req.session?.isLogin || false
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
        if (err.name === 'JsonWebTokenError') error = handleJWTError();
        if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();
        if (err.name === 'MongooseServerSelectionError') error = handleMongooseConnectionError();

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
