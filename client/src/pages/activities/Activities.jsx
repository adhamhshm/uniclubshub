import { useQuery } from "@tanstack/react-query";
import "./activities.scss";
import { AuthContext } from "../../context/authContext";
import { useContext } from "react";
import { makeRequest } from "../../request";

const Activities = () => {

    const { currentUser } = useContext(AuthContext);

    const { isLoading: activitiesLoading, error: activitiesError, data: activitiesData } = useQuery(["activities", currentUser.id], async () => {
        return makeRequest.get("/activities?userId=" + currentUser.id)
        .then((res) => res.data)
        .catch((error) => {
            throw error; // Propagate the error for proper error handling
        })
    });

    console.log(activitiesData);

    return (
        <div className="activities">
            <div className="activities-container">
                <h2>Account activities.</h2>
                <div className="activities-list">
                    {activitiesLoading 
                        ? ( "Loading..." ) 
                        : activitiesError ? ( "Something went wrong...") 
                        : (
                            activitiesData.map((activity) => {
                                return (
                                    <div className="activity non-read" key={activity.id}>
                                        <div className="activity-icon">
                                            <img 
                                                src={activity.activityType === "comment" ? "default/comment.png" :
                                                     activity.activityType === "like" ? "default/heart.png" :
                                                     activity.activityType === "register" ? "default/register.png" :
                                                     "default/follow.png" 
                                                    }
                                                alt="icon"
                                            />
                                        </div>
                                        <div className="activity-label">
                                            <img 
                                                src={activity.participantProfilePhoto ? activity.participantProfilePhoto : "/default/default-participant-image.png"} 
                                                alt="user profile photo"
                                            />
                                            <span>
                                                {activity.participantName}
                                                <span>{activity.activityDescription}</span>
                                                {activity.activityType !== "follow" ? activity.postTitle : ""}
                                            </span>
                                        </div>
                                    </div>
                                )
                            })
                        )
                    }
                </div>
            </div>
        </div>
    )
};

export default Activities;