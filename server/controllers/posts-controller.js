import moment from "moment";
import { db } from "../connectDB.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Get posts that is relevant to user
export const getPosts = (req, res) => {
    const userId = req.query.userId;
    const token = req.cookies.accessToken;
    if (!token) {
        console.log("Unauthorized get posts: No token authenticated.")
        return res.status(401).json("No session authenticated.");
    };

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, userInfo) => {
        if (err) {
            console.log("Unauthorized get posts: Invalid or expired token.")
            return res.status(403).json("Session had expired.");
        }
        else {
            const q = userId !== "undefined"
                    ? `SELECT p.*, u.id AS userId, name, profilePhoto FROM posts AS p JOIN users AS u ON (u.id = p.userId) WHERE p.userId = ?
                       ORDER BY p.createdAt DESC`
                    : `SELECT p.*, u.id AS userId, name, profilePhoto FROM posts AS p JOIN users AS u ON (u.id = p.userId)
                       LEFT JOIN follow_relations AS r ON (p.userId = r.followedUserId) WHERE r.followerUserId = ? OR p.userId = ?
                       ORDER BY p.createdAt DESC`;

            const values = userId !== "undefined" ? [userId] : [userInfo.id, userInfo.id];
            db.query(q, values, (err, data) => {
                if (err) {
                    console.log("Error fetching posts: " + err.message);
                    return res.status(500).json("Error fetching posts.");
                }
                else {
                    return res.status(200).json(data);
                }
            })
        }
    })
};

// Get only a single post
export const getSinglePost = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) {
        console.log("Unauthorized get posts: No token authenticated.")
        return res.status(401).json("No session authenticated.");
    };

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, userInfo) => {
        if (err) {
            console.log("Unauthorized get posts: Invalid or expired token.")
            return res.status(403).json("Session had expired.");
        }
        const q = `SELECT posts.*, users.name, users.profilePhoto
                   FROM posts
                   JOIN users ON posts.userId = users.id
                   WHERE posts.id = ?`;

        const values = [req.params.id];
        db.query(q, values, (err, data) => {
            if (err) {
                console.log("Error fetching single post: " + err.message);
                return res.status(500).json("Error fetching single post.");
            }
            else {
                return res.status(200).json(data);
            }
        })
    })
};

// Get the number of posts
export const getPostsNumber = (req, res) => {
    const q = `SELECT COUNT(userId) AS postsNumber
               FROM posts
               WHERE userId = ?`;

    db.query(q, [req.query.userId], (err, data) => {
        if (err) {
            console.log("Error retrieving posts number: " + err.message);
            return res.status(500).json("Error retrieving posts number.");
        } 
        else {
            // Checking if there's any data returned before accessing it
            if (data.length > 0 && data[0].postsNumber) {
                const postsNumber = data[0].postsNumber;
                return res.status(200).json({ postsNumber });
            } 
            else {
                return res.status(200).json(0);
            }
        }
    });
};

export const getPostsByYear = (req, res) => {
    console.log("Get posts by year")
    const token = req.cookies.accessToken;
    if (!token) {
        console.log("Unauthorized get posts by year: No token authenticated.")
        return res.status(401).json("No session authenticated");
    };

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, userInfo) => {
        if (err) {
            console.log("Unauthorized get posts by year: Invalid or expired token.")
            return res.status(403).json("Session had expired.");
        };

        const q = `SELECT * FROM posts WHERE userId = ?
                   AND YEAR(createdAt) = ?
                   ORDER BY createdAt DESC`;

        const values = [
            req.query.userId,
            req.query.year
        ];

        db.query(q, values, (err, data) => {
            if (err) {
                console.log("Error fetching posts by year: " + err.message)
                return res.status(500).json("Error fetching posts by year.");
            }
            else {
                return res.status(200).json(data);
            }
        })
    })
};

// get all posts or searched posts
export const getSearchedPosts = (req, res) => {
    const token = req.cookies.accessToken;

    // Check if a valid token is present
    if (!token) {
        console.log("Unauthorized get searched posts: No token authenticated.")
        return res.status(401).json("No session authenticated.");
    };

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err) => {
        if (err) {
            console.log("Unauthorized get searched posts: Invalid or expired token.")
            return res.status(403).json("Session had expired.");
        }

        // Get the search input from the query parameters
        const searchInput = req.query.searchQuery;

        if (searchInput) {
            // If there is a search input, build the SQL query for searching posts
            const q = `SELECT p.*, u.profilePhoto, u.name FROM posts p
                       JOIN users u ON p.userId = u.id
                       WHERE u.name LIKE ? OR p.description LIKE ?
                       ORDER BY p.createdAt DESC`;

            const searchValue = `%${searchInput}%`; // Add '%' for partial matching

            db.query(q, [searchValue, searchValue], (err, data) => {
                if (err) {
                    console.log("Error fetching searched posts: " + err.message);
                    return res.status(500).json("Error fetching searched posts.");
                } 
                else {
                    return res.status(200).json(data);
                }
            });
        } 
        else {
            // If there is no search input, retrieve all posts
            const q = `SELECT p.*, u.profilePhoto, u.name FROM posts p JOIN users u ON p.userId = u.id ORDER BY p.createdAt DESC`;

            db.query(q, (err, data) => {
                if (err) {
                    console.log("Error fetching all posts: " + err);
                    return res.status(500).json("Error fetching all posts");
                } 
                else {
                    return res.status(200).json(data);
                }
            });
        }
    });
};

export const addPost = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) {
        console.log("Unauthorized add post: No token authenticated.")
        return res.status(401).json("No token authenticated.");
    };

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, userInfo) => {
        if (err) {
            console.log("Unauthorized add post: Invalid or expired token.")
            return res.status(403).json("Session had expired.");
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

        const q = "INSERT INTO posts (`id`, `title`, `description`, `image`, `userId`, `createdAt`) VALUES (?)";

        const values = [
            postId,
            req.body.title,
            req.body.description,
            req.body.image,
            userInfo.id,
            moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")
        ]

        db.query(q, [values], (err, data) => {
            if (err) {
                console.log("Error adding post: " + err.message);
                return res.status(500).json("Error adding post.");
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
        console.log("Unauthorized delete post: No token authenticated.")
        return res.status(401).json("No session authenticated.");
    };
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, userInfo) => {
        if (err) {
            console.log("Unauthorized delete post: Invalid or expired token.")
            return res.status(403).json("Session had expired.");
        };

        const q = "DELETE FROM posts WHERE `id` = ? AND `userId` = ?";

        db.query(q, [req.params.id, userInfo.id], (err, data) => {
            if (err) {
                console.log("Error deleting post: " + err.message);
                return res.status(500).json("Error deleting post.");
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
