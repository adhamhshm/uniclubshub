import express from "express";
import multer from "multer";
import { deletePhoto, uploadPhoto} from "../controllers/images-controller.js";

const router = express.Router();

// // Configure storage for multer to define where and how to store uploaded files
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         // Specify the destination folder for uploaded files
//         // The cb function, short for "callback," is used in the multer configuration for asynchronous handling of file uploads.
//         cb(null, "../client/public/upload")
//     },
//     filename: function (req, file, cb) {
//         // Define the filename of the uploaded file
//         // Generate a random imagefile name based on current date and time
//         const now = new Date();
//         const year = now.getFullYear();
//         const month = String(now.getMonth() + 1).padStart(2, '0');
//         const day = String(now.getDate()).padStart(2, '0');
//         const hour = String(now.getHours()).padStart(2, '0');
//         const minute = String(now.getMinutes()).padStart(2, '0');
//         const second = String(now.getSeconds()).padStart(2, '0');
//         const millisecond = String(now.getMilliseconds()).padStart(3, '0');
//         const timestamp = `${year}${month}${day}_${hour}${minute}${second}${millisecond}`;
//         const filename = `IMG_${timestamp}.jpg`;
//         cb(null, filename);
//     }
// })
// // Create a multer instance with the defined storage configuration
// const upload = multer({ storage: storage })

const storage = multer.memoryStorage(); // Store the file in memory
const upload = multer({ storage: storage });

router.post("/upload", upload.single("file"), uploadPhoto);
router.delete("/delete", deletePhoto);

export default router;