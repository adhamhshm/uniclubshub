import { db } from "../connectDB.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

export const signin = (req, res) => {

    // Determine the table based on the id
    const tableName = req.body.id.charAt(0).toUpperCase() === "C" ? "users" : "participants";
    const q = `SELECT * FROM ${tableName} WHERE id = ?`;
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
};

export const signup = (req, res) => {

    // Determine the table based on the id
    const tableName = req.body.id.charAt(0).toUpperCase() === "C" ? "users" : "participants";

    // Regular expression for validating email format
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    // Check if the email follows the standard email format
    if (!emailRegex.test(req.body.email)) {
        return res.status(400).json("Invalid email format.");
    }

    // check if user exists OR email = ?
    const q = `SELECT * FROM users WHERE id = ? OR email = ?
               UNION
               SELECT * FROM participants WHERE id = ? OR email = ?`;
    const values = [
        req.body.id, 
        req.body.email, 
        req.body.id, 
        req.body.email
    ]
    db.query(q, values, (err, data) => {
        if (err) {
            console.log("Error finding user: " + err.message);
            return res.status(500).json("Error findind user.");
        }
        if (data.length) {
            return res.status(409).json("ID or email already exists.");
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
        const q = `INSERT INTO ${tableName} (id, email, password, name, role) VALUE (?)`;
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
};

export const signout = (req, res) => {
    res.clearCookie("accessToken", {
        httpOnly: true,
        sameSite: "strict",
        secure: true, 
    }).status(200).json("User already signed out.");
};

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
};

export const sendResetPasswordEmailRequest = (req, res) => {
  
    const resetToken = req.cookies.resetToken;
    if (resetToken) {
        jwt.verify(resetToken, process.env.JWT_SECRET_KEY, (err, decodedToken) => {
            if (!err && decodedToken.email === req.body.email) {
                console.log("A reset token already exists.");
                return res.status(409).json("Reset request has been sent. Please wait an hour before requesting a new one.");
            }
            else {
                sendEmailToUser(req, res);
            }
        });
    }
    else {
        sendEmailToUser(req, res);
    }
};

const sendEmailToUser = (req, res) => {
    const userEmail = req.body.email;
    // Check if the email is present in either "users" or "participants" table
    const query = `SELECT * FROM users WHERE email = ? 
                   UNION 
                   SELECT * FROM participants WHERE email = ?`;
    const values = [ userEmail, userEmail ];
    db.query(query, values, (err, results) => {

        if (err) {
            console.log("Error finding email: " + err.message);
            return res.status(500).json("Error finding email.");
        };

        if (results.length === 0) {
            return res.status(404).json("Email not found.");
        };

        const resetPasswordToken = generateResetPasswordToken(userEmail);

        // Set up nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: process.env.SERVICE,
            host: process.env.HOST,
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_GMAIL,
                // Need to use the App Password after activating the 2-step Verification 
                pass: process.env.PASSWORD_GMAIL
            },
        });

        // Set up email options
        const mailOptions = {
            from: process.env.EMAIL_GMAIL,
            to: userEmail,
            subject: "Uniclubshub - Reset Password",
            text: "Reset your Uniclubshub account password here: " + 
                  `${process.env.INTERNAL_CLIENT_URL}/reset-password?id=${results[0].id}&email=${userEmail}&${resetPasswordToken}`
        };

        // Send the email
        transporter.sendMail(mailOptions, (error) => {
            if (error) {
                console.log("Error sending email: " + error.message)
                return res.status(500).json("Error sending email.");
            }

            res.cookie("resetToken", resetPasswordToken, {
                httpOnly: true,
                sameSite: "strict",
                secure: true,
            });

            res.status(200).json("Email sent successfully.");
        });
    });
}

const generateResetPasswordToken = (email) => {

    const token = jwt.sign({ email: email }, process.env.JWT_SECRET_KEY, {
        expiresIn: 3600, // Set the token expiry time to 1 hour (3600 seconds)
    });

    return token;
};

export const resetPassword = (req, res) => {

    const resetToken = req.cookies.resetToken;
    if (!resetToken) {
        console.log("Unauthorized to reset password: No token authenticated.")
        return res.status(401).json("Invalid reset request.");
    };
    

    jwt.verify(resetToken, process.env.JWT_SECRET_KEY, (err) => {
        if (err) {
            console.log("Unauthorized to reset password: Invalid or expired token.")
            return res.status(403).json("Reset password request had expired.");
        }

        // Determine the table based on the id
        const tableName = req.body.id.charAt(0).toUpperCase() === "C" ? "users" : "participants";

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(req.body.newPassword, salt);
        const q = `UPDATE ${tableName} SET password = ? WHERE id = ?`;
        const values = [
            hashedPassword,
            req.body.id,
        ]
        db.query(q, values, (err, data) => {
            if (err) {
                console.log("Error reset password: " + err.message);
                return res.status(500).json("Error reset password.");
            }
            if (data.affectedRows > 0) {
                console.log("The password has been reset.");
                res.clearCookie("resetToken", {
                    httpOnly: true,
                    sameSite: "strict",
                    secure: true, 
                });
                return res.json("The password has been reset.");
            }
            console.log("There is problem to reset password.");
            return res.status(403).json("There is problem to reset password.");
        })
    });
};
