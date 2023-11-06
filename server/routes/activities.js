import express from "express";
import { addActivities, deleteActivities, getActivitiesClubUser } from "../controllers/activities-controller.js";

const router = express.Router();

router.get("/", getActivitiesClubUser);
router.post("/", addActivities);
router.delete("/", deleteActivities);

export default router;