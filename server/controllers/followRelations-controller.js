import { db } from "../connectDB.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

export const getFollowRelation = (req, res) => {
    const q = "SELECT followerUserId FROM follow_relations WHERE followedUserId = ?";

    db.query(q, [req.query.followedUserId], (err, data) => {
        if (err) {
            console.log("Error retrieving follow relation: " + err.message);
            return res.status(500).json("Error retrieving follow relation.");
        }
        else {
            return res.status(200).json(data.map(followRelation => followRelation.followerUserId));
        }
    });
};

export const getFollowRelationOfParticipant = (req, res) => {
    const q = "SELECT followedUserId FROM follow_relations WHERE followerUserId = ?";
    db.query(q, [req.query.followerUserId], (err, data) => {
        if (err) {
            console.error("Error retrieving accounts followed by user: " + err.message);
            return res.status(500).json("Error retrieving accounts followed by user.");
        }
        else {
            return res.status(200).json(data);
        }
    });
}

export const addFollowRelation = (req, res) => {

    const token = req.cookies.accessToken;
    if (!token) {
        console.log("Unauthorized add follow relation: No token authenticated.")
        return res.status(401).json("No session authenticated.");
    };

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, userInfo) => {
        if (err) {
            console.log("Unauthorized add follow relation: Invalid or expired token.")
            return res.status(401).json("Session had expired.");
        }

        const q = "INSERT INTO follow_relations (`followerUserId`, `followedUserId`) VALUES (?)";
        const values = [
            userInfo.id,
            req.body.userId
        ]

        db.query(q, [values], (err, data) => {
            if (err) {
                console.log("Error adding follow relation: " + err.message);
                return res.status(500).json("Error adding follow relation.");
            }
            else {
                return res.status(200).json("Following successfully.");
            }
        });
    });
};

export const deleteFollowRelation = (req, res) => {

    const token = req.cookies.accessToken;
    if (!token) {
        console.log("Unauthorized delete follow relation: No token authenticated.")
        return res.status(401).json("No session authenticated.");
    };

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, userInfo) => {
        if (err) {
            console.log("Unauthorized delete follow relation: Invalid or expired token.")
            return res.status(401).json("Session had expired.");
        }

        const q = "DELETE FROM follow_relations where `followerUserId` = ? AND `followedUserId` = ?";

        db.query(q, [userInfo.id, req.query.userId], (err, data) => {
            if (err) {
                console.log("Error deleting follow relation: " + err.message);
                return res.status(500).json("Error deleting follow relation.");
            }
            else {
                return res.status(200).json("Unfollowing successfully.");
            }
        });
    });
};