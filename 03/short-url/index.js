const express = require("express");

const app = express();
const PORT = 4001;

app.listen(PORT, () => {
    console.log(`Server is running port : ${PORT}`);
})