import { db } from "../connectDB.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

export const registerEventPost = (req, res) => {
    console.log("Registering...")
    const token = req.cookies.accessToken;
    if (!token) {
        console.log("Unauthorized register for event: No token authenticated.")
        return res.status(401).json("No session authenticated.");
    };

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err) => {
        if (err) {
            console.log("Unauthorized register for event: Invalid or expired token.")
            return res.status(401).json("Session had expired.");
        };

        const q = "INSERT INTO events (`postId`, `participantId`) VALUES (?)";

        const values = [
            req.body.postId,
            req.body.participantId
        ]

        db.query(q, [values], (err, data) => {
            if (err) {
                console.log("Error inserting event registration: " + err.message);
                return res.status(500).json("Error inserting event registration.");
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
            console.log("Error retrieving likes: " + err.message);
            return res.status(500).json("Error retrieving likes.");
        }
        else {
            return res.status(200).json(data.map(like => like.participantId));
        }
    });
};

export const getEventParticipants = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) {
        console.log("Unauthorized get event's participants: No token authenticated.")
        return res.status(401).json("No session authenticated.");
    };

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err) => {
        if (err) {
            console.log("Unauthorized get event's participants: Invalid or expired token.")
            return res.status(401).json("Session had expired.");
        };

        const q = `SELECT participants.id, participants.name, participants.email, participants.phoneNumber FROM participants
                   INNER JOIN events ON participants.id = events.participantId
                   WHERE events.postId = ?`;

        db.query(q, [req.query.postId], (err, data) => {
            if (err) {
                console.log("Error listing the participants: " + err.message);
                return res.status(500).json("Error listing the participants.");
            }
            else {
                return res.status(200).json(data);
            }
        })
    })
}


