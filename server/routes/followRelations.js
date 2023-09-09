import express from "express";
import { getFollowRelation, addFollowRelation, deleteFollowRelation } from "../controllers/followRelation.js";

const router = express.Router();

router.get("/", getFollowRelation);
router.post("/", addFollowRelation);
router.delete("/", deleteFollowRelation);

export default router;