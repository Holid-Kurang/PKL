const express = require("express");
const router = express.Router();


// Halaman profil user berdasarkan ID
router.get("/users/:id", (req, res) => {
    const users = [
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
        { id: 3, name: "Charlie" }
    ];
    const user = users.find(u => u.id == req.params.id);

    if (!user) {
        return res.status(404).send("User not found");
    }
    res.render("user", { title: `Profile ${user.name}`, user });
});

module.exports = router;
