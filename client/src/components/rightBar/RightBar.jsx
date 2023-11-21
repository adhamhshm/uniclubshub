import "./rightbar.scss";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../request";
import { Link } from "react-router-dom";
import LoadingSpinner from "../loadingspinner/LoadingSpinner";
import { useState } from "react";

const RightBar = ({ currentUser }) => {

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 5; // Adjust the page size as needed

    // Use a query to fetch the list of clubs with optional search query
    const { isLoading: clubListLoading, error: clubListError, data: clubListData } = useQuery(["clubUserLists", currentPage], async () => {
        return makeRequest.get(`/users/all-users?page=${currentPage}&pageSize=${pageSize}`)
        .then((res) => {
            // Set total pages when data is available
            setTotalPages(Math.ceil(res.data.totalClubs / pageSize));
            return res.data.clubs;
        })
        .catch((error) => {
            throw error;
        })
    });


    // Function to handle page changes
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    return (
        <div className="rightbar">
            <div className="rightbar-container">
                <h3>Clubs & Socities around you</h3>
                {totalPages !== 0 && (
                    <div className="pagination-container">
                        <div className="pagination">
                            <button 
                                className={ currentPage === 1 ? "disabled" : ""}
                                id="previous"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                <img src="/default/arrow-left.svg" alt="previous" />
                            </button>
                            <span>{currentPage} / {totalPages} </span>
                            <button
                                className={ currentPage === totalPages ? "disabled" : ""}
                                id="next"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                <img src="/default/arrow-right.svg" alt="next" />
                            </button>
                        </div>
                    </div>
                )}
                <div className="user-list-container">
                    {clubListLoading ? ( <LoadingSpinner /> ) : 
                        clubListError ? ( <LoadingSpinner /> ) : 
                        !clubListData || clubListData.length === 0 ? ( "No clubs." ) :
                        clubListData.length !== 0 && (
                            clubListData.map((clubUser) => {
                                return (
                                    <div className="user-list" key={clubUser.id}>
                                        <div className="user-info">
                                            <img src={clubUser.profilePhoto ? clubUser.profilePhoto : "/default/default-club-image.webp"} alt={clubUser.name} />
                                            <Link to={`/profile/${clubUser.id}`} style={{ textDecoration: "none"}}>
                                                <span>{clubUser.name}</span>
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })
                        ) 
                    }
                </div>
            </div>
        </div>
    )
}

export default RightBar;