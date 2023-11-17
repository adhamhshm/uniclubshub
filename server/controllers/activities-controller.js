import { db } from "../connectDB.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// get posts that is relevant to user
export const getActivitiesClubUser = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) {
        console.log("Unauthorized get account activities: No token authenticated.")
        return res.status(401).json("No session authenticated.");
    };

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, userInfo) => {
        if (err) {
            console.log("Unauthorized get club user activities: Invalid or expired token.")
            return res.status(403).json("Session had expired.");
        }

        const q = `SELECT a.*, p.name AS senderName, p.profilePhoto AS senderProfilePhoto, 
                   COALESCE(ps.title, 'n/a') AS postTitle, COALESCE(a.postId, 'n/a') AS postId
                   FROM activities AS a
                   JOIN participants AS p ON a.senderUserId = p.id
                   LEFT JOIN posts AS ps ON a.postId = ps.id
                   WHERE a.receiverUserId = ?
                   UNION
                   SELECT a.*, u.name AS senderName, u.profilePhoto AS senderProfilePhoto, 
                   COALESCE(ps.title, 'n/a') AS postTitle, COALESCE(a.postId, 'n/a') AS postId
                   FROM activities AS a
                   JOIN users AS u ON a.senderUserId = u.id
                   LEFT JOIN posts AS ps ON a.postId = ps.id
                   WHERE a.receiverUserId = ?
                   ORDER BY id DESC`;

        const values = [req.query.userId, req.query.userId];
        db.query(q, values, (err, data) => {
            if (err) {
                console.log("Error fetching user activities: " + err.message);
                return res.status(500).json("Error fetching user activities.");
            }
            else {
                return res.status(200).json(data);
            }
        });
    });
};

export const addActivities = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) {
        console.log("Unauthorized add activities: No token authenticated.")
        return res.status(401).json("No session authenticated.");
    };


    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, userInfo) => {
        
        if (err) {
            console.log("Unauthorized add activities: Invalid or expired token.")
            return res.status(403).json("Session had expired.");
        };

        let activityDescription = "";
        const hasReadValue = "no";
        if (req.body.activityType === "comment" && req.body.receiverUserId.length === 10) {
            activityDescription = " commented on a post you commented: ";
        }
        else if (req.body.activityType === "comment") {
            activityDescription = " commented on your post: ";
        }
        else if (req.body.activityType === "register") {
            activityDescription = " registered for your event: ";
        }
        else if (req.body.activityType === "like") {
            activityDescription = " liked your post: ";
        }
        else {
            activityDescription = " is now following you.";
        }

        const q = "INSERT INTO activities (`receiverUserId`, `postId`, `senderUserId`, `activityDescription`, `activityType`, `hasRead`) VALUES (?)";

        const values = [
            req.body.receiverUserId,
            req.body.postId,
            userInfo.id,
            activityDescription,
            req.body.activityType,
            hasReadValue
        ]

        db.query(q, [values], (err, data) => {
            if (err) {
                console.log("Error adding activities: " + err.message)
                return res.status(500).json("Error adding activities.");
            }
            else {
                return res.status(200).json("Activity added.");
            }
        })
    })
};

export const removeLikeActivities = (req, res) => {
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

        const q = "DELETE FROM activities WHERE `postId` = ? AND `senderUserId` = ? AND `activityType` = ?";

        const values = [
            req.body.postId,
            userInfo.id,
            req.body.activityType,
        ]

        db.query(q, values, (err, data) => {
            if (err) {
                console.log("Error deleting activities: " + err.message);
                return res.status(500).json("Error deleting activities.");
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

export const removeFollowActivities = (req, res) => {
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

        const q = "DELETE FROM activities WHERE `receiverUserId` = ? AND `senderUserId` = ? AND `activityType` = ?";

        const values = [
            req.body.receiverUserId,
            userInfo.id,
            req.body.activityType,
        ]

        db.query(q, values, (err, data) => {
            if (err) {
                console.log("Error deleting activities: " + err.message);
                return res.status(500).json("Error deleting activities.");
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

export const markAsRead = (req, res) => {
    console.log("markkkk")

    const token = req.cookies.accessToken;
    if (!token) {
        console.log("Unauthorized delete post: No token authenticated.")
        return res.status(401).json("No session authenticated.");
    };

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err) => {
        if (err) {
            console.log("Unauthorized delete post: Invalid or expired token.")
            return res.status(403).json("Session had expired.");
        }
        const q = "UPDATE activities SET `hasRead` = ? WHERE id = ?";
        const values = [
            req.body.hasRead,
            req.body.activityId,
        ]
        db.query(q, values, (err, data) => {
            if (err) {
                console.log("Error mark as read: " + err.message);
                return res.status(500).json("Error mark activity as read.");
            }
            if (data.affectedRows > 0) {
                console.log("Activities mark as read.");
                return res.json("Activities mark as read.");
            }
            console.log("There is problem to mark as read.");
            return res.status(403).json("There is problem to mark as read.");
        })
    });
}

