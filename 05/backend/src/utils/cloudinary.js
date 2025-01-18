import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configuration
cloudinary.config({
    cloud_name: process.env.CLODINARY_CLOUD_NAME,
    api_key: process.env.CLODINARY_API_KEY,
    api_secret: process.env.CLODINARY_CLOUD_SECRET
});

// upload file 
const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        // upload file on cloudinary 
        const response = await cloudinary.uploader.upload(localFilePath, { resource_type: "auto" })

        // file upload successfully
        // console.log("file upload successfully on cloudinary", response.url);
        fs.unlinkSync(localFilePath);
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath); // remove temp file when file upload failed.
        return null;
    }
}

export { uploadOnCloudinary };