import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const registerUser = asyncHandler(async (req, res) => {

    // receive details from frontend
    const { userName, fullName, email, password } = req.body;

    // check validation
    if ([userName, fullName, email, password].some((field) => field.trim() === "")) {
        throw new ApiError(400, "All fields are required")
    }

    // check if user is already exist
    const existedUser = User.findOne({
        $or: [{ userName }, { email }]
    })
    if (!existedUser) {
        throw new ApiError(409, "user already exist");
    }

    // recieve file path 
    const avaatrLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;
    if (!avaatrLocalPath) {
        throw new ApiError(400, "Avatar image is required");
    }

    // upload file in cloudinary 
    const avatar = await uploadOnCloudinary(avaatrLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);
    if (!avatar) {
        throw new ApiError(400, "Avatar image is required");
    }

    const user = await User.create({
        fullName,
        avatar: avatar?.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        userName
    })

    // createdUser details find by Id
    const createdUser = await User.findById(user?._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(500, "user registeration failed");
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User Registered Successfully")
    )

});


export { registerUser };