const express = require("express");
const app = express();
const path = require("path");
const session = require("express-session");
const routes = require("./routes/routes"); // Import routes
const connectDB = require('./config/db');

connectDB(); // Connect to MongoDB

// Set view engine dan folder views
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public"))); // Set folder public untuk file statis
app.use(express.json()); // Middleware untuk parsing JSON
app.use(express.urlencoded({ extended: false })); // Middleware untuk parsing x-www-form-urlencoded
app.use(session({
    secret: "masalin",
    resave: false,
    saveUninitialized: true,
    cookie: { 
        secure: false, 
        // maxAge: 5 * 60 * 1000  // Session expires in 5 minutes
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
