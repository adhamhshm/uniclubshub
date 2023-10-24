import express from "express";
import { getIsRegistered, registerEventPost } from "../controllers/registerEvent.js";

const router = express.Router();

router.get("/", getIsRegistered)
router.post("/register", registerEventPost);

export default router;