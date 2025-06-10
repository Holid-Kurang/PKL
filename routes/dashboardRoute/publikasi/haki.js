const express = require("express");
const router = express.Router();

const hakiControl = require("../../../controllers/publikasi/hakiControl");

// Halaman utama
router.get("/dashboard/publikasi/haki", isAuthenticated, hakiControl.getAllData);
router.post("/dashboard/publikasi/haki/create", isAuthenticated, hakiControl.createData);
router.post("/dashboard/publikasi/haki/update/:id", isAuthenticated, hakiControl.updateData);
router.post("/dashboard/publikasi/haki/delete/:id", isAuthenticated, hakiControl.deleteData);
router.get("/dashboard/publikasi/haki/export", isAuthenticated, hakiControl.exportData);


// Middleware to check if user is logged in
function isAuthenticated(req, res, next) {
    if (req.session.isLogin) {
        return next();
    }
    res.send(`<script>alert('Unauthorized: Please log in first'); window.location.href = '/login';</script>`);
}

module.exports = router;