const mongoose = require("mongoose");

async function connectDb() {
    return mongoose.connect("mongodb://127.0.0.1:27017/gyan-node-js")
}
module.exports = { connectDb };