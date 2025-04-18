const express = require("express");
const router = express.Router();

// Halaman utama
router.get("/publikasi", (req, res) => {
    const users = [
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
        { id: 3, name: "Charlie" },
        { id: 3, name: "Charlie" },
        { id: 3, name: "Charlie" },
        { id: 3, name: "Charlie" },
        { id: 3, name: "Charlie" },
        { id: 3, name: "Charlie" },
        { id: 3, name: "Charlie" },
        { id: 3, name: "Charlie" },
    ];
    const isLogin = req.session.isLogin || false;
    res.render("publikasi", { title: "Users", users, isLogin });
});

module.exports = router;