import { db } from "../connectDB.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// get the user
export const getUser = (req, res) => {
    const userId = req.params.userId;
    const q = "SELECT * FROM users WHERE id = ?";

    db.query(q, [userId], (err, data) => {
        if (err) {
            console.log("Error fetching user: " + err.message);
            return res.status(500).json("Error fetching user.");
        }

        if (data.length === 0) {
            return res.status(404).json("User not found.");
        }

        // should not return the password
        const { password, ...userInfo } = data[0];
        return res.json(userInfo);
    })

};

export const updateUser = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) {
        console.log("Unauthorized update user: No token authenticated.")
        return res.status(401).json("No session authenticated.");
    };

    // Regular expression for validating email format
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    // Check if the email follows the standard email format
    if (!emailRegex.test(req.body.email)) {
        return res.status(400).json("Invalid email format.");
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, userInfo) => {
        if (err) {
            console.log("Unauthorized update user: Invalid or expired token.")
            return res.status(401).json("Session had expired.");
        };
        const q = "UPDATE users SET `name` = ?, `profilePhoto` = ?, `email` = ?, `bio` = ? WHERE id = ?";
        const values = [
            req.body.name, 
            req.body.profilePhoto, 
            req.body.email, 
            req.body.bio, 
            userInfo.id
        ]
        db.query(q, values, (err, data) => {
            if (err) {
                console.log("Error updating user: " + err.message);
                return res.status(500).json("Error updating user.");
            }
            if (data.affectedRows > 0) {
                console.log("Updated successfully.");
                return res.json("Updated successfully.");
            }
            console.log("You can only update your profile.");
            return res.status(403).json("You can only update your profile.");
        })
    });
};

export const getUserList = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) {
        console.log("Unauthorized get user list: No token authenticated.")
        return res.status(401).json("No session authenticated.");
    };

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err) => {
        if (err) {
            console.log("Unauthorized get user list: Invalid or expired token.")
            return res.status(401).json("Session had expired.");
        }

        const searchInput = req.query.searchQuery;

        if(searchInput) {
            const q = `SELECT id, name, profilePhoto FROM users
                       WHERE name LIKE ?`;

            const searchValue = `%${searchInput}%`; // Add '%' for partial matching

            db.query(q, [searchValue], (err, data) => {
                if (err) {
                    console.log("Error fetching searched user list: " + err.message);
                    return res.status(500).json("Error fetching searched user list.");
                } else {
                    return res.json(data);
                }
            });
        }
        else {

            const q = `SELECT id, name, profilePhoto FROM users`;

            db.query(q, (err, data) => {
                if (err) {
                    console.log("Error fetching user list: " + err.message);
                    return res.status(500).json("Error fetching user list.");
                } else {
                    return res.json(data);
                }
            });
        }
    });
};

export const getAllUser = (req, res) => {

    const token = req.cookies.accessToken;
    if (!token) {
        console.log("Unauthorized get user list: No token authenticated.")
        return res.status(401).json("No session authenticated.");
    };

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err) => {
        if (err) {
            console.log("Unauthorized get user list: Invalid or expired token.")
            return res.status(401).json("Session had expired.");
        }

        const page = req.query.page || 1;
        const pageSize = req.query.pageSize || 10;
        const offset = (page - 1) * pageSize;
        const limit = parseInt(pageSize);

        const q = `SELECT id, name, profilePhoto FROM users LIMIT ?, ?`;
        const values = [ offset, limit ];

        db.query(q, values, (err, data) => {
            if (err) {
                console.log("Error fetching user list: " + err.message);
                return res.status(500).json("Error fetching user list.");
            } else {
                return res.json(data);
            }
        });
    });
};

// for testing the route only
// export const testUsersRoute = (req, res) => {
//     res.send("This users route is working.");
// };