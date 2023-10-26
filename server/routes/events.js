import express from "express";
import { getEventParticipants, getIsRegistered, registerEventPost } from "../controllers/event.js";

const router = express.Router();

router.get("/", getIsRegistered)
router.post("/register", registerEventPost);
router.get("/participants", getEventParticipants);

export default router;