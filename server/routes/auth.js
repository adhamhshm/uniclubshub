import express from "express";
import { signin, signup, signout, authorizeToken } from "../controllers/auth-controller.js";

const router = express.Router();

router.post("/signin", signin);
router.post("/signup", signup);
router.post("/signout", signout);
router.get("/authorizeToken", authorizeToken);

export default router;