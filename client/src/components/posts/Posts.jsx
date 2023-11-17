import "./posts.scss";
import Post from "./post/Post";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../request.js";
import LoadingSpinner from "../loadingspinner/LoadingSpinner.jsx";

// the userId may come from the profile of the user
const Posts = ({ userId, socket }) => {

    const { isLoading, error, data } = useQuery(["posts", userId], async () => {
        try {
            const res = await makeRequest.get("/posts?userId=" + userId);
            return res.data;
        } catch (error) {
            throw error; // Propagate the error for proper error handling
        }
    });

    return (
        <div className="posts">
            {isLoading ? ( <LoadingSpinner /> ) : 
             error ? ( <LoadingSpinner /> ) : 
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