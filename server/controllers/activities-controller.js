import { db } from "../connectDB.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// get posts that is relevant to user
export const getActivitiesClubUser = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) {
        console.log("Unauthorized get club user activities: No token authenticated.")
        return res.status(401).json({ error : "Unauthorized get club user activities: No token authenticated."});
    };

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, userInfo) => {
        if (err) {
            console.log("Unauthorized get club user activities: Invalid or expired token.")
            return res.status(403).json({error : "Unauthorized get club user activities: Invalid or expired token."});
        }

        const q = `SELECT a.*, p.name AS participantName, p.profilePhoto AS participantProfilePhoto, ps.title AS postTitle
                   FROM activities AS a
                   JOIN participants AS p ON a.senderUserId = p.id
                   JOIN posts AS ps ON a.postId = ps.id
                   WHERE a.receiverUserId = ?
                   ORDER BY a.id DESC`;

        const values = [req.query.userId];
        db.query(q, values, (err, data) => {
            if (err) {
                console.log("Error fetching club user activities: " + err.message);
                return res.status(500).json({ error : "Error fetching club user activities." });
            }
            else {
                return res.status(200).json(data);
            }
        })
    })
};

export const addActivities = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) {
        console.log("Unauthorized add activities: No token authenticated.")
        return res.status(401).json({ error : "Unauthorized add activities: No token authenticated."});
    };

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, userInfo) => {
        if (err) {
            console.log("Unauthorized add activities: Invalid or expired token.")
            return res.status(403).json({error : "Unauthorized add activities: Invalid or expired token."});
        };

        let activityDescription = "";
        const hasReadValue = "no";
        if (req.body.activityType === "comment") {
            activityDescription = " commented on your post: ";
        }
        else if (req.body.activityType === "register") {
            activityDescription = " registered for your event: ";
        }
        else if (req.body.activityType === "like") {
            activityDescription = " liked one of your posts: ";
        }
        else {
            activityDescription = " is now following you.";
        }

        const q = "INSERT INTO activities (`receiverUserId`, `postId`, `senderUserId`, `activityDescription`, `activityType`, `hasRead`) VALUES (?)";

        const values = [
            req.body.receiverUserId,
            req.body.postId,
            req.body.senderUserId,
            activityDescription,
            req.body.activityType,
            hasReadValue
        ]

        db.query(q, [values], (err, data) => {
            if (err) {
                console.log("Error adding activities: " + err.message)
                return res.status(500).json(err);
            }
            else {
                const insertedActivityId = data.insertId; // Get the ID of the newly added activity
                return res.status(200).json({ message: "Activity is added.", activityId: insertedActivityId });
            }
        })
    })
};

export const deleteActivities = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) {
        console.log("Unauthorized delete post: No token authenticated.")
        return res.status(401).json({ error : "Unauthorized delete post: No token authenticated."});
    };
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err) => {
        if (err) {
            console.log("Unauthorized delete post: Invalid or expired token.")
            return res.status(403).json({error : "Unauthorized delete post: Invalid or expired token."});
        };

        const q = "DELETE FROM activities WHERE `postId` = ? AND `senderUserId` = ? AND `activityType` = ?";

        const values = [
            req.body.postId,
            req.body.senderUserId,
            req.body.activityType,
        ]

        db.query(q, values, (err, data) => {
            if (err) {
                console.log("Error deleting activities: " + err.message);
                return res.status(500).json(err);
            }
            else if (data.affectedRows > 0) {
                return res.status(200).json("Activity has been deleted.");
            }
            else {
                return res.status(403).json("Not authorized to delete activities.");
            }
        })
    })
};

