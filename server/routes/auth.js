import express from "express";
import { signin, signup, signout } from "../controllers/auth.js";

const router = express.Router();

router.post("/signin", signin);
router.post("/signup", signup);
router.post("/signout", signout);

export default router;