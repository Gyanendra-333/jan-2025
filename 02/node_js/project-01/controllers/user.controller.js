const User = require("../models/user.model");


async function handleGetAllUser(req, res) {
    const allDbUser = await User.find({});
    return res.json(allDbUser);
}

async function handleGetUserById(req, res) {
    const id = Number(req.params.id);
    const user = users.find((user) => user.id === id);
    return res.send(user);
}

async function handleUpdateById(req, res) {
    return res.json({ status: "pending" });
}

async function handleDeleteById(req, res) {
    return res.json({ status: "pending" });
}

async function CreateNewUser(req, res) {
    const body = req.body;
    console.log("body", body)
    return res.json({ status: "pending" });
}


module.exports = { handleGetAllUser, handleGetUserById, handleUpdateById, handleDeleteById, CreateNewUser };