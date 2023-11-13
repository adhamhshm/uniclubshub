import express from "express";
import { getPosts, addPost, deletePost, getSearchedPosts, getPostsByYear, getSinglePost, getPostsNumber } from "../controllers/posts-controller.js";

const router = express.Router();

router.get("/", getPosts);
router.get("/explore", getSearchedPosts);
router.get("/year", getPostsByYear);
router.get("/post/:id", getSinglePost);
router.get("/number", getPostsNumber);
router.post("/", addPost);
router.delete("/:id", deletePost);

export default router;