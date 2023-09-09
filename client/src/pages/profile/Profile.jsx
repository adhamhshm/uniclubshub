import "./profile.scss";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { makeRequest } from "../../request";
import Posts from "../../components/posts/Posts";

import MoreIcon from '@mui/icons-material/MoreHoriz';
import UpdateProfile from "../../components/updateProfile/UpdateProfile";

const Profile = () => {

    const [openUpdateBox, setOpenUpdateBox] = useState(false);
    const { currentUser } = useContext(AuthContext);
    const userId = parseInt(useLocation().pathname.split("/")[2]);

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
            <div className="images">
                <img src={"/upload/" + data?.coverPhoto} alt="cover" className="cover" />
                <img src={"/upload/" + data?.profilePhoto} alt="profile" className="profilePhoto" />
            </div>
            <div className="profileContainer">
                <div className="userInfo">
                    <div className="left">
                        <span>Test</span>
                    </div>
                    <div className="center">
                        <span>{data?.name}</span>
                        <div className="info">
                            <div className="item">
                                {userId === currentUser.id 
                                    ? <button onClick={() => setOpenUpdateBox(true)}>Update</button>
                                    : <button onClick={handleFollow} >{followRelationData?.includes(currentUser.id) ? "Following" : "Follow"}</button>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="right">
                        <MoreIcon />
                    </div>
                </div>
            </div>
            <div className="profilePosts">
                <Posts userId={userId} />
            </div>
            {openUpdateBox && <UpdateProfile setOpenUpdateBox={setOpenUpdateBox} user={data} />}
        </div>
    )
}

export default Profile;