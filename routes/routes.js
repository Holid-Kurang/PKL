const express = require("express");
const route = express.Router();

const homeRoutes = require("./home");
const loginRoutes = require("./login");
const pengabdianRoutes = require("./pengabdian");
const penelitianRoutes = require("./penelitian");
const publikasiRoutes = require("./publikasi");

const userRoutes = require("./users");
const testRoutes = require("./test");

// Gunakan route yang sudah dibuat
route.use("/", homeRoutes);
route.use("/", loginRoutes);
route.use("/", pengabdianRoutes);
route.use("/", penelitianRoutes);
route.use("/", publikasiRoutes);

route.use("/", userRoutes);
route.use("/", testRoutes);

module.exports = route;