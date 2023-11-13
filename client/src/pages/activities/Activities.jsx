import "./activities.scss";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../context/authContext";
import { useContext, useEffect, useState } from "react";
import { makeRequest } from "../../request";
import { Link } from "react-router-dom";

const Activities = () => {

    const { currentUser } = useContext(AuthContext);
    const [finishedReading, setFinishedReading] = useState(false);

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
        }
    );

    const markAsRead = (activity) => {
        if (activity.hasRead === "no") {
            // Mark the activity as read and update it in the database
            updateHasReadMutation.mutate({ activityId: activity.id, hasRead: "yes"});
        }
    };

    useEffect(() => {
        if (activitiesData && !finishedReading) {
            activitiesData.forEach(activity => {
                if (activity.hasRead === 'no') {
                    markAsRead(activity);
                }
            });
        }
        setFinishedReading(true);

    }, [activitiesData, finishedReading]); // Monitor changes in activitiesData and finishedReading

    console.log(activitiesData);

    return (
        <div className="activities">
            <div className="activities-container">
                <h2>Account activities.</h2>
                <div className="activities-list">
                    {activitiesLoading ? ( "Loading...") : 
                     activitiesError ? ( "Something went wrong...") : 
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
                                                    ? "default/comment.png"
                                                    : activity.activityType === "like"
                                                    ? "default/heart.png"
                                                    : activity.activityType === "register"
                                                    ? "default/register.png"
                                                    : "default/follow.png"
                                            }
                                            alt="icon"
                                        />
                                    </div>
                                    <div className="activity-label">
                                        <img
                                            src={activity.senderProfilePhoto ? activity.senderProfilePhoto :
                                                 activity.senderUserId.length === 10 ? "/default/default-participant-image.png" : "/default/default-club-image.png"}
                                            alt="sender profile photo"
                                        />
                                        <span>
                                            {activity.senderName}
                                            <span>{activity.activityDescription}</span>
                                            <Link to={`/postview/${activity.postId}`} style={{ textDecoration: "none"}}>
                                                <span className="post-link">{activity.activityType !== "follow" ? activity.postTitle : ""}</span>
                                            </Link>
                                        </span>
                                    </div>
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