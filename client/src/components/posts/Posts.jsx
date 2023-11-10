import "./posts.scss";
import Post from "./post/Post";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../request.js";

// the userId may come from the profile of the user
const Posts = ({ userId, socket }) => {

    const { isLoading, error, data } = useQuery(["posts", userId], () => {
        return makeRequest.get("/posts?userId=" + userId)
        .then((res) => res.data)
        .catch((error) => {
            throw error; // Propagate the error for proper error handling
        })
    });

    return (
        <div className="posts">
            {isLoading ? ( "Loading..." ) : 
             error ? ( "Something went wrong...") : 
             data.length !== 0 ? (
                data.map((post) => {
                    return (
                        <Post post={post} key={post.id} socket={socket} />
                    )
                })
            ) : (
                <div className="no-posts-container">
                    No post found. 
                </div>
            )
            }
        </div>
    )
}

export default Posts;