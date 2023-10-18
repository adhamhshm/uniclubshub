import "./post.scss";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import Comments from "../../comments/Comments";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../../request";
import { AuthContext } from "../../../context/authContext";

import MoreIcon from '@mui/icons-material/MoreHoriz';
import NoFillLikeIcon from '@mui/icons-material/FavoriteBorder';
import FillLikeIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/InsertCommentOutlined';
import ShareIcon from '@mui/icons-material/ShareOutlined';

const Post = ({ post }) => {

    const [commentOpen, setCommentOpen] = useState(false);
    const [openMenu, setMenuOpen] = useState(false);
    const { currentUser } = useContext(AuthContext);

    const { isLoading, error, data } = useQuery(["likes", post.id], () => 
        makeRequest.get("/likes?postId=" + post.id)
        .then((res) => {
            return res.data;
        })
    );

    // access the client
    const queryClient = useQueryClient();
    // Mutations
    const mutation = useMutation((liked) => {
        if (liked) {
            return makeRequest.delete("/likes?postId=" + post.id);
        }
        else {
            return makeRequest.post("/likes", { postId: post.id });
        }
    }, 
    {
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: "likes" })
        },
    })

    const deleteMutation = useMutation((postId) => {
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

    const handleLike = () => {
        mutation.mutate(data.includes(currentUser.id));
    };

    const handleDelete = () => {
        deleteMutation.mutate(post.id);
    }

    return (
        <div className="post">
           <div className="container">
                <div className="user">
                    <div className="userInfo">
                        <img src={"/upload/" + post.profilePhoto} alt={post.name} />
                        <div className="details">
                            <Link to={`/profile/${post.userId}`} style={{ textDecoration: "none", color: "inherit" }} onClick={() => window.scrollTo({top: 0, behavior: "smooth"})} >
                                <span className="username">{post.name}</span>
                            </Link>
                            <span className="date">{moment(post.createdAt).fromNow()}</span>
                        </div>
                    </div>
                    <MoreIcon style={{ cursor: "pointer" }} onClick={() => setMenuOpen(!openMenu)} />
                    {openMenu && post.userId === currentUser.id && <button onClick={handleDelete}>Delete</button>}
                </div>
                <div className="content">
                    <p>{post.description}</p>
                    {post.image && <img src={"../upload/" + post.image} alt="post" />}
                </div>
                <div className="info">
                    <div className="item">
                    {currentUser.role === "participant" ? (
                        isLoading ? "Loading..." : 
                        error ? "Something went wrong" : 
                        data === undefined ? "Likes" : 
                        (
                            data.includes(currentUser.id)
                                ? <FillLikeIcon style={{ color: "red" }} onClick={handleLike} />
                                : <NoFillLikeIcon onClick={handleLike} />
                        )
                    ) : (
                        /* For users with a role other than "participant" (e.g., "club role") */
                        <NoFillLikeIcon />
                    )}
                        {data !== undefined && `${data.length} Likes`}   
                    </div>
                    <div className="item" onClick={() => {setCommentOpen(!commentOpen)}}>
                        <CommentIcon />
                        Comment
                    </div>
                    <div className="item">
                        <ShareIcon />
                        Share
                    </div>
                </div>
                {commentOpen && <Comments postId={post.id} />}
           </div>
        </div>
    )
}

export default Post;