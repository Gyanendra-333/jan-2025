const express = require("express");

const router = express.Router();


router.get("/users", (req, res) => {
    const html = `<ul>
   ${users.map((user) => `<li>${user?.first_name}</li>`).join("")}
   </ul>`;
    res.send(html);
})

router.get("/api/users", (req, res) => {
    return res.json(users);
})

router.route("/api/users/:id")
    .get((req, res) => {
        const id = Number(req.params.id);
        const user = users.find((user) => user.id === id);
        return res.send(user);
    })
    .put((req, res) => {
        return res.json({ status: "pending" });
    })
    .delete((req, res) => {
        return res.json({ status: "pending" });
    })


router.post("/api/users", (req, res) => {
    const body = req.body;
    console.log("body", body)
    return res.json({ status: "pending" });
});

module.exports = router;