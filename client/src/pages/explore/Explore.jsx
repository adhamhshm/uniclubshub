import "./explore.scss";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../request";

import Post from "../../components/posts/post/Post";

import BackIcon from '@mui/icons-material/KeyboardBackspace';

const Explore = () => {

    // State to store search query
    const [searchQuery, setSearchQuery] = useState("");
    const [searchText, setSearchText] = useState("");
    
    const queryClient = useQueryClient();
    const getFromCache = (key) => {
        return queryClient.getQueryData(key);
    };

    // const { isLoading, error, data } = useQuery(["posts", searchQuery], () => 
    //     makeRequest.get("/posts/explore?q=", { params: { searchQuery: searchQuery } })
    //     .then((res) => {
    //         // the fetched posts
    //         return res.data;
    //     })
    // );

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
            
            <div className="posts">
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
            </div>
        </div>
    )
}

export default Explore;