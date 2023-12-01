import "./comments.scss";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../request";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import LoadingSpinner from "../loadingspinner/LoadingSpinner";

const Comments = ({ post, socket }) => {

    const { currentUser } = useContext(AuthContext);
    const [description, setDescription] = useState("");
    // access the client
    const queryClient = useQueryClient()

    const { isLoading, error, data } = useQuery(["comments"], () => 
        makeRequest.get("/comments?postId=" + post.id)
        .then((res) => {
            return res.data;
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
    });

    // Adding info to activities
    const addActivitiesMutation = useMutation((activityInfo) => {
        return makeRequest.post("/activities", activityInfo);
    });

    const handleSend = async (e) => {
        e.preventDefault();
        if (!description) {
            return alert("Invalid request.")
        };
        handleNotification("comment");
        addCommentMutation.mutate({ description, postId: post.id });
        setDescription("");
    };

    const addActivityInfo = async (receiverUserId, postId, senderUserId, activityType) => {
        addActivitiesMutation.mutate({ receiverUserId, postId, senderUserId, activityType });
    };


    const getCommenters = () => {
        // Array to hold unique commenter IDs
        const uniqueUsers = [];
        // Iterating through comments to find unique commenters
        data.forEach(comment => {
            // Checks if the commenter is unique and isn't the post owner or the current user
            if (!uniqueUsers.includes(comment.userId) && comment.userId !== currentUser.id && comment.userId !== post.userId) {
                // Add the unique commenter ID to the array
                uniqueUsers.push(comment.userId);
            }
        })
        return uniqueUsers;
    }

    const handleNotification = (activityType) => {
        // Send the notification to the owner of post
        if (currentUser.id !== post.userId) {
            socket?.emit("sendNotification" , {
                senderUserId: currentUser.id,
                receiverUserId: post.userId,
                activityType,
            });
            addActivityInfo(post.userId, post.id, currentUser.id, "comment");
        }

        // Retrieve an array of unique commenters
        const commenters = getCommenters();
        // Send the notification to each unique commenter
        commenters.forEach(commenter => {
            socket?.emit("sendNotification", {
                senderUserId: currentUser.id,
                receiverUserId: commenter,
                activityType,
            });
            addActivityInfo(commenter, post.id, currentUser.id, "comment");
        });
    };

    return (
        <div className="comments">
            <div className="write-comment-container">
                <img src={currentUser.profilePhoto ? 
                          currentUser.profilePhoto : 
                          (currentUser.role === "club" ? "/default/default-club-image.webp" : "/default/default-participant-image.webp")}  
                     alt="photo"
                     id="user-photo-comment"
                />
                <textarea 
                    type="text" 
                    name="description"
                    rows={2} 
                    placeholder="Write a comment..." 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <div className="send-icon-container">
                    <img id="send-icon" src="/default/send.svg" alt="send" onClick={handleSend} />
                </div>
            </div>
            {isLoading
                ? ( <LoadingSpinner /> )
                : error
                ? ( <LoadingSpinner /> )
                : data.map((comment) => {
                    return (
                        <div className="comment-container" key={comment?.id}>
                            <img src={comment.profilePhoto ? 
                                     comment.profilePhoto : 
                                     (comment.userId.includes("C") ? "/default/default-club-image.webp" : "/default/default-participant-image.webp")
                                }
                                alt="user photo"
                                id="user-photo-comment"   
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