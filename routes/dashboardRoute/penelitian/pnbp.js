const express = require("express");
const router = express.Router();
const pnbpControl = require("../../../controllers/penelitian/pnbpControl");

// Halaman utama
router.get("/dashboard/penelitian/pnbp", isAuthenticated, pnbpControl.getAllData);
router.post("/dashboard/penelitian/pnbp/create", isAuthenticated, pnbpControl.createData);
router.post("/dashboard/penelitian/pnbp/update/:id", isAuthenticated, pnbpControl.updateData);
router.post("/dashboard/penelitian/pnbp/delete/:id", isAuthenticated, pnbpControl.deleteData);
// Middleware to check if user is logged in
function isAuthenticated(req, res, next) {
    if (req.session.isLogin) {
        return next();
    }
    res.send(`<script>alert('Unauthorized: Please log in first'); window.location.href = '/login';</script>`);
}

module.exports = router;