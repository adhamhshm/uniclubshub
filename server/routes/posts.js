import express from "express";
import { getPosts, addPost, deletePost, getSearchedPosts, getPostsByYear } from "../controllers/posts-controller.js";

const router = express.Router();

router.get("/", getPosts);
router.get("/explore", getSearchedPosts);
router.get("/year", getPostsByYear);
router.post("/", addPost);
router.delete("/:id", deletePost);

export default router;