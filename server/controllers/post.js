import moment from "moment";
import { db } from "../connectDB.js";
import jwt from "jsonwebtoken";

export const getPosts = (req, res) => {

    const userId = req.query.userId;

    const token = req.cookies.accessToken;
    if (!token) {
        return res.status(401).json("Not Signed In.");
    };

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) {
            return res.status(403).json("Token is not valid.");
        };

        const q = userId !== "undefined"
                    ? `SELECT p.*, u.id AS userId, name, profilePhoto FROM posts AS p JOIN users AS u ON (u.id = p.userId) WHERE p.userId = ?
                       ORDER BY p.createdAt DESC`
                    : `SELECT p.*, u.id AS userId, name, profilePhoto FROM posts AS p JOIN users AS u ON (u.id = p.userId)
                       LEFT JOIN follow_relations AS r ON (p.userId = r.followedUserId) WHERE r.followerUserId = ? OR p.userId = ?
                       ORDER BY p.createdAt DESC`;

        const values = userId !== "undefined" ? [userId] : [userInfo.id, userInfo.id];
        db.query(q, values, (err, data) => {
            if (err) {
                return console.log("Error fetching posts: " + res.status(500).json(err));
            }
            else {
                return res.status(200).json(data);
            }
        })
    })
};

export const addPost = (req, res) => {

    const token = req.cookies.accessToken;
    if (!token) {
        return res.status(401).json("Not Signed In.");
    };

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) {
            return res.status(403).json("Token is not valid.");
        };

        // Generate a random post ID based on current date, time, and a random number
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hour = String(now.getHours()).padStart(2, '0');
        const minute = String(now.getMinutes()).padStart(2, '0');
        const second = String(now.getSeconds()).padStart(2, '0');
        const millisecond = String(now.getMilliseconds()).padStart(3, '0');
        const random = Math.floor(Math.random() * 1000);
        const postId = `${year}${month}${day}${hour}${minute}${second}${millisecond}_${random}`;

        const q = "INSERT INTO posts (`id`, `description`, `image`, `userId`, `createdAt`) VALUES (?)";

        const values = [
            postId,
            req.body.description,
            req.body.image,
            userInfo.id,
            moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")
        ]

        db.query(q, [values], (err, data) => {
            if (err) {
                return console.log("Error adding post: " + err.message + res.status(500).json(err));
            }
            else {
                return res.status(200).json("Post has been created.");
            }
        })
    })
};

export const deletePost = (req, res) => {

    const token = req.cookies.accessToken;
    if (!token) {
        return res.status(401).json("Not Signed In.");
    };

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) {
            return res.status(403).json("Token is not valid.");
        };

        const q = "DELETE FROM posts WHERE `id` = ? AND `userId` = ?";

        db.query(q, [req.params.id, userInfo.id], (err, data) => {
            if (err) {
                return console.log("Error adding post: " + err.message + res.status(500).json(err));
            }
            else if (data.affectedRows > 0) {
                return res.status(200).json("Post has been deleted.");
            }
            else {
                return res.status(403).json("You can only delete your post.");
            }
        })
    })
};


