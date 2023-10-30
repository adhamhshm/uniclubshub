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
            console.log("Error fetching user: " + err.message);
            return res.status(500).json(err);
        }

        if (data.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        // should not return the password
        const { password, ...userInfo } = data[0];
        return res.json(userInfo);
    })

};

export const updateUser = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) {
        return res.status(401).json("Not Signed In.");
    };

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, userInfo) => {
        if (err) {
            return res.status(403).json("Token is not valid.");
        };

        const q = "UPDATE participants SET `name` = ?, `profilePhoto` = ? WHERE id = ?"
        db.query(q, [req.body.name, req.body.profilePhoto, userInfo.id], (err, data) => {
            if (err) {
                console.log("Error updating user: " + err.message);
                return res.status(500).json(err);
            }
            if (data.affectedRows > 0) {
                return res.json("Updated successfully.");
            }
            return res.status(403).json("You can only update your profile.");
        })
    });
};