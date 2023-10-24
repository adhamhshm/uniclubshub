import "./explore.scss";
import { useState } from "react";
import SearchIcon from '@mui/icons-material/Search';
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../request";
import Post from "../../components/posts/post/Post";

const Explore = () => {

    // State to store search query
    const [searchQuery, setSearchQuery] = useState(""); 

    const { isLoading, error, data } = useQuery(["posts", searchQuery], () => 
        makeRequest.get("/posts/explore?q=", { params: { searchQuery: searchQuery } })
        .then((res) => {
            // the fetched posts
            return res.data;
        })
    );

    // Event handler to update the search query state when the button is clicked
    const handleSearch = () => {
        // Here, you can optionally perform additional actions, such as making an API call,
        // before updating the searchQuery state.
    };

    return (
        <div className="explore">
            <div className="search-container">
                <div className="text-box">
                    <SearchIcon className="search-icon" />
                    <input 
                        type="text" 
                        placeholder="Search for clubs/events..." 
                        value={searchQuery}
                        onChange={(e) => {setSearchQuery(e.target.value)}} 
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
                    : (
                        data.map((post) => {
                            return (
                                <Post post={post} key={post.id} />
                            )
                        })
                    )
                }
            </div>
        </div>
    )
}

export default Explore;