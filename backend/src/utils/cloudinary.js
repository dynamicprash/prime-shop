import { v2 as cloudinary } from 'cloudinary';
import e from 'express';
import fs from 'fs';


// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadCloudinary = async (localfilepath) => {
  try {
    if (!localfilepath) return;
    //upload to cloudinary
    const response = await cloudinary.uploader.upload(localfilepath, {
      resource_type: "auto",
    })
    //file uploaded successfully
    console.log("file uploaded successfully", response.url);
    return response;
  } catch (error) {
    fs.unlinkSync(localfilepath); //delete local file as upload failed
    throw new Error("Cloudinary upload failed");
  }
}

export { uploadCloudinary };