const express = require("express");
const router = express.Router();

const jupengControl = require("../../../controllers/publikasi/jupengControl");

// Halaman utama
router.get("/dashboard/publikasi/jupeng", isAuthenticated, jupengControl.getAllData);
router.post("/dashboard/publikasi/jupeng/create", isAuthenticated, jupengControl.createData);
router.post("/dashboard/publikasi/jupeng/update/:id", isAuthenticated, jupengControl.updateData);
router.post("/dashboard/publikasi/jupeng/delete/:id", isAuthenticated, jupengControl.deleteData);
router.get("/dashboard/publikasi/jupeng/export", isAuthenticated, jupengControl.exportData);


// Middleware to check if user is logged in
function isAuthenticated(req, res, next) {
    if (req.session.isLogin) {
        return next();
    }
    res.send(`<script>alert('Unauthorized: Please log in first'); window.location.href = '/login';</script>`);
}

module.exports = router;