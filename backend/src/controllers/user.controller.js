import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { User } from '../models/user.models.js';
import { ApiResponse } from '../utils/apiResponse.js';

const validateEmail = (email = '') => {
  const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/;
  return emailRegex.test(email);
};

const registerUser = asyncHandler(async (req, res) => {
    //get user detail from frontend
    const { name, email, password, role } = req.body;
    console.log(name, email, password, role);
    
    if([name, email, password, role].some(field => field?.trim() === "")){
        throw new ApiError(400, "All fields are required");
    }
    if(!validateEmail(email)){
        throw new ApiError(400, "Invalid email");
    }

    //check if user already exists
    const existingUser = await User.findOne({
        $or: [
            {email: email},
        ]
    });

    if(existingUser){
        throw new ApiError(409, "User already exists with this email");
    }

    //create user object
    const user = await User.create({
        name,
        email,
        password,
        role
    });

    //remove password and refresh token field from response

    const savedUser = await User.findById(user._id).select("-password -refreshToken");

    if(!savedUser){
        throw new ApiError(500, "Failed to create user");
    }


    return res.status(201).json(new ApiResponse(201, savedUser, "User created successfully"));

    //check for user creation

    //return response with success message and user data
});

export { registerUser };
