const express = require("express");
const route = express.Router();

const homeRoutes = require("./homeRoute");
const loginRoutes = require("./loginRoute");
const pengabdianRoutes = require("./pengabdianRoute");
const penelitianRoutes = require("./penelitianRoute");
const publikasiRoutes = require("./publikasiRoute");
const dashboardPenelitianPNBPRoutes = require("./dashboardRoute/penelitian/pnbp");

const userRoutes = require("./users");
const testRoutes = require("./test");

// Gunakan route yang sudah dibuat
route.use("/", homeRoutes);
route.use("/", loginRoutes);
route.use("/", pengabdianRoutes);
route.use("/", penelitianRoutes);
route.use("/", publikasiRoutes);
route.use("/", dashboardPenelitianPNBPRoutes);

// User and test routes
route.use("/", userRoutes);
route.use("/", testRoutes);

module.exports = route;