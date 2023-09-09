import express from "express";
import { getUser, updateUser } from "../controllers/user.js";

const router = express.Router();

// test the users route
// router.get("/test", testUsersRoute);

router.get("/find/:userId", getUser);
router.put("/", updateUser);

export default router;