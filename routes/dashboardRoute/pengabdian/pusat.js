const express = require("express");
const router = express.Router();

const pusatControl = require("../../../controllers/pengabdian/pusatControl");

// Halaman utama
router.get("/dashboard/pengabdian/pusat", isAuthenticated, pusatControl.getAllData);
router.post("/dashboard/pengabdian/pusat/create", isAuthenticated, pusatControl.createData);
router.post("/dashboard/pengabdian/pusat/update/:id", isAuthenticated, pusatControl.updateData);
router.post("/dashboard/pengabdian/pusat/delete/:id", isAuthenticated, pusatControl.deleteData);
router.get("/dashboard/pengabdian/pusat/export", isAuthenticated, pusatControl.exportData);


// Middleware to check if user is logged in
function isAuthenticated(req, res, next) {
    if (req.session.isLogin) {
        return next();
    }
    res.send(`<script>alert('Unauthorized: Please log in first'); window.location.href = '/login';</script>`);
}

module.exports = router;