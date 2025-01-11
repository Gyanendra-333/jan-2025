const express = require("express");
const { handleGetAllUser, handleGetUserById, handleUpdateById, handleDeleteById, CreateNewUser } = require("../controllers/user.controller.js");

const router = express.Router();


router.get("/", handleGetAllUser);

router.get("/api/users", (req, res) => {
    return res.json(users);
})

router.route("/api/users/:id")
    .get(handleGetUserById)
    .put(handleUpdateById)
    .delete(handleDeleteById)

router.post("/api/users", CreateNewUser);

module.exports = router;