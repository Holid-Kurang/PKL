const express = require("express");
const router = express.Router();

const home = require("./home");
const login = require("./login");
const pengabdian = require("./pengabdian");
const penelitian = require("./penelitian");
const publikasi = require("./publikasi");
const prodi = require("./prodi");
const dashboard = require("./dashboard");
const kategori = require("./kategori");

router.use("/", home);
router.use("/", login);
router.use("/", pengabdian);
router.use("/", penelitian);
router.use("/", publikasi);
router.use("/", prodi);
router.use("/", dashboard);
router.use("/", kategori);

module.exports = router;
