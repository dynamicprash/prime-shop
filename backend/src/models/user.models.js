import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema =  new mongoose.Schema({
    name: {
        type: String,
        required: true, 
        trim: true,  
        },
    email: {
        type: String,
        required: true,
        unique: true, 
        lowercase: true,
    },
    password: {
        type: String,
        required: [true,"Password is required"],
        minlength: 3, 
        select: false,
    },
    role: {
        type: String,
        enum: ['customer', 'manager'],
        default: 'customer',
        required: true,
    },
    refreshToken: {
        type: String,
        select: false,
    },
})

//TODO:later to make code more professional
//encrypt password before saving data
userSchema.pre("save", async function (next) {
    if(!this.isModified("password")){
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

userSchema.methods.isPasswordCorrect = async function (password) {
   return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            name: this.name,
            email: this.email,
            role: this.role,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}
// export const User = mongoose.model("User". userSchema);
export const User = mongoose.model("User", userSchema);