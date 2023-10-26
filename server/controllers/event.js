import { db } from "../connectDB.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

export const registerEventPost = (req, res) => {
    console.log("Registering...")
    const token = req.cookies.accessToken;
    if (!token) {
        return res.status(401).json("Not Signed In.");
    };

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err) => {
        if (err) {
            console.error("JWT verification error:", err);
            return res.status(403).json("Token is not valid.");
        };

        const q = "INSERT INTO events (`postId`, `participantId`) VALUES (?)";

        const values = [
            req.body.postId,
            req.body.participantId
        ]

        db.query(q, [values], (err, data) => {
            if (err) {
                return console.log("Error inserting registration confirmation: " + err.message + res.status(500).json(err));
            }
            else {
                return res.status(200).json("Registration successful.");
            }
        })
    })
};

export const getIsRegistered = (req, res) => {
    const q = "SELECT participantId FROM events WHERE postId = ?";

    db.query(q, [req.query.postId], (err, data) => {
        if (err) {
            console.error("Error retrieving likes: " + err.message);
            return res.status(500).json(err);
        }
        else {
            return res.status(200).json(data.map(like => like.participantId));
        }
    });
};

export const getEventParticipants = (req, res) => {
    console.log("Getting participants");
    console.log(req.query.postId);
    const token = req.cookies.accessToken;
    if (!token) {
        return res.status(401).json("Not Signed In.");
    };

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err) => {
        if (err) {
            return res.status(403).json("Token is not valid.");
        };

        const q = `SELECT participants.id, participants.name, participants.email, participants.phoneNumber FROM participants
                   INNER JOIN events ON participants.id = events.participantId
                   WHERE events.postId = ?`;

        db.query(q, [req.query.postId], (err, data) => {
            if (err) {
                return console.log("Error listing the participants: " + err.message + res.status(500).json(err));
            }
            else {
                return res.status(200).json(data);
            }
        })
    })
}


