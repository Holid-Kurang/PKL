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
const dashboardRoutes = require("./dashboardRoute");
const kategoriRoutes = require("./kategoriRoute");

// Gunakan route yang sudah dibuat
route.use('/api', languageRoute);
route.use("/", homeRoutes);
route.use("/", loginRoutes);
route.use("/", pengabdianRoutes);
route.use("/", penelitianRoutes);
route.use("/", publikasiRoutes);
route.use("/", prodiRoutes);
route.use("/", dashboardRoutes);
route.use("/", kategoriRoutes);

module.exports = route;