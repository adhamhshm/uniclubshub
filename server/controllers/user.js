import { db } from "../connectDB.js";
import jwt from "jsonwebtoken";

// get the user
export const getUser = (req, res) => {
    const userId = req.params.userId;
    const q = "SELECT * FROM users WHERE id = ?";

    db.query(q, [userId], (err, data) => {
        if (err) {
            console.log("Error fetching user: " + err.message);
            return res.status(500).json(err);
        }
        else {
            // should not return the password
            const { password, ...userInfo } = data[0];
            return res.json(userInfo);
        }
    })

};

export const updateUser = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) {
        return res.status(401).json("Not Signed In.");
    };

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) {
            return res.status(403).json("Token is not valid.");
        };

        const q = "UPDATE users SET `name` = ?, `coverPhoto` = ?, `profilePhoto` = ? WHERE id = ?"
        db.query(q, [req.body.name, req.body.coverPhoto, req.body.profilePhoto, userInfo.id], (err, data) => {
            if (err) {
                console.log("Error updating user: " + err.message);
                return res.status(500).json(err);
            }
            if (data.affectedRows > 0) {
                return res.json("Updated successfully.");
            }
            return res.status(403).json("You can only update your profile.");
        })
    });

};

// for testing the route only
// export const testUsersRoute = (req, res) => {
//     res.send("This users route is working.");
// };