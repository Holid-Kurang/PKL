const express = require("express");
const route = express.Router();

const homeRoutes = require("./homeRoute");
const loginRoutes = require("./loginRoute");
const pengabdianRoutes = require("./pengabdianRoute");
const penelitianRoutes = require("./penelitianRoute");
const publikasiRoutes = require("./publikasiRoute");
const languageRoute = require('./languageRoute');

// dashboard for prodi
const prodiRoutes = require("./prodiRoute");
// dashboard routes
const dashboardAPIRoutes = require("./dashboardAPIRoute");
const dashboardViewRoutes = require("./dashboardViewRoute");
const kategoriRoutes = require("./kategoriRoute");

// Gunakan route yang sudah dibuat
route.use("/", homeRoutes);
route.use("/", loginRoutes);
route.use("/", pengabdianRoutes);
route.use("/", penelitianRoutes);
route.use("/", publikasiRoutes);
route.use("/", prodiRoutes);
route.use("/", dashboardViewRoutes);
route.use("/", kategoriRoutes);

// API routes
route.use("/api", dashboardAPIRoutes);
route.use('/api', languageRoute);

module.exports = route;