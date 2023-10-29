import "./explore.scss";
import { useContext, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../request";
import { useLocation, useNavigate } from 'react-router-dom';

import { AuthContext } from "../../context/authContext";
import Post from "../../components/posts/post/Post";
import ClubList from "../../components/clublist/ClubList";

import BackIcon from '@mui/icons-material/KeyboardBackspace';

const Explore = () => {

    // Get the current location and navigate objects from React Router
    const location = useLocation();
    const navigate = useNavigate();
    const { currentUser } = useContext(AuthContext);
    const [searchQuery, setSearchQuery] = useState(""); // State to store search query
    const [searchText, setSearchText] = useState("");
    const [activeTab, setActiveTab] = useState("posts"); // State to manage the active tab
    
    const queryClient = useQueryClient();
    const getFromCache = (key) => {
        return queryClient.getQueryData(key);
    };

    const { isLoading, error, data } = useQuery(["posts", searchQuery], () => {
        // Attempt to get data from the cache
        const cache = getFromCache(["posts", searchQuery]);
        if (cache) {
            return cache;
        };
        // If not in cache, fetch data from the server
        return makeRequest.get("/posts/explore?q=", { params: { searchQuery: searchQuery } })
            .then((res) => res.data)
            .catch((error) => {
                    throw error; // Propagate the error for proper error handling
            });
        }
    );

    // Use `useEffect` to set the active tab from the URL when the component mounts
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const tab = searchParams.get('tab');
        if (tab && (tab === 'posts' || tab === 'clubs')) {
            // Set the active tab based on the URL parameter
            setActiveTab(tab);
        }
    }, [location]);

    // Function to update the active tab and update the URL
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        // Update the URL with the tab parameter
        navigate(`/explore?tab=${tab}`);
    };

    // Event handler to update the search query state when the button is clicked
    const handleSearch = () => {
        setSearchQuery(searchText);
    };

    const handleInputKeyDown = (e) => {
        if (e.key === "Enter") {
            // When Enter key is pressed, invoke handleSearch
            handleSearch();
        }
    };

    const clearSearch = () => {
        setSearchQuery("");
        setSearchText("");
    };

    return (
        <div className="explore">
            <div className="explore-top-container">
                <div className="search-container">
                    {searchQuery !== "" && 
                    <div className="back-button-box" onClick={clearSearch}>
                        <BackIcon className="back-icon"/>
                    </div>
                    }
                    <div className="text-box">
                        <input 
                            type="text" 
                            placeholder="Search for clubs/events..." 
                            autoFocus
                            value={searchText}
                            onChange={(e) => {setSearchText(e.target.value)}} 
                            onKeyDown={handleInputKeyDown}
                        />
                    </div>
                    <div className="search-button-box">
                        <button onClick={handleSearch}>
                            Search
                        </button>
                    </div>
                </div>
                <div className="tabs-container">
                    <div className="tabs">
                        <div
                            className={`tab ${activeTab === "posts" ? "active" : ""}`}
                            onClick={() => handleTabChange("posts")}
                        >
                            Posts
                        </div>
                        <div
                            className={`tab ${activeTab === "clubs" ? "active" : ""}`}
                            onClick={() => handleTabChange("clubs")}
                        >
                            Clubs
                        </div>
                    </div>
                </div>
            </div>
            {activeTab === "clubs" && <ClubList currentUser={currentUser} searchQuery={searchQuery} />}
            {activeTab === "posts" && <div className="posts">
                {isLoading 
                    ? ( "Loading..." ) 
                    : error ? ( "Something went wrong...") 
                    : data.length !== 0 ? 
                    (
                        data.map((post) => {
                            return (
                                <Post post={post} key={post.id} />
                            )
                        })
                    ) : (
                        <div className="not-found-message">
                           Sorry, we cannot find "{searchQuery}". 
                        </div>
                    )
                }
            </div>}
        </div>
    )
}

export default Explore;