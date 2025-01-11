const shortid = require("shortid");
const URL = require("../models/user.model.js");

async function handleGenerateNewShortURL(req, res) {
    const body = req.body;
    if (!body.URL) return res.status(400).json({ error: "URL is required" })
    const shortID = shortid(8);
    await URL.create({
        shortId: shortID,
        redirectURL: shortID,
        visitHistory: []
    })
    return res.json({ id: shortID });
}

module.exports = { handleGenerateNewShortURL };