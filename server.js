const express = require("express");
const app = express();
const path = require("path");
const session = require("express-session");
const routes = require("./routes/routes");
const rateLimit = require('express-rate-limit');
const methodOverride = require('method-override');
const mongoSanitize = require('express-mongo-sanitize');
const connectDB = require('./config/db');
require('dotenv').config();

connectDB(); // Connect to MongoDB

// Set view engine dan folder views
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public"))); // Set folder public untuk file statis
app.use(express.json()); // Middleware untuk parsing JSON
app.use(express.urlencoded({ extended: false })); // Middleware untuk parsing x-www-form-urlencoded
app.use(methodOverride('_method'));
app.use(mongoSanitize());
app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15 menit
    max: 100, // Batasi setiap IP hingga 100 permintaan per 15 menit
    standardHeaders: true,
    legacyHeaders: false,
}));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: process.env.NODE_ENV === 'production',
        maxAge: 5 * 60 * 1000,  // Session expires in 5 minutes
        httpOnly: true, // 4. Mencegah akses cookie dari JavaScript sisi klien
        sameSite: 'lax' // 5. Melindungi dari serangan CSRF
    }, 
})); // Middleware untuk session
app.use("/", routes); // Gunakan routes yang sudah dibuat
app.use((req, res, next) => {
    // Mengatur status 404 dan merender halaman 404 kustom
    res.status(404).render('404page', { 
        title: 'Halaman Tidak Ditemukan',
        url: req.originalUrl, // Mengirim URL yang coba diakses ke view
        isLogin: req.session.isLogin || false // Mengirim status login ke view
    });
});
// Jalankan server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server berjalan di http://localhost:${PORT}`));
