// const http = require("http");
const express = require("express");

const app = express();

// const myServer = http.createServer((req, res) => {
//     console.log("req response")
//     res.end("Hello from server")
// })

app.get("/", (req, res) => {
    return res.send("Home page");
})

app.listen((4001), () => {
    console.log("Server is running")
});