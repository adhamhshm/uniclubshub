import fs from "fs";

export const uploadPhoto = (req, res) => {
    if (!req.file) {
        console.log("No file uploaded")
        return res.status(400).json({ error: "No file uploaded." });
    };

    // Access the currentImageFilename from the request body
    const currentImageFilename = req.body.currentImageFilename;
    // Determine the path to the existing image you want to delete
    const existingImagePath = "../client/public/upload/" + currentImageFilename;
    // Check if the existing image file exists and delete it
    if (fs.existsSync(existingImagePath)) {
        fs.unlink(existingImagePath, (err) => {
            if (err) {
                console.error("Error deleting existing image:", err);
                return res.status(400).json(err);
            } else {
                console.log("Existing image deleted.");
            }
        });
    }
    else {
        console.log("Cannot find existing image.")
    }

    const newImageFile = req.file; // The uploaded file
    console.log(req.file);
    res.status(200).json(newImageFile.filename);
};

export const deletePhoto = (req, res) => {
    // Access the currentImageFilename from the request body
    const imageToBeDeleted = req.body.imageToBeDeleted;
    // Check if there is a photo to be deleted
    if (!imageToBeDeleted || imageToBeDeleted === "") {
        console.log("No photo provided for deletion.");
        return res.status(200).json({ message: "No photo provided for deletion." });
    }
    // Determine the path to the existing image you want to delete
    const imagePath = "../client/public/upload/" + imageToBeDeleted;
    // Check if the existing image file exists and delete it
    if (fs.existsSync(imagePath)) {
        fs.unlink(imagePath, (err) => {
            if (err) {
                console.error("Error deleting image:", err);
                return res.status(400).json(err);
            } else {
                console.log("Image deleted.");
                return res.status(200).json({ message: "Image does not exist." });
            }
        });
    }
    else {
        console.log("Cannot find photo to be deleted.")
        return res.status(200).json({ message: "Cannot find photo to be deleted." });
    }
}