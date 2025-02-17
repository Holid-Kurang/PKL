const express = require("express");
const router = express.Router();

// Halaman utama
router.get("/test", (req, res) => {
    // testing request body
    console.log(req.body);
    res.send("Test route");
});

module.exports = router;