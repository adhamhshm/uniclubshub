import fs from "fs";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

//get this from the cloudinary dashboard
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
});

// export const uploadPhoto = (req, res) => {

//     const token = req.cookies.accessToken;
//     if (!token) {
//         console.log("Unauthorized upload photo: No token authenticated.")
//         return res.status(401).json({ error : "Unauthorized upload photo: No token authenticated."});
//     };

//     if (!req.file) {
//         console.log("No file uploaded")
//         return res.status(400).json({ error: "No file uploaded." });
//     };
    
//     jwt.verify(token, process.env.JWT_SECRET_KEY, (err) => {
//         if (err) {
//             console.log("Unauthorized upload photo: Invalid or expired token.")
//             return res.status(403).json({error : "Unauthorized upload photo: Invalid or expired token."});
//         }

//         // Access the currentImageFilename from the request body
//         const currentImageFilename = req.body.currentImageFilename;
//         // Determine the path to the existing image you want to delete
//         const existingImagePath = "../client/public/upload/" + currentImageFilename;
//         // Check if the existing image file exists and delete it
//         if (fs.existsSync(existingImagePath)) {
//             fs.unlink(existingImagePath, (err) => {
//                 if (err) {
//                     console.error("Error deleting existing image:", err);
//                     return res.status(400).json(err);
//                 } else {
//                     console.log("Existing image deleted.");
//                 }
//             });
//         }
//         else {
//             console.log("Cannot find existing image.")
//         }

//         const newImageFile = req.file; // The uploaded file
//         console.log(req.file);
//         res.status(200).json(newImageFile.filename);

//     });
// };

// export const deletePhoto = (req, res) => {
//     const token = req.cookies.accessToken;
//     if (!token) {
//         console.log("Unauthorized upload photo: No token authenticated.")
//         return res.status(401).json({ error : "Unauthorized upload photo: No token authenticated."});
//     };
    
//     jwt.verify(token, process.env.JWT_SECRET_KEY, (err) => {
//         if (err) {
//             console.log("Unauthorized upload photo: Invalid or expired token.")
//             return res.status(403).json({error : "Unauthorized upload photo: Invalid or expired token."});
//         }

//         // Access the currentImageFilename from the request body
//         const imageToBeDeleted = req.body.imageToBeDeleted;
//         if (!imageToBeDeleted) {
//             console.log("There is no image to be deleted.");
//             return res.status(200).json({ message : "There is no image to be deleted."});
//         }
//         // Determine the path to the existing image you want to delete
//         const existingImagePath = "../client/public/upload/" + imageToBeDeleted;
//         // Check if the existing image file exists and delete it
//         if (fs.existsSync(existingImagePath)) {
//             fs.unlink(existingImagePath, (err) => {
//                 if (err) {
//                     console.error("Error deleting existing image:", err);
//                     return res.status(400).json(err);
//                 } else {
//                     console.log("Existing image deleted.");
//                 }
//             });
//         }
//         else {
//             console.log("Cannot find existing image.")
//         }
//     });
// };

export const uploadPhoto = async (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) {
        console.log("Unauthorized upload image: No token authenticated.")
        return res.status(401).json("No session authenticated.");
    };
    
    // const imagePath = req.files.file.tempFilePath;
    const imagePath = req.file.path;

    // Check image path
    if (!imagePath) {
        console.log("There's no image path.")
        return res.status(400).json("There's no image path.");
    };

    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err) => {
        if (err) {
            console.log("Unauthorized upload image: Invalid or expired token.")
            return res.status(403).json("Session had expired");
        };

        // If req.body.currentImageFilename have no image, it will be null
        const currentImageFilename = req.body.currentImageFilename || "";
        let public_id = "";
        // Check current image filename, because null have 4 characters?
        if (currentImageFilename.length > 5) {
            // Extract the filename without the extension as the public ID to delete
            const parts = currentImageFilename.split('/');
            const filenameWithExtension = parts[parts.length - 1];
            public_id = filenameWithExtension.split('.')[0]; // Remove the file extension

            // Determine the path to the existing image you want to delete in file system
            const existingImagePath = "../client/public/upload/" + currentImageFilename;
            // Check if the existing image file exists and delete it
            if (fs.existsSync(existingImagePath)) {
                fs.unlink(existingImagePath, (err) => {
                    if (err) {
                        console.log("Error deleting existing image in file system:" + err.message);
                        res.status(400).json("Error deleting existing image in file system.");
                    } else {
                        console.log("Existing image deleted in file system.");
                    }
                });
            }
            else {
                console.log("Cannot find existing image in file system.")
            }
        }
        else {
            console.log("No current image filename given.");
        }

        // Delete image in Cloudinary
        try {
            if (public_id.length > 0) {
                console.log("We are deleting " + public_id)
                await cloudinary.uploader.destroy(public_id);
            }
            else {
                console.log("No such image in Cloudinary.");
            }
        } 
        catch (err) {
            console.log("Error deleting image in Cloudinary: " + err.message);
        }

        // If there is a path
        try {
            // Configuration for image upload to Cloudinary
            const options = {
                use_filename: true,
                unique_filename: false,
                overwrite: true,
                transformation: [{ width: 400, height: 400, crop: "scale" }],
            }
        
            //upload to the server
            const uploadImageResult = await cloudinary.uploader.upload(imagePath, options);
            console.log(uploadImageResult)
            res.status(200).json(uploadImageResult.url);
        } 
        catch (err) {
            console.log("Error uploading image: " + err.message);
            res.status(400).json("Error uploading image. Please try again later.");
        }
    });
};

export const deletePhoto = async (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) {
        console.log("Unauthorized upload photo: No token authenticated.")
        return res.status(401).json("No session authenticated.");
    };
    
    const imageToBeDeletedUrl = req.body.imageToBeDeleted;
    if (!imageToBeDeletedUrl) {
        console.log("There is no image to be deleted.");
        return res.status(200).json("There is no image to be deleted.");
    };

    // Configure the name fo the file
    const parts = imageToBeDeletedUrl.split('/');
    const filenameWithExtension = parts[parts.length - 1];
    const public_id = filenameWithExtension.split('.')[0]; // Remove the file extension

    // Delete image in file system
    const existingImagePath = "../client/public/upload/" + filenameWithExtension;
    // Check if the existing image file exists and delete it
    if (fs.existsSync(existingImagePath)) {
        fs.unlink(existingImagePath, (err) => {
            if (err) {
                console.log("Error deleting existing image: " + err.message);
                return res.status(400).json("Error deleting existing image.");
            } else {
                console.log("Existing image deleted.");
            }
        });
    }
    else {
        console.log("Cannot find existing image.")
    }

    // Delete image in Cloudinary
    try {
        const result = await cloudinary.uploader.destroy(public_id);
        console.log(result);
    } 
    catch (err) {
        console.log("Error deleting image from Cloudinary: " + err.message);
        throw err;
    }
};

