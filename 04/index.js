const path = require("path");
const express = require("express");
const multer = require("multer");

const app = express();
const PORT = 4002;
const upload = multer({ des: "uploads/" })

app.set("view engine", "ejs")
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
    return res.render("homepage")
})

app.post("/upload", upload.single("profileImage"), (req, res) => {
    console.log(req.body);
    console.log(req.file);
    return res.redirect("/");
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})