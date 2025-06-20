const express = require("express");
const path = require("path");
const router = express.Router();

const templateFiles = {
    1: "template_penelitian_mandiri.xlsx",
    2: "template_penelitian_pnbp.xlsx",
    3: "template_penelitian_pusat.xlsx",
    4: "template_pengabdian_pnbp.xlsx",
    5: "template_pengabdian_pusat.xlsx",
    6: "template_publikasi_buku.xlsx",
    7: "template_publikasi_haki.xlsx",
    8: "template_publikasi_jupeng.xlsx"
};

router.get("/dashboard/download/:id", isAuthenticated, (req, res) => {
    const templateId = req.params.id;
    const fileName = templateFiles[templateId];
    if (!fileName) {
        return res.status(404).send("Template not found");
    }
    const filePath = path.join(__dirname, "../../public/template", fileName);
    res.download(filePath);
});

// Middleware to check if user is logged in
function isAuthenticated(req, res, next) {
    if (req.session.isLogin) {
        return next();
    }
    res.send(`<script>alert('Unauthorized: Please log in first'); window.location.href = '/login';</script>`);
}

module.exports = router;