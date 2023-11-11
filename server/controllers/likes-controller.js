import { db } from "../connectDB.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

export const getLikes = (req, res) => {
    const q = "SELECT participantId FROM likes WHERE postId = ?";

    db.query(q, [req.query.postId], (err, data) => {
        if (err) {
            console.error("Error retrieving likes: " + err.message);
            return res.status(500).json("Error retrieving likes.");
        }
        else {
            return res.status(200).json(data.map(like => like.participantId));
        }
    });
};

export const addLike = (req, res) => {

    const token = req.cookies.accessToken;
    if (!token) {
        console.log("Unauthorized add like: No token authenticated.")
        return res.status(401).json("No session authenticated.");
    };

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, userInfo) => {
        if (err) {
            console.log("Unauthorized add like: Invalid or expired token.")
            return res.status(401).json("Session had expired.");
        };

        const q = "INSERT INTO likes (`participantId`, `postId`) VALUES (?)";

        const values = [
            userInfo.id,
            req.body.postId
        ]

        db.query(q, [values], (err, data) => {
            if (err) {
                console.log("Error adding likes: " + err.message);
                return res.status(500).json("Error adding likes.");
            }
            else {
                return res.status(200).json("Liked post successful.");
            }
        });
    });
};

export const deleteLike = (req, res) => {

    const token = req.cookies.accessToken;
    if (!token) {
        console.log("Unauthorized delete like: No token authenticated.")
        return res.status(401).json("No session authenticated.");
    };

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, userInfo) => {
        if (err) {
            console.log("Unauthorized delete like: Invalid or expired token.")
            return res.status(401).json("Session had expired.");
        };

        const q = "DELETE FROM likes where `participantId` = ? AND `postId` = ?";

        db.query(q, [userInfo.id, req.query.postId], (err, data) => {
            if (err) {
                console.log("Error deleting likes: " + err.message);
                return res.status(500).json("Error deleting likes.");
            }
            else {
                return res.status(200).json("Unliked post successful.");
            }
        });
    });
};