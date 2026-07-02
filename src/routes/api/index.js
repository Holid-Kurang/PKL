const express = require("express");
const router = express.Router();

const dashboard = require("./dashboard");
const language = require("./language");
const kategori = require("./kategori");
const home = require("./home");

router.use("/", dashboard);
router.use("/", language);
router.use("/", kategori);
router.use("/", home);

module.exports = router;
