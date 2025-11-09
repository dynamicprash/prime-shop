import mongoose from "mongoose";

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
        required: true,
        minlength: 3, 
    },
    role: {
        type: String,
        enum: ['customer', 'manager'],
        default: 'customer',
        required: true,
    }
})

export const User = mongoose.model("User". userSchema);