import express from "express";
import { getUser, getUserList, updateUser } from "../controllers/user.js";

const router = express.Router();

// test the users route
// router.get("/test", testUsersRoute);

router.get("/find/:userId", getUser);
router.put("/", updateUser);
router.get("/club-list", getUserList);

export default router;