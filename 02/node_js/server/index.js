const http = require("http");

const myServer = http.createServer((req, res) => {
    console.log("req response")
    res.end("Hello from server")
})

myServer.listen((4001), () => {
    console.log("Server is running")
});