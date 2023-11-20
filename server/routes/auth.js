import express from "express";
import { signin, signup, signout, authorizeToken, sendResetPasswordEmailRequest, resetPassword } from "../controllers/auth-controller.js";

const router = express.Router();

router.post("/signin", signin);
router.post("/signup", signup);
router.post("/signout", signout);
router.get("/authorizeToken", authorizeToken);
router.post("/email", sendResetPasswordEmailRequest);
router.put("/reset-password", resetPassword)

export default router;