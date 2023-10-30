import "./clublist.scss";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../request";
import { Link } from "react-router-dom";

const ClubList = ({ currentUser, searchQuery }) => {

    const userId = currentUser.id;
    const queryClient = useQueryClient();
    const getFromCache = (key) => {
        return queryClient.getQueryData(key);
    };

    const { isLoading: clubListLoading, error: clubListError, data: clubListData } = useQuery(["userlists", searchQuery], async () => {
        // Attempt to get data from the cache
        const cache = getFromCache(["userlists", searchQuery]);
        if (cache) {
            return cache;
        };
        return makeRequest.get(`/users/club-list?from&userId=${userId}&searchQuery=${searchQuery}`)
        .then((res) => res.data)
        .catch((error) => {
            throw error; // Propagate the error for proper error handling
        })
    });

    return (
        <div className="club-list">
            <div className="user-list-container">
                {clubListLoading ? "Loading clubs..." : 
                    clubListError ? "Cannot fetch the club list." : 
                    !clubListData || clubListData.length === 0 ? `There are no clubs with "${searchQuery}".` :
                    clubListData.map((clubUser) => (
                    <div className="user-list" key={clubUser.id}>
                        <div className="user-info">
                            <img src={"/upload/" + clubUser.profilePhoto} alt={clubUser.name} />
                            <Link to={`/profile/${clubUser.id}`} style={{ textDecoration: "none"}}>
                                <span>{clubUser.name}</span>
                            </Link>
                        </div>
                        <div className="buttons">
                            <button>Follow</button>
                        </div>
                    </div>
                    ))
                }
            </div>
        </div>
    )
}

export default ClubList;