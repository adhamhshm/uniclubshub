import express from "express";
import { getAllUser, getUser, getUserList, updateUser } from "../controllers/users-controller.js";

const router = express.Router();


router.get("/find/:userId", getUser);
router.get("/all-users", getAllUser);
router.put("/", updateUser);
router.get("/club-list", getUserList);

export default router;

// test the users route
// router.get("/test", testUsersRoute);