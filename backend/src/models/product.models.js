import mongoose from "mongoose";

const productSchema = new mongoose.Schema({ 
    name: {
        type: String,
        required: true,
        index: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String, //user passes the url
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
},{timestamps: true})

export const Product = mongoose.model("Product", productSchema);