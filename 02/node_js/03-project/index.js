const express = require("express");
const users = require("./MOCK_DATA.json");
const userRoute = require("./routes/user.route");
const { logReqRes } = require("./middleware");

const app = express();
const PORT = 4000;


// middleware 
app.use(express.urlencoded({ extended: false }));
app.use(logReqRes("log.txt"));

// Routes 
app.use("/user", userRoute);




app.listen(PORT, () => {
    console.log(`Server is running port ${PORT}`);
})