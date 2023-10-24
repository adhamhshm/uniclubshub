import express from "express";
import { getPosts, addPost, deletePost, getSearchedPosts } from "../controllers/post.js";

const router = express.Router();

router.get("/", getPosts);
router.get("/explore", getSearchedPosts);
router.post("/", addPost);
router.delete("/:id", deletePost);

export default router;