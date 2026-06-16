const express = require("express");
const app = express();
const path = require("path");
const session = require("express-session");
const { default: MongoStore } = require('connect-mongo');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const csrf = require('csurf');
const routes = require("./src/routes/routes");
const rateLimit = require('express-rate-limit');
const methodOverride = require('method-override');
const connectDB = require('./config/db');
const i18n = require('./src/middlewares/i18n');
const { errorHandler } = require('./src/middlewares/errorHandler');
const { cleanupTempFiles } = require('./src/utils/excelUtils');
const logger = require('./src/utils/logger');
require('dotenv').config();

// Validate required environment variables in production
if (process.env.NODE_ENV === 'production') {
    if (!process.env.SESSION_SECRET) {
        console.error('ERROR: SESSION_SECRET must be set in production environment');
        process.exit(1);
    }
    if (!process.env.MONGODB_URI) {
        console.error('ERROR: MONGODB_URI must be set in production environment');
        process.exit(1);
    }
}

connectDB(); // Connect to MongoDB

// Nonce middleware for CSP (must be before any other middleware)
const crypto = require('crypto');
app.use((req, res, next) => {
    res.locals.nonce = crypto.randomBytes(16).toString('hex');
    next();
});

// HTTP Request Logging
if (process.env.NODE_ENV === 'production') {
    // Production: log to file
    app.use(morgan('combined', {
        stream: {
            write: (message) => logger.info(message.trim())
        }
    }));
} else {
    // Development: log to console
    app.use(morgan('dev'));
}

// Security Headers with Helmet + Dynamic CSP with Nonce
app.use((req, res, next) => {
    const nonce = res.locals.nonce;

    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", `'nonce-${nonce}'`],
                styleSrc: ["'self'", "fonts.googleapis.com"],
                fontSrc: ["'self'", "fonts.gstatic.com"],
                imgSrc: ["'self'", "data:", "https:"],
                connectSrc: ["'self'"],
                frameAncestors: ["'none'"],
                objectSrc: ["'none'"],
                baseUri: ["'self'"],
                formAction: ["'self'"]
            },
        },
        hsts: {
            maxAge: 31536000,
            includeSubDomains: true,
            preload: true
        },
    })(req, res, next);
});

// Cleanup temp files setiap 1 jam
setInterval(() => {
    cleanupTempFiles();
    logger.info('Temporary files cleaned up');
}, 60 * 60 * 1000); // 1 hour

// Cleanup on startup
cleanupTempFiles();
logger.info('Application starting...');

// Rate limiting configuration
const generalLimiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 menit
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 5000,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
        res.status(429).json({
            error: 'Too many requests, please try again later.'
        });
    }
});

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 menit
    max: parseInt(process.env.RATE_LIMIT_LOGIN_MAX) || 5,
    skipSuccessfulRequests: true,
    handler: (req, res) => {
        logger.warn(`Login rate limit exceeded for IP: ${req.ip}`);
        res.status(429).json({
            error: 'Too many login attempts, please try again after 15 minutes.'
        });
    }
});

// Set view engine dan folder views
app.use('/libs', express.static(path.join(__dirname, 'node_modules')));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src", "views"));
app.use(express.static(path.join(__dirname, "public"))); // Set folder public untuk file statis
app.use(express.json()); // Middleware untuk parsing JSON
app.use(express.urlencoded({ extended: false })); // Middleware untuk parsing x-www-form-urlencoded
app.use(cookieParser()); // Middleware untuk parsing cookies
app.use(methodOverride('_method'));

// Sanitize data manually to avoid express-mongo-sanitize issues with readonly properties
const sanitizeData = (data) => {
    if (!data) return data;
    const stringData = JSON.stringify(data);
    return JSON.parse(stringData.replace(/\$/g, '_').replace(/\\./g, '_'));
};

app.use((req, res, next) => {
    req.body = sanitizeData(req.body);
    req.params = sanitizeData(req.params);
    next();
});

app.use(generalLimiter);

// Session configuration with MongoDB store
const sessionConfig = {
    secret: process.env.SESSION_SECRET || (process.env.NODE_ENV !== 'production' ? 'dev-fallback-secret-only' : undefined),
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 5 * 60 * 1000,  // Session expires in 5 minutes
        httpOnly: true, // Mencegah akses cookie dari JavaScript sisi klien
        sameSite: 'lax' // Melindungi dari serangan CSRF
    },
};

// Add MongoDB session store if MONGODB_URI is provided
if (process.env.MONGODB_URI) {
    sessionConfig.store = MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        touchAfter: 24 * 3600, // lazy session update
        crypto: {
            secret: process.env.SESSION_SECRET || (process.env.NODE_ENV !== 'production' ? 'dev-fallback-secret-only' : undefined)
        }
    });
    logger.info('Session store: MongoDB');
} else {
    logger.warn('Session store: Memory (not recommended for production)');
}

app.use(session(sessionConfig)); // Middleware untuk session

// CSRF Protection Middleware
const csrfProtection = csrf({ cookie: false });
app.use(csrfProtection);

// Middleware untuk pass CSRF token ke semua views
app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
});

// Middleware internationalization
app.use(i18n);

// Health check endpoint
app.get('/health', (req, res) => {
    const healthcheck = {
        uptime: process.uptime(),
        message: 'OK',
        timestamp: Date.now(),
        environment: process.env.NODE_ENV || 'development',
        database: 'connected' // You can add actual DB check here
    };

    try {
        res.status(200).json(healthcheck);
    } catch (error) {
        logger.error('Health check failed:', error);
        healthcheck.message = error;
        res.status(503).send(healthcheck);
    }
});

// Apply login rate limiter to login routes
app.use('/login', loginLimiter);

// Routes
app.use("/", routes); // Gunakan routes yang sudah dibuat

app.use((req, res, next) => {
    const err = new Error('Oops! Halaman yang Anda cari tidak ditemukan.');
    err.statusCode = 404;
    err.status = 'fail';
    err.isOperational = true; // Supaya lolos pengecekan di production mode
    next(err);
});

// Global Error Handler - harus terakhir
app.use(errorHandler);

// Jalankan server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    logger.info(`Server berjalan di http://localhost:${PORT}`);
    logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
