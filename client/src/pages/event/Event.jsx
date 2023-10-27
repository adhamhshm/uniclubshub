import "./event.scss";

import { makeRequest } from "../../request";
import { useContext, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../context/authContext";

import SyncIcon from '@mui/icons-material/Sync';
import DownloadIcon from '@mui/icons-material/Download';


const Event = () => {

    const { currentUser } = useContext(AuthContext);
    const [selectedYear, setSelectedYear] = useState("");
    const [selectedPostId, setSelectedPostId] = useState("");
    const currentYear = new Date().getFullYear(); // Get the current year
    const queryClient = useQueryClient();

    const { isLoading: postsLoading, error: postsError, data: postsData } = useQuery(["posts", selectedYear], async () => {
        return makeRequest.get(`/posts/year?userId=${currentUser.id}&year=${selectedYear}`)
        .then((res) => res.data)
        .catch((error) => {
            throw error; // Propagate the error for proper error handling
        })
    });

    const { isLoading: listLoading, error: listError, data: listData } = useQuery(["participants", selectedPostId], async () => {
        return makeRequest.get(`/events/participants?postId=${selectedPostId}`)
        .then((res) => res.data)
        .catch((error) => {
            throw error; // Propagate the error for proper error handling
        })
    });

    // Generate options for the year select element
    const yearOptions = [];
    for (let year = currentYear; year >= currentYear - 3; year--) {
        yearOptions.push(
            <option key={year} value={year}>
                {year}
            </option>
        );
    };

    // Handle year selection change
    const handleYearChange = (e) => {
        setSelectedPostId("");
        setSelectedYear(e.target.value);
    };

    // Handle selected post to view participants
    const handlePostChange = (e) => {
        setSelectedPostId(e.target.value);
        //queryClient.invalidateQueries(["participants", selectedPostId]);
    };

    // Refresh list
    const refreshList = (e) => {
        queryClient.invalidateQueries(["participants", selectedPostId]);
    };

    return (
        <div className="event">
            <div className="event-container">
                <h1>Manage your event.</h1>
                <div className="event-selection">
                    <select id="dates" onChange={handleYearChange}>
                        <option value="0">Select year:</option>
                        {yearOptions}
                    </select>
                    <select id="events" onChange={handlePostChange}>
                        <option value="0">Choose event:</option>
                        {postsLoading ? <option>Loading...</option> :
                         postsError ? <option value="0">Error loading events</option> :
                         postsData ? postsData.map((post) => ( <option key={post.id} value={post.id}>{post.title}</option> )) :
                         null 
                        }
                    </select>
                </div>
                <div className="download-button-div">
                    <button onClick={refreshList}>
                        <SyncIcon />
                        <span>Refresh List</span>
                    </button>
                    <button>
                        <DownloadIcon />
                        <span>Download list</span>
                    </button>
                </div>
                <div className="table-participant-list">
                    <table id="participants">
                        <tbody>
                            <tr>
                                <th style={{ width: "5%"}}>No.</th>
                                <th style={{ width: "50%"}}>Name</th>
                                <th style={{ width: "10%"}}>Id</th>
                                <th style={{ width: "15%"}}>Email</th>
                                <th style={{ width: "10%"}}>Phone</th>
                            </tr>
                            {listLoading ? 
                                <tr>
                                    <td colSpan="5">Loading participants...</td>
                                </tr> 
                                : listError ? 
                                <tr>
                                    <td colSpan="5">Error loading participants.</td>
                                </tr>
                                : listData.length === 0 ?
                                <tr>
                                    <td colSpan="5">No info at the moment.</td>
                                </tr>
                                : listData ?
                                listData.map((participant, index) => (
                                    <tr key={participant.id}>
                                        <td>{index + 1}</td>
                                        <td>{participant.name}</td>
                                        <td>{participant.id}</td>
                                        <td>{participant.email}</td>
                                        <td>{participant.phoneNumber}</td>
                                    </tr>
                                  ))
                                : null
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
};

export default Event;