import "./postview.scss";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { makeRequest } from "../../request";
import Post from "../../components/posts/post/Post";

const PostView = ({ socket }) => {

    const postId = useLocation().pathname.split("/")[2];

    // fetch user info
    const { isLoading: postLoading, error: postError, data: postData } = useQuery(["post", postId], async () => {
        try {
            const res = await makeRequest.get("/posts/post/" + postId);
            return res.data;
        } catch (error) {
            alert(error.response.data);
            throw error; // Propagate the error for proper error handling
        }
    });

    console.log(postData)

    return (
        <div className="post-view">
            <Post post={postData} socket={socket} />
        </div>
    )
}

export default PostView;