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

    // fetch user info
    const { isLoading, error, data } = useQuery(["user", userId], () => {
        return makeRequest.get("/users/find/" + userId)
        .then((res) => res.data )
        .catch((error) => {
            navigate("/unauthorized")
            throw error; // Propagate the error for proper error handling
        });
    });

    // fetch user follow relations
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

    const addFollowActivityInfo = async () => {
        addActivitiesMutation.mutate({ receiverUserId: userId, postId: "n/a", senderUserId: currentUser.id, activityType: "follow" });
    };

    const removeFollowActivityInfo = async () => {
        await makeRequest.delete("/activities/unfollow" , { data : { receiverUserId: userId, senderUserId: currentUser.id, activityType: "follow" }});
    };

    const handleFollow = () => {
        followUserMutation.mutate(followRelationData.includes(currentUser.id));
    };

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
            <div className="profile-container">
                <div className="images">
                    <img 
                        src={data?.profilePhoto ? data.profilePhoto : "/default/default-club-image.png"} 
                        alt="profile" 
                        className="profile-photo" 
                    />
                </div>
                <div className="details">
                    <div className="name">
                        <span>{data?.name}</span>
                    </div>
                    <div className="engagement-number">
                        <span>10 Followers</span>
                        <span> | </span>
                        <span>10 Posts</span>
                    </div>
                    <div className="bio">
                        <span>{data?.bio}</span>
                        <span>Email: {data?.email}</span>
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
            {openUpdateBox && <UpdateProfile setOpenUpdateBox={setOpenUpdateBox} user={data} />}
        </div>
    )
}

export default Profile;