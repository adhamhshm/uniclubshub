import { db } from "../connectDB.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// get the user
export const getUser = (req, res) => {
    const userId = req.params.userId;
    const q = "SELECT * FROM participants WHERE id = ?";

    db.query(q, [userId], (err, data) => {
        if (err) {
            console.log("Error fetching participant: " + err.message);
            return res.status(500).json("Error fetching participant.");
        }

        if (data.length === 0) {
            return res.status(404).json("User not found.");
        }

        // should not return the password
        const { password, ...userInfo } = data[0];
        return res.json(userInfo);
    })

};

export const updateUser = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) {
        console.log("Unauthorized update user: No token authenticated.")
        return res.status(401).json("No session authenticated.");
    };

    // Regular expression for validating email format
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    // Check if the email follows the standard email format
    if (!emailRegex.test(req.body.email)) {
        return res.status(400).json("Invalid email format.");
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, userInfo) => {
        if (err) {
            console.log("Unauthorized update user: Invalid or expired token.")
            return res.status(401).json("Session had expired.");
        }

        const q = "UPDATE participants SET `name` = ?, `profilePhoto` = ?, `email` = ?, `phoneNumber` = ? WHERE id = ?"
        const values = [
            req.body.name, 
            req.body.profilePhoto, 
            req.body.email, 
            req.body.phoneNumber, 
            userInfo.id]
        db.query(q, values, (err, data) => {
            if (err) {
                console.log("Error updating user: " + err.message);
                return res.status(500).json("Error updating user.");
            }
            if (data.affectedRows > 0) {
                return res.json("Updated successfully.");
            }
            return res.status(403).json("You can only update your profile.");
        })
    });
};