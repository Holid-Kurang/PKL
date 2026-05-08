const express = require("express");
const app = express();
const path = require("path");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const routes = require("./src/routes/routes");
const rateLimit = require('express-rate-limit');
const methodOverride = require('method-override');
const connectDB = require('./config/db');
const i18n = require('./src/middlewares/i18n');
const { errorHandler } = require('./src/middlewares/errorHandler');
const { cleanupTempFiles } = require('./src/utils/excelUtils');
const logger = require('./src/utils/logger');
require('dotenv').config();

connectDB(); // Connect to MongoDB

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

// Security Headers with Helmet
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "cdn.jsdelivr.net"],
            styleSrc: ["'self'", "'unsafe-inline'", "cdn.jsdelivr.net", "fonts.googleapis.com"],
            fontSrc: ["'self'", "fonts.gstatic.com", "cdn.jsdelivr.net"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'"],
        },
    },
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    },
}));

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
    secret: process.env.SESSION_SECRET || 'fallback-secret-change-in-production',
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
            secret: process.env.SESSION_SECRET || 'fallback-secret-change-in-production'
        }
    });
    logger.info('Session store: MongoDB');
} else {
    logger.warn('Session store: Memory (not recommended for production)');
}

app.use(session(sessionConfig)); // Middleware untuk session

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

// 404 Handler - harus setelah semua routes
app.use(async (req, res, next) => {
    logger.warn(`404 Not Found: ${req.method} ${req.originalUrl} - IP: ${req.ip}`);
    // Mengatur status 404 dan merender halaman 404 kustom
    res.status(404).render('404page', {
        title: "404 Not Found",
        message: "Halaman yang Anda cari tidak ditemukan",
        url: req.originalUrl, // Mengirim URL yang coba diakses ke view
        isLogin: req.session.isLogin || false, // Mengirim status login ke view
    });
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
