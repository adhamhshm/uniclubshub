import { db } from "../connectDB.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// get posts that is relevant to user
export const getCommittees = (req, res) => {
    console.log("Getting commitee for: " + req.params.userId)
    const token = req.cookies.accessToken;
    if (!token) {
        console.log("Unauthorized get committees: No token authenticated.")
        return res.status(401).json("No session authenticated.");
    };

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, userInfo) => {
        if (err) {
            console.log("Unauthorized get committees: Invalid or expired token.")
            return res.status(403).json("Session had expired.");
        }

        const q = `SELECT * FROM committees WHERE userId = ?`;

        const values = [req.params.userId];
        db.query(q, values, (err, data) => {
            if (err) {
                console.log("Error fetching committees: " + err.message);
                return res.status(500).json("Error fetching committees.");
            }
            else {
                    return res.status(200).json(data);
            }
        });
    });
};

export const editCommittee = (req, res) => {
    console.log("Edit commitee for: " + req.body.name)
    const token = req.cookies.accessToken;
    if (!token) {
        console.log("Unauthorized update committee: No token authenticated.")
        return res.status(401).json("No session authenticated.");
    };

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, userInfo) => {
        if (err) {
            console.log("Unauthorized update committee: Invalid or expired token.")
            return res.status(401).json("Session had expired.");
        };
        const q = "UPDATE users SET `position` = ?, `name` = ?, `rank` = ? WHERE id = ?";
        const values = [
            req.body.position, 
            req.body.name, 
            req.body.rank, 
        ]
        db.query(q, values, (err, data) => {
            if (err) {
                console.log("Error updating committee: " + err.message);
                return res.status(500).json("Error updating committee.");
            }
            if (data.affectedRows > 0) {
                console.log("Updated successfully.");
                return res.json("Updated successfully.");
            }
            return res.status(403).json("You can only update your committees.");
        })
    });
};

export const addCommittee = (req, res) => {
    console.log("Adding commitee for: " + req.body.name)
    const token = req.cookies.accessToken;
    if (!token) {
        console.log("Unauthorized add committee: No token authenticated.")
        return res.status(401).json("No session authenticated.");
    };


    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, userInfo) => {
        
        if (err) {
            console.log("Unauthorized add committee: Invalid or expired token.")
            return res.status(403).json("Session had expired.");
        };

        const q = "INSERT INTO committees (`userId`, `position`, `name`, `rank`) VALUES (?)";

        const values = [
            userInfo.id,
            req.body.position,
            req.body.name,
            req.body.rank,
        ]

        db.query(q, [values], (err, data) => {
            if (err) {
                console.log("Error adding committee: " + err.message)
                return res.status(500).json("Error adding committee.");
            }
        })
    })
};

export const deleteCommittee = (req, res) => {
    console.log("Delete commitee for: " + req.body.id)
    const token = req.cookies.accessToken;
    if (!token) {
        console.log("Unauthorized delete committee: No token authenticated.")
        return res.status(401).json("No session authenticated.");
    };
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, userInfo) => {
        if (err) {
            console.log("Unauthorized delete committee: Invalid or expired token.")
            return res.status(403).json("Session had expired.");
        };

        const q = "DELETE FROM committees WHERE `id` = ?";

        const values = [req.body.id]

        db.query(q, values, (err, data) => {
            if (err) {
                console.log("Error deleting committee: " + err.message);
                return res.status(500).json("Error deleting activities.");
            }
            else if (data.affectedRows > 0) {
                return res.status(200).json("Committee has been deleted.");
            }
            else {
                return res.status(403).json("Not authorized to delete committee.");
            }
        })
    })
};


