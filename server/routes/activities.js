import express from "express";
import { addActivities, removeLikeActivities, getActivitiesClubUser, removeFollowActivities } from "../controllers/activities-controller.js";

const router = express.Router();

router.get("/", getActivitiesClubUser);
router.post("/", addActivities);
router.delete("/unlike", removeLikeActivities);
router.delete("/unfollow", removeFollowActivities);

export default router;