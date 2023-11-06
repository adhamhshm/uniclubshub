import express from "express";
import { getFollowRelation, addFollowRelation, deleteFollowRelation, getFollowRelationOfParticipant } from "../controllers/followRelations-controller.js";

const router = express.Router();

router.get("/", getFollowRelation);
router.get("/participant", getFollowRelationOfParticipant);
router.post("/", addFollowRelation);
router.delete("/", deleteFollowRelation);

export default router;