import "./comments.scss";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../request";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import SendIcon from '@mui/icons-material/Send';

const Comments = ({ post, socket }) => {

    const { currentUser } = useContext(AuthContext);
    const [description, setDescription] = useState("");
    // access the client
    const queryClient = useQueryClient()

    const { isLoading, error, data } = useQuery(["comments"], () => 
        makeRequest.get("/comments?postId=" + post.id)
        .then((res) => {
            const fetchedComments = res.data;
            return fetchedComments;
        })
    )

    // Adding comment mutations
    const addCommentMutation = useMutation((newComment) => {
        return makeRequest.post("/comments", newComment);
    }, 
    {
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: "comments" })
        },
    })

    // Adding info to activities
    const addActivitiesMutation = useMutation((activityInfo) => {
        return makeRequest.post("/activities", activityInfo);
    }, 
    {
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: "activities" })
        },
    })

    const handleSend = async (e) => {
        e.preventDefault();
        if (!description) {
            return alert("Invalid request.")
        };
        handleNotification("comment");
        addCommentMutation.mutate({ description, postId: post.id });
        setDescription("");
        addActivityInfo();
        
    };

    const addActivityInfo = async () => {
        addActivitiesMutation.mutate({ receiverUserId: post.userId, postId: post.id, senderUserId: currentUser.id, activityType: "comment" });
    };

    const handleNotification = (activityType) => {
        // Send the notification data to the server
        socket?.emit("sendNotification" , {
            senderUserId: currentUser.id,
            receiverUserId: post.userId,
            activityType,
        })
    };

    return (
        <div className="comments">
            <div className="write-comment-container">
                <img src={currentUser.profilePhoto ? 
                          currentUser.profilePhoto : 
                          (currentUser.role === "club" ? "/default/default-club-image.png" : "/default/default-participant-image.png")}  
                     alt="photo"
                />
                <textarea 
                    type="text" 
                    rows={2} 
                    placeholder="Write a comment..." 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <div className="send-icon">
                    <SendIcon onClick={handleSend} />
                </div>
            </div>
            {isLoading
                ? "Loading..."
                : error
                ? "Something went wrong."
                : data.map((comment) => {
                    return (
                        <div className="comment-container" key={comment?.id}>
                            <img src={comment.profilePhoto ? 
                                     comment.profilePhoto : 
                                     (comment.userId.includes("C") ? "/default/default-club-image.png" : "/default/default-participant-image.png")}   
                            />
                            <div className="comment-user-info">
                                <span>{comment.name}</span>
                                <p>{comment.description}</p>
                            </div>
                            <span className="comment-date">{moment(comment?.createdAt).fromNow()}</span>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default Comments;