import "./post.scss";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../../request";
import { AuthContext } from "../../../context/authContext";
import moment from "moment";

import Comments from "../../comments/Comments";
import ConfirmBox from "../confirmbox/ConfirmBox";

import MoreIcon from '@mui/icons-material/MoreHoriz';
import NoFillLikeIcon from '@mui/icons-material/FavoriteBorder';
import FillLikeIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/InsertCommentOutlined';

const Post = ({ post, socket }) => {

    console.log("In post component: "+ post)

    // Access the client
    const queryClient = useQueryClient();

    const [commentOpen, setCommentOpen] = useState(false);
    const [openMenu, setMenuOpen] = useState(false);
    const [showPostModal, setShowPostModal] = useState(false);
    const { currentUser } = useContext(AuthContext);

    const { isLoading: likesLoading, error: likesError, data: likesData } = useQuery(["likes", post.id], () =>
        makeRequest.get(`/likes?postId=${post.id}`)
        .then((res) => res.data)
    );
      
    const { isLoading: commentsLoading, error: commentsError, data: commentsData } = useQuery(["comments", post.id], () =>
        makeRequest.get(`/comments?postId=${post.id}`)
        .then((res) => res.data)
    );

    const { isLoading: isRegisteredLoading, error: isRegisteredError, data: isRegisteredData } = useQuery(["registerEvents", post.id], () =>
        makeRequest.get(`/events?postId=${post.id}`)
        .then((res) => res.data)
    );

    // Like and unliked mutation
    const likePostMutation = useMutation(async (liked) => {
        if (liked) {
            deleteLikeActivityInfo();
            return makeRequest.delete("/likes?postId=" + post.id);
        }
        else {
            handleNotification("like");
            addLikeActivityInfo();
            return await makeRequest.post("/likes", { postId: post.id });
        }
    }, 
    {
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: "likes" })
        },
    })

    // Delete post mutation
    const deletePostMutation = useMutation((postId) => {
        if (postId) {
            return makeRequest.delete("/posts/" + postId);
        }
    }, 
    {
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: "posts" })
        },
    })

    // Adding info to activities mutation
    const addActivitiesMutation = useMutation((activityInfo) => {
        return makeRequest.post("/activities", activityInfo);
    }, 
    {
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: "activities" })
        },
    })

    const handleLike = () => {
        likePostMutation.mutate(likesData.includes(currentUser.id));
    };

    const handleDelete = async () => {
        deletePostMutation.mutate(post.id);
        await makeRequest.delete("/images/delete" , { data : { imageToBeDeleted: post.image }});
    };

    const addLikeActivityInfo = async () => {
        addActivitiesMutation.mutate({ receiverUserId: post.userId, postId: post.id, senderUserId: currentUser.id, activityType: "like" });
    };

    const deleteLikeActivityInfo = async () => {
        await makeRequest.delete("/activities/unlike" , { data : { postId: post.id, senderUserId: currentUser.id, activityType: "like" }});
    };

    // Function to render description with clickable links
    const renderDescription = (description) => {
        // Use a regular expression to find URLs in the description
        const urlRegex = /(https?:\/\/[^\s]+)/g;

        // Split the description by URLs and render links
        const parts = description.split(urlRegex);
        return parts.map((part, index) => {
            if (part.match(urlRegex)) {
                // Render links
                return (
                    <a
                        key={index}
                        href={part}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="url-description"
                    >
                        {part}
                    </a>
                );
            } else {
                // Render non-link text
                return <span key={index}>{part}</span>;
            }
        });
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
        <div className="post">
           <div className="post-container">
                <div className="user-container">
                    <div className="user-details">
                        {/* Post owner profile photo */}
                        <img src={post.profilePhoto ? post.profilePhoto : "/default/default-club-image.png"} alt={post.name} />
                        {/* Name of the owner and the date of post */}
                        <div className="user-info">
                            <Link to={`/profile/${post.userId}`} style={{ textDecoration: "none", color: "inherit" }} onClick={() => window.scrollTo({top: 0, behavior: "smooth"})} >
                                <span className="username">{post.name}</span>
                            </Link>
                            <span className="date">{moment(post.createdAt).fromNow()}</span>
                        </div>
                    </div>
                    {/* Icon can be clicked to open post menu */}
                    <MoreIcon style={{ cursor: "pointer" }} onClick={() => setMenuOpen(!openMenu)} />
                    {openMenu && post.userId === currentUser.id && <button onClick={handleDelete}>Delete</button>}
                </div>
                {/* The content of the post */}
                <div className="post-content-container">
                    <div className="post-content-container-description">
                        <h3>{post.title}</h3>
                        {renderDescription(post.description)}
                    </div>
                    {post.image && 
                        <div className="post-content-container-image">
                            {post.image && <img src={post.image} alt="post" />}
                        </div>
                    }
                </div>
                {/* Labels to interact with the post */}
                <div className="post-labels">
                    {/* Like functionality works only if the user is a participant */}
                    <div className="label">
                        {currentUser.role === "participant" ? (
                            likesLoading ? "Loading likes..." : 
                            likesError ? "Unable to find likes." : 
                            (
                                likesData.includes(currentUser.id)
                                    ? <FillLikeIcon style={{ color: "red" }} onClick={handleLike} />
                                    : <NoFillLikeIcon onClick={handleLike} />
                            )
                        ) : (
                            <NoFillLikeIcon />
                        )}
                        {likesData !== undefined && `${likesData.length}`}   
                    </div>
                    {/* Comment label */}
                    <div className="label" onClick={() => {setCommentOpen(!commentOpen)}}>
                        <CommentIcon/>
                        {commentsLoading ? "Loading comments..." :
                         commentsError ? "Unable to find comments." :
                         commentsData === undefined ? "Comment" : 
                         commentsData.length === 0 ? "Comment" :
                         `${commentsData.length} Comments`
                        }
                    </div>
                    {/* The button to register for an event is only for participant */}
                    {currentUser.role === "participant" ? 
                        (
                            // Fetch registered event data by the participant
                            <div className="label">
                                {isRegisteredLoading ? "Loading info..." :
                                 isRegisteredError ? "Cannot find info." : 
                                 isRegisteredData.includes(currentUser.id) ?
                                 (
                                    // If already registered, button is disabled
                                    <div className="register-button">
                                        <button className="disabled-register-button">
                                            Registered
                                        </button>
                                    </div>
                                 ) : (
                                    // Click the register button to confirm registration
                                    <div className="register-button">
                                        <button onClick={() => {setShowPostModal(true)}}>
                                            Register
                                        </button>
                                    </div>
                                 ) 
                                }
                            </div>
                        ) : (
                            null
                        )
                    }
                </div>
                {/* Display the PostModal when showPostModal is true, to confirm event registration */}
                {showPostModal && (
                    <ConfirmBox
                        postData={post}
                        currentUser={currentUser}
                        setShowPostModal={setShowPostModal}
                        socket={socket}
                    />
                )}
                {/* Display list of comments and comment functionality when the setCommentOpen is true */}
                {commentOpen && <Comments post={post} socket={socket} />}
           </div>
        </div>
    )
};

export default Post;