import { db } from "../connectDB.js";
import jwt from "jsonwebtoken";

export const registerEventPost = (req, res) => {
    console.log("Registering...")
    const token = req.cookies.accessToken;
    if (!token) {
        return res.status(401).json("Not Signed In.");
    };

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) {
            return res.status(403).json("Token is not valid.");
        };

        const q = "INSERT INTO register_events (`postId`, `participantId`) VALUES (?)";

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
    const q = "SELECT participantId FROM register_events WHERE postId = ?";

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


