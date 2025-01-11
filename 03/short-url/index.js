const express = require("express");
const urlRoute = require("./routes/url.route.js");
const { connectDB } = require("./db.js");

const app = express();
const PORT = 4001;

// Database 
connectDB("mongodb+srv://frontend4682:blog123@cluster0.ee9cg.mongodb.net/")
    .then(console.log("Database Connected Successfully "))

// middleware 
app.use(express.json());

// Route 
app.use("/url", urlRoute);

app.listen(PORT, () => {
    console.log(`Server is running port : ${PORT}`);
})