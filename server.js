const express = require("express");
const app = express();
const path = require("path");


// Set view engine dan folder views
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Set folder public untuk file statis
app.use(express.static(path.join(__dirname, "public")));

app.use(express.json()); // Middleware untuk parsing JSON
app.use(express.urlencoded({ extended: false })); // Middleware untuk parsing x-www-form-urlencoded

// Import routes
const homeRoutes = require("./routes/home");
const userRoutes = require("./routes/users");
const loginRoutes = require("./routes/login");
const testRoutes = require("./routes/test");

// Gunakan route yang sudah dibuat
app.use("/", homeRoutes);
app.use("/", loginRoutes);
app.use("/", userRoutes);
app.use("/", testRoutes);

// Jalankan server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server berjalan di http://localhost:${PORT}`));
