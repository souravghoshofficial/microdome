import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/*
const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    return null;
  }
};
*/

//----------------------------------------------------------
const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    // Extract original filename without extension
    const originalName = path.basename(
      localFilePath,
      path.extname(localFilePath)
    );

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      public_id: originalName, // Set the original filename as public_id
      use_filename: true, // Tell Cloudinary to use the original filename
      unique_filename: false, // Disable unique filenames
    });

    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    console.error("Error uploading to Cloudinary:", error);
    throw error;
  }
};

//----------------------------------------------------------

const deleteFromCloudinary = async (imageUrl) => {
  try {
    if (!imageUrl) return null;

    // Extract public ID from Cloudinary URL
    const urlParts = imageUrl.split("/");
    const publicIdWithExtension = urlParts.slice(-2).join("/").split(".")[0];
    const publicId = publicIdWithExtension.split("/").slice(1).join("/");

    // Delete the image
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
    throw error;
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
