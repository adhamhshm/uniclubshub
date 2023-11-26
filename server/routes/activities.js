import express from "express";
import { addActivities, removeLikeActivities, getActivitiesUser, removeFollowActivities, markAsRead, deletePostActivities } from "../controllers/activities-controller.js";

const router = express.Router();

router.get("/", getActivitiesUser);
router.post("/", addActivities);
router.delete("/post", deletePostActivities);
router.delete("/unlike", removeLikeActivities);
router.delete("/unfollow", removeFollowActivities);
router.patch("/read", markAsRead);

export default router;