import { db } from "../connectDB.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

export const signin = (req, res) => {

    if (req.body.id.charAt(0).toUpperCase() === "C") {
        const q = "SELECT * FROM users WHERE id = ?";
        db.query(q, [req.body.id], (err, data) => {
            if (err) {
                return console.log("Error signing in user: " + res.status(500).json(err));
            }
            if (data.length === 0) {
                return res.status(404).json("User not found.");
            }

            // check the hashed password
            const checkedPassword = bcrypt.compareSync(req.body.password, data[0].password);
            if (!checkedPassword) {
                return res.status(400).json("Wrong password or ID.");
            }

            // initialize web token
            // data[0] is the userInfo
            const token = jwt.sign({ 
                id: data[0].id, 
                role: data[0].role
            }, process.env.JWT_SECRET_KEY, {
                expiresIn: 3600, // Set the token expiry time to 1 hour (3600 seconds)
            });
            // destructure the data[0] to get the password
            // remaining properties will be collected to the object named "others"
            // "password": Contains the value of the password property from data[0].
            // "others": Contains an object that includes all the other properties from data[0] (those that are not password).
            const { password, ...others } = data[0];
            res.cookie("accessToken", token, {
                // means it cannot be accessed or modified via JavaScript on the client-side. 
                // This is a security measure to help protect the cookie from cross-site scripting (XSS) attacks.
                httpOnly: true,
                sameSite: "strict",
                secure: true, // Only send the cookie over HTTPS
            }).status(200).json(others);
        })
    }
    else {
        const q = "SELECT * FROM participants WHERE id = ?";
        db.query(q, [req.body.id], (err, data) => {
            if (err) {
                console.log("Error signing in user: " + err.message)
                return res.status(500).json("Error signing in user.");
            }
            if (data.length === 0) {
                return res.status(404).json("User not found.");
            }

            // check the hashed password
            const checkedPassword = bcrypt.compareSync(req.body.password, data[0].password);
            if (!checkedPassword) {
                return res.status(400).json("Wrong password or id.");
            }

            // initialize web token
            // data[0] is the userInfo
            const token = jwt.sign({ 
                id: data[0].id, 
                role: data[0].role
            }, process.env.JWT_SECRET_KEY, {
                expiresIn: 3600, // Set the token expiry time to 1 hour (3600 seconds)
            });
            // destructure the data[0] to get the password
            // remaining properties will be collected to the object named "others"
            // "password": Contains the value of the password property from data[0].
            // "others": Contains an object that includes all the other properties from data[0] (those that are not password).
            const { password, ...others } = data[0];
            res.cookie("accessToken", token, {
                // means it cannot be accessed or modified via JavaScript on the client-side. 
                // This is a security measure to help protect the cookie from cross-site scripting (XSS) attacks.
                httpOnly: true,
                sameSite: "strict",
                secure: true, // Only send the cookie over HTTPS
            }).status(200).json(others);
        })
    }
}

export const signup = (req, res) => {

    // Regular expression for validating email format
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    // Check if the email follows the standard email format
    if (!emailRegex.test(req.body.email)) {
        return res.status(400).json("Invalid email format.");
    }

    if (req.body.role === "club" ) {
        // check if user exists
        const q = "SELECT * FROM users WHERE id = ?";
        db.query(q, [req.body.id], (err, data) => {
            if (err) {
                console.log("Error finding user: " + err.message);
                return res.status(500).json("Error findind user.");
            }
            if (data.length) {
                return res.status(409).json("User already exists.");
            }
            // if all of the above are false, create a new user
            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(req.body.password, salt);
            const values = [
                req.body.id, 
                req.body.email, 
                hashedPassword, 
                req.body.name,
                req.body.role,
            ]
            // insert the user to the database
            const q = "INSERT INTO users (`id`, `email`, `password`, `name`, `role`) VALUE (?)";
            db.query(q, [values], (err, data) => {
                if (err) {
                    console.log("Error creating user: " + err.message)
                    return res.status(500).json("Error creating user.");
                }
                else {
                    return res.status(200).json("User have been created.")
                }
            })
        })
    }
    else {
        // check if user exists
        const q = "SELECT * FROM participants WHERE id = ?";
        db.query(q, [req.body.id], (err, data) => {
            if (err) {
                console.log("Error finding user: " + err.message);
                return res.status(500).json("Error findind user.");
            }
            if (data.length) {
                return res.status(409).json("User already exists.");
            }
            // if all of the above are false, create a new user
            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(req.body.password, salt);
            const values = [
                req.body.id, 
                req.body.email, 
                hashedPassword, 
                req.body.name,
                req.body.role,
            ]
            // insert the user to the database
            const q = "INSERT INTO participants (`id`, `email`, `password`, `name`, `role`) VALUE (?)";
            db.query(q, [values], (err, data) => {
                if (err) {
                    console.log("Error creating user: " + err.message)
                    return res.status(500).json("Error creating user.");
                }
                else {
                    return res.status(200).json("User have been created.")
                }
            })
        })
    }
}

export const signout = (req, res) => {
    res.clearCookie("accessToken", {
        httpOnly: true,
        sameSite: "strict",
        secure: true, 
    }).status(200).json("User already signed out.");
}

export const authorizeToken = (req, res) => {
    const token = req.cookies.accessToken; // Get the token from the request (assuming it's stored in a cookie)
    if (!token) {
        console.log("Unauthorized token: No token provided.")
        return res.status(401).json("No session authenticated.");
    }

    
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, userInfo) => {

        if (err) {
            console.log("Unauthorized token: Invalid or expired token.")
            return res.status(401).json("Session had expired.");
        }

        if(userInfo.id !== req.query.currentUserId) {
            console.log("ID mismatched: You may had sent an unauthorized ID to the server")
            return res.status(401).json("System encounter invalid data.");
        }

        if(userInfo.role !== req.query.role) {
            console.log("Data mismatched: You may had sent an invalid data to the server")
            return res.status(401).json("System encounter invalid data.");
        }

        // Token is valid
        res.status(200).json("Authorization approved.");
    });
}
