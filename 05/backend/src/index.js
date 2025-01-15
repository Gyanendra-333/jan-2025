import dotenv from "dotenv"
import connectDB from "./db/index.js"
import { app } from "./app.js"

dotenv.config({
    path: "./env"
})

// Database Connection 
connectDB()
    .then(() => {
        app.listen(process.env.PORT || 3000, () => {
            console.log(`Server is Running Port : ${process.env.PORT}`)
        })
    })
    .catch((err) => {
        console.log("MongoDB Connection Error !", err);
    })