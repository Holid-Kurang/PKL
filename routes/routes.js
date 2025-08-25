const express = require("express");
const route = express.Router();

const homeRoutes = require("./homeRoute");
const loginRoutes = require("./loginRoute");
const pengabdianRoutes = require("./pengabdianRoute");
const penelitianRoutes = require("./penelitianRoute");
const publikasiRoutes = require("./publikasiRoute");

// Unified dashboard routes - mengganti semua individual dashboard routes
const dashboardUnifiedRoutes = require("./dashboardUnified");

// dashboard for prodi
const prodiRoutes = require("./prodiRoute");
// dashboard for pengaturan
const pengaturanRoutes = require("./dashboardRoute/pengaturanRoute");


// Gunakan route yang sudah dibuat
route.use("/", homeRoutes);
route.use("/", loginRoutes);
route.use("/", pengabdianRoutes);
route.use("/", penelitianRoutes);
route.use("/", publikasiRoutes);

// Gunakan unified dashboard routes
route.use("/", dashboardUnifiedRoutes);
route.use("/", prodiRoutes);
route.use("/", pengaturanRoutes);

module.exports = route;