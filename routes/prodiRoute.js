const express = require("express");
const router = express.Router();

const prodiController = require("../controllers/prodiControl");

router.get("/prodi/teknik-sipil", prodiController.getSipilStats);
router.get("/prodi/teknik-mesin", prodiController.getMesinStats);
router.get("/prodi/teknik-elektro", prodiController.getElektroStats);
router.get("/prodi/arsitektur", prodiController.getArsitekturStats);
router.get("/prodi/teknik-informatika", prodiController.getInformatikaStats);
router.get("/prodi/teknik-industri", prodiController.getIndustriStats);
router.get("/prodi/s2-teknik-sipil", prodiController.getS2SipilStats);
router.get("/prodi/s2-teknologi-informasi", prodiController.getS2TeknologiInformasiStats);

module.exports = router;