import { db } from "../connectDB.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signin = (req, res) => {
    const q = "SELECT * FROM users WHERE username = ?";
    db.query(q, [req.body.username], (err, data) => {
        if (err) {
            return console.log("Error signing in user: " + res.status(500).json(err));
        }
        if (data.length === 0) {
            return res.status(404).json("User not found.");
        }

        // check the hashed password
        const checkedPassword = bcrypt.compareSync(req.body.password, data[0].password);
        if (!checkedPassword) {
            return res.status(400).json("Wrong password or username.");
        }

        // initialize web token
        // data[0] is the userInfo
        const token = jwt.sign({ id: data[0].id }, "secretkey");
        // destructure the data[0] to get the password
        // remaining properties will be collected to the object named "others"
        // "password": Contains the value of the password property from data[0].
        // "others": Contains an object that includes all the other properties from data[0] (those that are not password).
        const { password, ...others } = data[0];
        res.cookie("accessToken", token, {
            // means it cannot be accessed or modified via JavaScript on the client-side. 
            // This is a security measure to help protect the cookie from cross-site scripting (XSS) attacks.
            httpOnly: true,
        }).status(200).json(others);
    })
}

export const signup = (req, res) => {
    // check if user exists
    const q = "SELECT * FROM users WHERE username = ?";
    db.query(q, [req.body.username], (err, data) => {
        if (err) {
            return console.log("Error finding user: " + res.status(500).json(err));
        }
        if (data.length) {
            return res.status(409).json("User already exists.");
        }
        // if all of the above are false, create a new user
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(req.body.password, salt);
        const values = [
            req.body.username, 
            req.body.email, 
            hashedPassword, 
            req.body.name,
            req.body.role,
        ]
        // insert the user to the database
        const q = "INSERT INTO users (`username`, `email`, `password`, `name`, `role`) VALUE (?)";
        db.query(q, [values], (err, data) => {
            if (err) {
                return console.log("Error creating user: " + res.status(500).json(err));
            }
            else {
                return res.status(200).json("User have been created.")
            }
        })
    })
}

export const signout = (req, res) => {
    res.clearCookie("accessToken", {
        secure: true,
        sameSite: "none",
    }).status(200).json("User already signed out.");
}