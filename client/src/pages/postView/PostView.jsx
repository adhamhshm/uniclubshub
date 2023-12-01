import "./postview.scss";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { makeRequest } from "../../request";
import Post from "../../components/posts/post/Post";
import LoadingSpinner from "../../components/loadingspinner/LoadingSpinner";

const PostView = ({ socket }) => {

    const navigate = useNavigate();
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

    return (
        <div className="post-view">
            <div className="post-view-container">
                <div className="title">
                    <div className="back-button-container"  onClick={() => navigate("/activities")}>
                        <img src="/default/back.svg" alt="back" className="back-icon"/>
                    </div>
                    <h3>{(postData && postData[0] && postData[0].title) || ""}</h3>
                </div>
                {postLoading ? ( <LoadingSpinner /> ) : 
                postError ? ( <LoadingSpinner /> ) : 
                postData.length !== 0 ? (
                    // If post data exists, display the Post component with the retrieved post data (data is in an array)
                    // Set viewComment to true so that it will show the post entirely
                    <Post post={postData[0]} socket={socket} viewComment={true} />
                ) : (
                    <div className="no-posts-container">
                        No post found. 
                    </div>
                )
                }
            </div>
        </div>
    )
}

export default PostView;