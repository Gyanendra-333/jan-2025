import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";


// handle tokens
const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken;
        const refreshToken = user.generateRefreshToken;
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };

    } catch (error) {
        console.log(error);
        throw new ApiError(500, "something went wrong while generate access and generate token")
    }
}

// Register User 
const registerUser = asyncHandler(async (req, res) => {

    // receive details from frontend
    const { userName, fullName, email, password } = req.body;

    // check validation
    if ([userName, fullName, email, password].some((field) => field.trim() === "")) {
        throw new ApiError(400, "All fields are required")
    }

    // check if user is already exist
    const existedUser = await User.findOne({
        $or: [{ userName }, { email }]
    })
    if (existedUser) {
        throw new ApiError(409, "user already exist");
    }

    // recieve file path 
    const avaatrLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path;
    }

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

// Login User 
const loginUser = asyncHandler(async (req, res) => {

    // recieve data from frontend
    const { userName, email, password } = req.body;

    // if username or email does not exist
    if (!userName && !email) {
        throw new ApiError(400, "user or email is required");
    }

    // find user
    const user = await User.findOne({
        $or: [{ userName }, { email }]
    })

    // if user does not exist
    if (!user) {
        throw new ApiError(404, "user does not exist");
    }

    // check password
    const isPasswordValid = await user.isPasswordCorrect(password)
    if (!isPasswordValid) {
        throw new ApiError(401, "password is incorrect")
    }

    // generate Access And Refresh Token
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

    const loggedinUser = await User.findById(user._id).select("-password -refreshToken")

    // send cookies 
    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiError(200, { user: loggedinUser, accessToken, refreshToken }, "user login successfully"));
});

// Logout User 
const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, {
        $set: { refreshToken: undefined }
    },
        {
            new: true
        }
    )
    const options = {
        httpOnly: true,
        secure: true
    }
    return res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "user logged out successfully"))


});

// handle cookies
const refreshAccessToken = asyncHandler(async (req, res) => {
    const incommingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!incommingRefreshToken) {
        throw new ApiError(401, "unAuthorized")
    }

    try {
        const decodeToken = jwt.verify(incommingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
        const user = await User.findById(decodeToken?._id);
        if (!user) {
            throw new ApiError(401, "unAuthorized Refresh token")
        }

        if (incommingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "refresh token is expired");
        }

        const options = {
            httpOnly: true,
            secure: true
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user?._id);

        return res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(new ApiResponse(200, { accessToken, refreshToken }, "access token refreshed"))

    } catch (error) {
        throw new ApiError(401, "Invalid refresh token")
    }
});

// Change Password 
const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user?._id);

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
    if (!isPasswordCorrect) {
        throw new ApiError(401, "Invalid password");
    }
    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res.status(200).json(new ApiResponse(200, {}, "password change successfully"));

});

// Get Current user 
const getCurrentUser = asyncHandler(async (req, res) => {
    return res.status(200).json(new ApiResponse(200, req.user, "user fetched successfully"))
});

// update account details 
const updateAccountDetails = asyncHandler(async (req, res) => {
    const { email, fullName } = req.body;
    if (!fullName || !email) {
        throw new ApiError(400, "all fields is required");
    }

    const user = await User.findByIdAndUpdate(req.user?._id,
        {
            $set: { fullName, email: email }
        },
        {
            new: true
        }).select("-password")

    return res.status(200).json(new ApiResponse(200, user, "account details update successfully"));
});

// update avatar 
const updateUserAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path;
    if (!avatarLocalPath) {
        throw new ApiError(400, "avatar file is missing");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    if (!avatar.url) {
        throw new ApiError(400, "error while uploading avatar")
    }

    const user = await User.findByIdAndUpdate(req.user?._id,
        {
            $set: {
                avatar: avatar.url
            }

        },
        {
            new: true
        }
    ).select("-password")

    return res.status(200).json(200, user, "avatar Image update successfully")
});

// update cover 
const updateUserCover = asyncHandler(async (req, res) => {
    const coverLocalPath = req.file?.path;
    if (!coverLocalPath) {
        throw new ApiError(400, "cover file is missing");
    }

    const coverImage = await uploadOnCloudinary(coverLocalPath);
    if (!coverImage.url) {
        throw new ApiError(400, "error while uploading avatar")
    }

    const user = await User.findByIdAndUpdate(req.user?._id,
        {
            $set: {
                coverImage: coverImage.url
            }

        },
        {
            new: true
        }
    ).select("-password")

    return res.status(200).json(200, user, "coverImage update successfully")
});


export { registerUser, loginUser, logoutUser, refreshAccessToken, changeCurrentPassword, getCurrentUser, updateAccountDetails, updateUserAvatar, updateUserCover };