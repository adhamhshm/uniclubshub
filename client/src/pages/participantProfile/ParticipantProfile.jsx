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

    const isCurrentUser = currentUser?.id === userId;

    // fetch user info
    const { isLoading, error, data } = useQuery(["user", userId], () => 
        makeRequest.get("/participants/find/" + userId)
        .then((res) => {
            return res.data;
        })
    );

    // useEffect(() => {
    //     // If the user is not authorized to access this profile, navigate to an error page
    //     if (!isCurrentUser) {
    //         navigate("/unauthorized"); // Replace with the actual URL of your unauthorized page
    //     }
    // }, [isCurrentUser]);

    return (
        <div className="participant-profile">
            <div className="participant-profile-container">
                <div className="participant-images">
                    <img 
                        src={data?.profilePhoto ? data.profilePhoto : "/default/default-participant-image.png"} 
                        alt="profile" 
                        className="participant-profile-photo" 
                    />
                </div>
                <div className="participant-details">
                    <div className="participant-name">
                        <span>{data?.name}</span>
                    </div>
                    <div className="participant-bio">
                        <span>Student ID: {data?.id}</span>
                        <span>Email: {data?.email}</span>
                        <span>Phone: {data?.phoneNumber}</span>
                    </div>
                </div>
                <div className="participant-button">
                    {userId === currentUser?.id && <button onClick={() => setOpenUpdateBox(true)}>Update</button>}
                </div>
            </div>
            {openUpdateBox && <UpdateProfile setOpenUpdateBox={setOpenUpdateBox} user={data} />}
        </div>
    )
}

export default ParticipantProfile;