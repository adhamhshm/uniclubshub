import { db } from "../connectDB.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

export const getFollowRelation = (req, res) => {
    const q = "SELECT followerUserId FROM follow_relations WHERE followedUserId = ?";

    db.query(q, [req.query.followedUserId], (err, data) => {
        if (err) {
            console.error("Error retrieving follow relation: " + err.message);
            return res.status(500).json(err);
        }
        else {
            return res.status(200).json(data.map(followRelation => followRelation.followerUserId));
        }
    });
};

export const addFollowRelation = (req, res) => {

    const token = req.cookies.accessToken;
    if (!token) {
        return res.status(401).json("Not Signed In.");
    };

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, userInfo) => {
        if (err) {
            return res.status(403).json("Token is not valid.");
        }

        const q = "INSERT INTO follow_relations (`followerUserId`, `followedUserId`) VALUES (?)";

        const values = [
            userInfo.id,
            req.body.userId
        ]

        db.query(q, [values], (err, data) => {
            if (err) {
                console.log("Error adding follow relation: " + err.message);
                return res.status(500).json(err);
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
        return res.status(401).json("Not Signed In.");
    };

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, userInfo) => {
        if (err) {
            return res.status(403).json("Token is not valid.");
        }

        const q = "DELETE FROM follow_relations where `followerUserId` = ? AND `followedUserId` = ?";

        db.query(q, [userInfo.id, req.query.userId], (err, data) => {
            if (err) {
                console.log("Error removing follow relation: " + err.message);
                return res.status(500).json(err);
            }
            else {
                return res.status(200).json("Unfollowing successfully.");
            }
        });
    });
};