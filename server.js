const express = require("express");
const app = express();
const path = require("path");
const session = require("express-session");
const routes = require("./routes/routes"); // Import routes

// Set view engine dan folder views
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public"))); // Set folder public untuk file statis
app.use(express.json()); // Middleware untuk parsing JSON
app.use(express.urlencoded({ extended: false })); // Middleware untuk parsing x-www-form-urlencoded
app.use(session({
    secret: "masalah-lu-apasih-sundel?-salah-semua-yang-lu-lakuin",
    resave: false,
    saveUninitialized: true,
    cookie: { 
        secure: false, 
        // maxAge: 5 * 60 * 1000  // Session expires in 5 minutes
    }, 
})); // Middleware untuk session
app.use("/", routes); // Gunakan routes yang sudah dibuat

// Jalankan server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server berjalan di http://localhost:${PORT}`));
