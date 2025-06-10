const express = require("express");
const router = express.Router();

const pnbpControl = require("../../../controllers/pengabdian/pnbpControl");

// Halaman utama
router.get("/dashboard/pengabdian/pnbp", isAuthenticated, pnbpControl.getAllData);
router.post("/dashboard/pengabdian/pnbp/create", isAuthenticated, pnbpControl.createData);
router.post("/dashboard/pengabdian/pnbp/update/:id", isAuthenticated, pnbpControl.updateData);
router.post("/dashboard/pengabdian/pnbp/delete/:id", isAuthenticated, pnbpControl.deleteData);
router.get("/dashboard/pengabdian/pnbp/export", isAuthenticated, pnbpControl.exportData);


// Middleware to check if user is logged in
function isAuthenticated(req, res, next) {
    if (req.session.isLogin) {
        return next();
    }
    res.send(`<script>alert('Unauthorized: Please log in first'); window.location.href = '/login';</script>`);
}

module.exports = router;