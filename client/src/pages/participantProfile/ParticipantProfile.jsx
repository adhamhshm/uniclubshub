import "./participantprofile.scss";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/authContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { makeRequest } from "../../request";

import UpdateProfile from "../../components/updateProfile/UpdateProfile";

const ParticipantProfile = () => {

    const navigate = useNavigate();

    const [openUpdateBox, setOpenUpdateBox] = useState(false);
    const { currentUser } = useContext(AuthContext);
    const userId = useLocation().pathname.split("/")[3];

    const isCurrentUser = currentUser.id === userId;

    // if user trying to look at another account, automatically navigate back to its own profile
    // if (currentUser.id !== userId) {
    //     window.location.reload();
    //     navigate(`/profile/participant/${currentUser.id}`);
    // };

    // fetch user info
    const { isLoading, error, data } = useQuery(["user"], () => 
        makeRequest.get("/participants/find/" + userId)
        .then((res) => {
            return res.data;
        })
    );

    useEffect(() => {
        // If the user is not authorized to access this profile, navigate to an error page
        if (!isCurrentUser) {
            navigate("/unauthorized"); // Replace with the actual URL of your unauthorized page
        }
    }, [isCurrentUser, navigate]);

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
        mutation.mutate(followRelationData.includes(currentUser.username));
    };

    return (
        <div className="participant-profile">
            <div className="participant-images">
                {/* <img src={"/upload/" + data?.coverPhoto} alt="cover" className="cover" /> */}
                <img src={"/upload/" + data?.profilePhoto} alt="profile" className="participant-profilePhoto" />
            </div>
            <div className="participant-profileContainer">
                <div className="participant-userInfo">
                    <div className="participant-center">
                        <span>{data?.name}</span>
                        <div className="participant-bio">
                            <span>Test</span>
                        </div>
                        <div className="participant-info">
                            <div className="participant-item">
                                {userId.includes(currentUser.id) 
                                    ? <button onClick={() => setOpenUpdateBox(true)}>Update</button>
                                    : null
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {openUpdateBox && <UpdateProfile setOpenUpdateBox={setOpenUpdateBox} user={data} />}
        </div>
    )
}

export default ParticipantProfile;