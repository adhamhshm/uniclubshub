import { db } from "../connectDB.js";
import jwt from "jsonwebtoken";
import moment from "moment";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

export const getComments = (req, res) => {
    // const q = `SELECT c.*, u.id AS userId, name, profilePhoto FROM comments AS c JOIN users AS u ON (u.id = c.userId) WHERE c.postId = ?
    //            ORDER BY c.createdAt DESC`;

    const q = `SELECT c.*, u.id AS userId, u.name AS name, u.profilePhoto AS profilePhoto FROM comments AS c JOIN users AS u ON (u.id = c.userId) WHERE c.postId = ?
               UNION ALL 
               SELECT c.*, p.id AS userId, p.name AS name, p.profilePhoto AS profilePhoto FROM comments AS c JOIN participants AS p ON (p.id = c.userId) WHERE c.postId = ?
               ORDER BY createdAt ASC`;

    db.query(q, [req.query.postId, req.query.postId], (err, data) => {
        if (err) {
            console.log("Error fetching comments: " + err.message);
            return res.status(500).json("Error fetching comments.");
        }
        else {
            return res.status(200).json(data);
        }
    });
};

export const addComment = (req, res) => {

    const token = req.cookies.accessToken;
    if (!token) {
        console.log("Unauthorized add comment: No token authenticated.")
        return res.status(401).json("No session authenticated.");
    };

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, userInfo) => {
        if (err) {
            console.log("Unauthorized add comment: Invalid or expired token.")
            return res.status(401).json("Session had expired.");
        }

        const q = "INSERT INTO comments (`description`, `userId`, `createdAt`, `postId`) VALUES (?)";

        const values = [
            req.body.description,
            userInfo.id,
            moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
            req.body.postId
        ]

        db.query(q, [values], (err, data) => {
            if (err) {
                console.log("Error adding comment: " + err.message);
                return res.status(500).json("Error adding comment.");
            }
            else {
                return res.status(200).json("Comment has been sent.");
            }
        });
    });
};