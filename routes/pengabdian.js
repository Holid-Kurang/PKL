const express = require("express");
const router = express.Router();

// Halaman utama
router.get("/pengabdian", (req, res) => {
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
    res.render("pengabdian", { title: "Users", users, isLogin });
});


router.post("/pengabdian", (req, res) => {
    console.log(req.body);
    res.send("Post request to pengabdian received");
});

module.exports = router;