import express from "express";
import { addCommittee, deleteCommittee, editCommittee, getCommittees } from "../controllers/committees-controller.js";

const router = express.Router();

router.get("/:userId", getCommittees);
router.post("/", addCommittee);
router.delete("/", deleteCommittee);
router.put("/", editCommittee);

export default router;