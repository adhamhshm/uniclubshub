import "./participantprofile.scss";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/authContext";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { makeRequest } from "../../request";
import UpdateProfile from "../../components/updateProfile/UpdateProfile";
import LoadingSpinner from "../../components/loadingspinner/LoadingSpinner";

const ParticipantProfile = () => {

    const navigate = useNavigate();
    const [openUpdateBox, setOpenUpdateBox] = useState(false);
    const { currentUser } = useContext(AuthContext);
    const userId = useLocation().pathname.split("/")[3];

    const isCurrentUser = currentUser?.id === userId;

    // fetch user info
    const { isLoading: profileLoading, error: profileError, data: profileData } = useQuery(["user"], () => {
        return makeRequest.get("/participants/find/" + userId)
        .then((res) => res.data)
        .catch((error) => {
            throw error; // Propagate the error for proper error handling
        })
    });

    useEffect(() => {
        // If the user is not authorized to access this profile, navigate to an error page
        if (!isCurrentUser) {
            navigate("/unauthorized"); // Replace with the actual URL of your unauthorized page
        }
    }, [isCurrentUser]);

    return (
        <div className="participant-profile">
            {profileLoading ? ( <LoadingSpinner /> ) :
             profileError ? ( <LoadingSpinner /> ) :
             (
                <>
                    <div className="participant-profile-container">
                        <div className="participant-images">
                            <img 
                                src={profileData?.profilePhoto ? profileData.profilePhoto : "/default/default-participant-image.webp"} 
                                alt="profile" 
                                className="participant-profile-photo" 
                            />
                        </div>
                        <div className="participant-details">
                            <div className="participant-name">
                                <span>{profileData?.name}</span>
                            </div>
                            <div className="participant-bio">
                                <span>Student ID: {profileData?.id}</span>
                                <span>Email: {profileData?.email}</span>
                                <span>Phone: {profileData?.phoneNumber}</span>
                            </div>
                        </div>
                        <div className="participant-button">
                            {userId === currentUser?.id && <button onClick={() => setOpenUpdateBox(true)}>Update</button>}
                        </div>
                    </div>
                    {openUpdateBox && <UpdateProfile setOpenUpdateBox={setOpenUpdateBox} user={profileData} />}
                </>
             )
             }
        </div>
    )
}

export default ParticipantProfile;