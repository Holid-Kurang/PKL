const express = require("express");
const route = express.Router();

const webRoutes = require("./web");
const apiRoutes = require("./api");

// Gunakan route yang sudah dibagi
route.use("/", webRoutes);
route.use("/api", apiRoutes);

module.exports = route;