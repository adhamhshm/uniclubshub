import { db } from "../connectDB.js";
import jwt from "jsonwebtoken";
import moment from "moment";

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
            return res.status(500).json(err);
        }
        else {
            return res.status(200).json(data);
        }
    });
};

export const addComment = (req, res) => {

    const token = req.cookies.accessToken;
    if (!token) {
        return res.status(401).json("Not Signed In.");
    };

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) {
            return res.status(403).json("Token is not valid.");
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
                console.log("Error adding comments: " + err.message);
                return res.status(500).json(err);
            }
            else {
                return res.status(200).json("Comment has been sent.");
            }
        });
    });
};