import express from "express";
import { addActivities, removeLikeActivities, getActivitiesClubUser, removeFollowActivities, markAsRead } from "../controllers/activities-controller.js";

const router = express.Router();

router.get("/", getActivitiesClubUser);
router.post("/", addActivities);
router.delete("/unlike", removeLikeActivities);
router.delete("/unfollow", removeFollowActivities);
router.patch("/read", markAsRead);

export default router;