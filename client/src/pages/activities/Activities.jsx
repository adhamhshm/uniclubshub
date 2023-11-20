import "./activities.scss";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../context/authContext";
import { useContext, useRef, useState } from "react";
import { makeRequest } from "../../request";
import { Link } from "react-router-dom";
import LoadingSpinner from "../../components/loadingspinner/LoadingSpinner";

const Activities = () => {

    const queryClient = useQueryClient();
    const { currentUser } = useContext(AuthContext);
    const [openMenu, setMenuOpen] = useState(null);
    const menuRef = useRef(null);

    const { isLoading: activitiesLoading, error: activitiesError, data: activitiesData } = useQuery(["activities"], () => {
        return makeRequest.get("/activities?userId=" + currentUser?.id)
        .then((res) => res.data)
        .catch((error) => {
            alert(error.response.data)
            throw error; // Propagate the error for proper error handling
        })
    });

    const updateHasReadMutation = useMutation(async (activityHasReadData) => {
        // Send a PATCH request to update the hasRead property in the database
        await makeRequest.patch(`/activities/read`, activityHasReadData);
    },
    {
        onSuccess: () => {
            queryClient.invalidateQueries(["activities"]);
        },
    }
    );

    const markAsRead = (activity) => {
        if (activity.hasRead === "no") {
            // Mark the activity as read and update it in the database
            updateHasReadMutation.mutate({ activityId: activity.id, hasRead: "yes"});
        }
        setMenuOpen(null);
    };

    // Function to handle clicks outside the modal
    const handleOutsideClick = (event) => {
        // Check if the menuRef exists and if the clicked element is outside the modal
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            // If the click is outside, close the modal
            setMenuOpen(false);
        }
    };

    // Attach a "mousedown" event listener to the document to call handleOutsideClick
    document.addEventListener("mousedown", handleOutsideClick);

    return (
        <div className="activities">
            <div className="activities-container">
                <div className="activities-subject">
                    <h2>Account activities.</h2>
                </div>
                <div className="activities-list">
                    {activitiesLoading ? ( <LoadingSpinner /> ) : 
                     activitiesError ? ( <LoadingSpinner /> ) : 
                     activitiesData.length !== 0 ? 
                     (
                        activitiesData.map((activity) => {
                            return (
                                <div 
                                    className={`activity ${activity.hasRead === "yes" ? "read" : "non-read"}`} 
                                    key={activity.id} 
                                >
                                    <div className="activity-icon">
                                        <img
                                            src={
                                                activity.activityType === "comment"
                                                    ? "/default/comment-gradient.webp"
                                                    : activity.activityType === "like"
                                                    ? "/default/heart-gradient.webp"
                                                    : activity.activityType === "register"
                                                    ? "/default/register-gradient.webp"
                                                    : "/default/follow-gradient.webp"
                                            }
                                            alt="icon"
                                        />
                                    </div>
                                    <div className="activity-label">
                                        <img
                                            src={activity.senderProfilePhoto ? activity.senderProfilePhoto :
                                                 activity.senderUserId.length === 10 ? "/default/default-participant-image.webp" : "/default/default-club-image.webp"}
                                            alt="sender profile photo"
                                        />
                                        <span>
                                            {activity.senderName}
                                            <span>{activity.activityDescription}</span>
                                            <Link to={`/postview/${activity.postId}`} style={{ textDecoration: "none"}}>
                                                <span className="post-link" onClick={() => {markAsRead(activity)}}>
                                                    {activity.activityType !== "follow" ? activity.postTitle : ""}
                                                </span>
                                            </Link>
                                        </span>
                                    </div>
                                    <div className="menu-icon-container">
                                        <img src="/default/menu.svg" alt="menu" onClick={() => setMenuOpen(prevId => (prevId === activity.id ? null : activity.id))} />
                                    </div>
                                    {
                                        openMenu === activity.id &&
                                        <div className="activities-option-menu" ref={menuRef}>
                                            <div className="option-list" onClick={() => {markAsRead(activity)}} >
                                                <img src="/default/read.svg" alt="read" /> Mark as read
                                            </div>
                                        </div> 
                                    }
                                </div>
                            );
                        })
                    ) : (
                        <div>
                            No activities at the moment.
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
};

export default Activities;