import express from "express";
import { getFollowRelation, addFollowRelation, deleteFollowRelation, getFollowRelationOfParticipant, getFollowersCount } from "../controllers/followRelations-controller.js";

const router = express.Router();

router.get("/", getFollowRelation);
router.get("/participant", getFollowRelationOfParticipant);
router.get("/followers", getFollowersCount);
router.post("/", addFollowRelation);
router.delete("/", deleteFollowRelation);

export default router;