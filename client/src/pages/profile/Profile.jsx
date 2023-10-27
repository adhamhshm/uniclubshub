import "./profile.scss";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { makeRequest } from "../../request";
import Posts from "../../components/posts/Posts";

import UpdateProfile from "../../components/updateProfile/UpdateProfile";


const Profile = () => {

    const [openUpdateBox, setOpenUpdateBox] = useState(false);
    const { currentUser } = useContext(AuthContext);
    //const userId = currentUser.id;
    const userId = useLocation().pathname.split("/")[2];

    // fetch user info
    const { isLoading, error, data } = useQuery(["user"], () => 
        makeRequest.get("/users/find/" + userId)
        .then((res) => {
            return res.data;
        })
    );

    // fetch user follow relations
    const { data: followRelationData } = useQuery(["follow_relation"], () => 
        makeRequest.get("/follow_relations?followedUserId=" + userId)
        .then((res) => {
            return res.data;
        })
    );

    // access the client
    const queryClient = useQueryClient();
    // Mutations
    const mutation = useMutation((following) => {
        if (following) {
            return makeRequest.delete("/follow_relations?userId=" + userId);
        }
        else {
            return makeRequest.post("/follow_relations", { userId });
        }
    }, 
    {
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: "follow_relation" })
        },
    })

    const handleFollow = () => {
        mutation.mutate(followRelationData.includes(currentUser.id));
    };

    return (
        <div className="profile">
            <div className="images-container">
                <img 
                    className="cover-photo" 
                    src={"/upload/" + data?.coverPhoto} 
                    alt="cover" 
                    
                />
                <img 
                    className="profile-photo" 
                    src={data?.profilePhoto ? "/upload/" + data?.profilePhoto : "/default/default-club-image.png"} 
                    alt="profile" 
                />
            </div>
            <div className="profile-info-container">
                <div className="user-info">
                    <div className="center">
                        <div className="main-name">
                            <span>{data?.name}</span>
                        </div>
                        <div className="bio">
                            <span>{data?.bio}</span>
                        </div>
                        <div className="button-container">
                            {userId.includes(currentUser.id) 
                                ? <button onClick={() => setOpenUpdateBox(true)}>Update</button>
                                : <button onClick={handleFollow} >{followRelationData?.includes(currentUser.id) ? "Following" : "Follow"}</button>
                            }
                        </div>
                    </div>
                    {/* <div className="right">
                        <MoreIcon />
                    </div> */}
                </div>
            </div>
            <div className="profile-posts">
                <Posts userId={userId} />
            </div>
            {openUpdateBox && <UpdateProfile setOpenUpdateBox={setOpenUpdateBox} user={data} />}
        </div>
    )
}

export default Profile;