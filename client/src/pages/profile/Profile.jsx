import "./profile.scss";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { makeRequest } from "../../request";
import Posts from "../../components/posts/Posts";

import UpdateProfile from "../../components/updateProfile/UpdateProfile";


const Profile = ({ socket }) => {

    const [openUpdateBox, setOpenUpdateBox] = useState(false);
    const { currentUser } = useContext(AuthContext);
    const userId = useLocation().pathname.split("/")[2];
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // Fetch user info
    const { isLoading: profileLoading, error: profileError, data: profileData } = useQuery(["user"], () => {
        return makeRequest.get("/users/find/" + userId)
        .then((res) => res.data)
        .catch((error) => {
            navigate("/unauthorized");
            throw error; // Propagate the error for proper error handling
        })
    });

    // Fetch the number of followers
    const { isLoading: followersLoading, error: followersError, data: followersData } = useQuery(["followers", userId], async () => {
        try {
            const res = await makeRequest.get("/follow_relations/followers?followedUserId=" + userId);
            return res.data;
        } catch (error) {
            throw error; // Propagate the error for proper error handling
        }
    });

    // Fetch the number of posts
    const { isLoading: postsNumLoading, error: postsNumError, data: postsNumData } = useQuery(["postsNum", userId], async () => {
        try {
            const res = await makeRequest.get("/posts/number?userId=" + userId);
            return res.data;
        } catch (error) {
            throw error; // Propagate the error for proper error handling
        }
    });

    // Fetch user follow relations
    const { data: followRelationData } = useQuery(["follow_relation", userId], () => 
        makeRequest.get("/follow_relations?followedUserId=" + userId)
        .then((res) => {
            return res.data;
        })
    );

    // Adding info to activities
    const addActivitiesMutation = useMutation((activityInfo) => {
        return makeRequest.post("/activities", activityInfo);
    }, 
    {
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: "activities" })
        },
    });

    // Mutations
    const followUserMutation = useMutation((following) => {
        if (following) {
            removeFollowActivityInfo();
            return makeRequest.delete("/follow_relations?userId=" + userId);
        }
        else {
            handleNotification("follow");
            addFollowActivityInfo();
            return makeRequest.post("/follow_relations", { userId });
        }
    }, 
    {
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: "follow_relation" })
        },
    });

    // Function to add follow activity
    const addFollowActivityInfo = async () => {
        addActivitiesMutation.mutate({ receiverUserId: userId, postId: "n/a", senderUserId: currentUser.id, activityType: "follow" });
    };

    // Function to delete follow activity
    const removeFollowActivityInfo = async () => {
        await makeRequest.delete("/activities/unfollow" , { data : { receiverUserId: userId, senderUserId: currentUser.id, activityType: "follow" }});
    };

    // Function to handle follow/unfollow relation
    const handleFollow = () => {
        followUserMutation.mutate(followRelationData.includes(currentUser.id));
    };

    // Function to handle notifications
    const handleNotification = (activityType) => {
        // Send the notification data to the server
        socket?.emit("sendNotification" , {
            senderUserId: currentUser.id,
            receiverUserId: userId,
            activityType,
        })
    };

    return (
        <div className="profile">
            {profileLoading ? ("Loading...") :
             profileError ? ("Something went wrong.") :
             (
                <>
                    <div className="profile-container">
                        <div className="images">
                            <img 
                                src={profileData?.profilePhoto ? profileData.profilePhoto : "/default/default-club-image.png"} 
                                alt="profile" 
                                className="profile-photo" 
                            />
                        </div>
                        <div className="details">
                            <div className="name">
                                <span>{profileData?.name}</span>
                            </div>
                            <div className="engagement-number">
                                <span>
                                    {
                                        followersLoading ? ("0. ") : 
                                        followersError ? ("0. ") :
                                        followersData !== 0 ? (`${followersData.followerCount} `) : ("0 ")
                                    }
                                    Followers
                                </span>
                                <span> | </span>
                                <span>
                                    {
                                        postsNumLoading ? ("0. ") : 
                                        postsNumError ? ("0. ") :
                                        postsNumData !== 0 ? (`${postsNumData.postsNumber} `) : ("0 ")
                                    }
                                    Posts
                                </span>
                            </div>
                            <div className="bio">
                                <span>{profileData?.bio}</span>
                                <span>Email: {profileData?.email}</span>
                            </div>
                        </div>
                        <div className="button">
                            {userId === currentUser?.id ? 
                            <button onClick={() => setOpenUpdateBox(true)}>Update</button> : 
                            currentUser?.role === "participant" &&
                            <button className={followRelationData?.includes(currentUser?.id) ? "following-button" : ""} onClick={handleFollow}> 
                                {followRelationData?.includes(currentUser?.id) ? "Following" : "Follow"}
                            </button>
                            }
                        </div>
                    </div>
                    <div className="profile-posts">
                        <Posts userId={userId} socket={socket} />
                    </div>
                    {openUpdateBox && <UpdateProfile setOpenUpdateBox={setOpenUpdateBox} user={profileData} />}
                </>
             ) 
             }
        </div>
    )
}

export default Profile;