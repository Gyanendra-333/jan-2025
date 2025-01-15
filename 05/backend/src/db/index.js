import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
        console.log("MongoDB Connected Successfully");

    } catch (error) {
        console.log("mongoDB Connection error", error);
        process.exit(1);
    }
}
export default connectDB;