import "./clublist.scss";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../request";
import { Link } from "react-router-dom";
import LoadingSpinner from "../loadingspinner/LoadingSpinner";

const ClubList = ({ currentUser, searchQuery, socket }) => {

    // Extract the current user's ID 
    const userId = currentUser?.id;
    // Initialize the query client
    const queryClient = useQueryClient();
    // Define a function to get data from the query cache
    const getFromCache = (key) => {
        return queryClient.getQueryData(key);
    };

    // Fetch user follow relations with clubs
    const { data: followRelationData } = useQuery(["followRelationOfParticipant", userId], () => {
        return makeRequest.get("/follow_relations/participant?followerUserId=" + userId)
        .then((res) => res.data )
        .catch((error) => {
            throw error; // Propagate the error for proper error handling
        })
    },
    {
        // Add caching options
        cacheTime: 3600 * 1000, // Cache for one hour
        staleTime: 1000 * 60, // Refetch data if it's stale (1 minute, adjust as needed)
    });

    // Use a query to fetch the list of clubs with optional search query
    const { isLoading: clubListLoading, error: clubListError, data: clubListData } = useQuery(["userlists", searchQuery], async () => {
        // Attempt to get data from the cache without making a network request.
        const cache = getFromCache(["userlists", searchQuery]);
        if (cache) {
            return cache;
        };
        // If the cache doesn't have the data, make a request to the server
        return makeRequest.get(`/users/club-list?from&userId=${userId}&searchQuery=${searchQuery}`)
        .then((res) => res.data)
        .catch((error) => {
            throw error; // Propagate the error for proper error handling
        })
    });

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

    // Define a mutation for following/unfollowing clubs
    const followUserMutation = useMutation((followClubData) => {
        const clubUserId = followClubData.clubUserId;
        if (followClubData.isFollowing) {
            // If already following, unfollow
            removeFollowActivityInfo(clubUserId);
            return makeRequest.delete("/follow_relations?userId=" + followClubData.clubUserId);
        }
        else {
            handleNotification("follow", clubUserId);
            // If not following, follow
            addFollowActivityInfo(clubUserId);
            return makeRequest.post("/follow_relations", { userId: followClubData.clubUserId });
        }
    }, 
    {
        onSuccess: () => {
            // Invalidate and refetch the followRelationOfParticipant query
            queryClient.invalidateQueries({ queryKey: "followRelationOfParticipant" })
        },
    });

    const addFollowActivityInfo = async (receiverClubUserId) => {
        addActivitiesMutation.mutate({ receiverUserId: receiverClubUserId, postId: "n/a", senderUserId: currentUser?.id, activityType: "follow" });
    };

    const removeFollowActivityInfo = async (receiverClubUserId) => {
        await makeRequest.delete("/activities/unfollow" , { data : { receiverUserId: receiverClubUserId, senderUserId: currentUser?.id, activityType: "follow" }});
    };

    // Function to handle club follow/unfollow
    const handleFollow = (isFollowing, clubUserId) => {
        followUserMutation.mutate({ isFollowing, clubUserId });
    };

    const handleNotification = (activityType, receiverClubUserId) => {
        // Send the notification data to the server
        socket?.emit("sendNotification" , {
            senderUserId: currentUser.id,
            receiverUserId: receiverClubUserId,
            activityType,
        })
    };

    return (
        <div className="club-list">
            <div className="user-list-container">
                {clubListLoading ? ( <LoadingSpinner /> ) : 
                    clubListError ? ( <LoadingSpinner /> ) : 
                    !clubListData || clubListData.length === 0 && searchQuery === "" ? ( "No clubs." ) :
                    clubListData.length !== 0 ? (
                        clubListData.map((clubUser) => {
                            // Check if the clubUser is being followed
                            const isFollowing = followRelationData?.some(item => item.followedUserId === String(clubUser.id));
                            return (
                                <div className="user-list" key={clubUser.id}>
                                    <div className="user-info">
                                        <img src={clubUser.profilePhoto ? clubUser.profilePhoto : "/default/default-club-image.png"} alt={clubUser.name} />
                                        <Link to={`/profile/${clubUser.id}`} style={{ textDecoration: "none"}}>
                                            <span>{clubUser.name}</span>
                                        </Link>
                                    </div>
                                    <div className="buttons">
                                        <button 
                                            className={isFollowing ? "following-button" : ""} 
                                            onClick={() => {handleFollow(isFollowing, clubUser.id)}}
                                        >
                                            {isFollowing ? "Following" : "Follow"}
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        ( `"${searchQuery}" not found.` )
                    )
                }
            </div>
        </div>
    )
}

export default ClubList;