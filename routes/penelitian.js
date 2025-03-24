const express = require("express");
const router = express.Router();

// Halaman utama
router.get("/penelitian", (req, res) => {
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
    res.render("penelitian", { title: "Users", users });
});

module.exports = router;