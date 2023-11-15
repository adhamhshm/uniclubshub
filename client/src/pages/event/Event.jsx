import "./event.scss";

import { makeRequest } from "../../request";
import { useContext, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../context/authContext";
import { useNavigate } from "react-router-dom";

import SyncIcon from '@mui/icons-material/Sync';
import DownloadIcon from '@mui/icons-material/Download';

const Event = () => {

    const navigate = useNavigate();
    const { currentUser } = useContext(AuthContext);
    const [selectedYear, setSelectedYear] = useState("");
    const [selectedPostId, setSelectedPostId] = useState("");
    const currentYear = new Date().getFullYear(); // Get the current year
    const queryClient = useQueryClient();
    const getFromCache = (key) => {
        return queryClient.getQueryData(key);
    };

    const { isLoading: postsLoading, error: postsError, data: postsData } = useQuery(["posts", selectedYear], async () => {
        return makeRequest.get(`/posts/year?userId=${currentUser.id}&year=${selectedYear}`)
        .then((res) => res.data)
        .catch((error) => {
            throw error; // Propagate the error for proper error handling
        })
    });

    const { isLoading: listLoading, error: listError, data: listData } = useQuery(["participants", selectedPostId], async () => {
        // // Attempt to get data from the cache without making a network request.
        // const cache = getFromCache(["participants", selectedPostId]);
        // if (cache) {
        //     return cache;
        // };
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

    const downloadCSV = (eventTitle) => {
        // Selects the table with the ID 'participants' from the DOM.
        // If the table is not found, the function returns, terminating the operation
        const table = document.getElementById('participants');
        if (!table) return;
    
        // Selects all the table rows (tr) within the table.
        const rows = table.querySelectorAll('tr');
        const csvData = [];
        
        // Loops through each row and extracts the data from each cell (td) in the row.
        rows.forEach((row) => {
            const rowData = [];
            // Collects the text content of each cell and creates an array (rowData) for each row.
            row.childNodes.forEach((cell) => {
                if (cell.textContent) {
                    rowData.push(cell.textContent);
                }
            });
            //Joins the cell data with commas and pushes it as a string to csvData.
            csvData.push(rowData.join(','));
        });
    
        // Convert the data to CSV string
        // Starts with the CSV file content type and charset, followed by the CSV data joined by newline characters.
        const csvContent = 'data:text/csv;charset=utf-8,' + csvData.join('\n');
        
        // Creates an anchor element (<a>) and sets its attributes: 
        // - href is set to the prepared CSV content. 
        // - download specifies the default filename for the downloaded file.
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `Namelist-${eventTitle}.csv`);
        document.body.appendChild(link);
    
        // Simulate the click to trigger the download
        link.click();
    };

    // Handle year selection change
    const handleYearChange = (e) => {
        setSelectedPostId("");
        setSelectedYear(e.target.value);
    };

    // Handle selected post to view participants
    const handlePostChange = (e) => {
        setSelectedPostId(e.target.value);
        navigate(`/event?year=${selectedYear}&postId=${e.target.value}`)
        
    };

    // Refresh list
    const refreshList = () => {
        queryClient.invalidateQueries(["participants", selectedPostId]);
    };

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const year = searchParams.get("year");
        const postId = searchParams.get("postId");
        if (year && postId) {
            if (year && postId) {
                setSelectedYear(year);
                setSelectedPostId(postId);
            }
        }
    }, [location]);

    return (
        <div className="event">
            <div className="event-container">
                <h2>Manage event.</h2>
                <div className="event-selection">
                    <select id="dates" onChange={handleYearChange} value={selectedYear || "0"}>
                        <option value="0">Select year:</option>
                        {yearOptions}
                    </select>
                    <select id="events" onChange={handlePostChange} value={selectedPostId || "0"}>
                        <option value="0">Choose event:</option>
                        {
                            postsLoading ? <option>Loading...</option> :
                            postsError ? <option value="0">Error loading events</option> :
                            postsData && postsData.map((post) => ( <option key={post.id} value={post.id}>{post.title}</option> ))  
                        }
                    </select>
                </div>
                <div className="buttons-container">
                    <button onClick={refreshList}>
                        <SyncIcon />
                        <span>Refresh List</span>
                    </button>
                    {/* 
                        Receives the title of the selected post if it exists. postsData is an array of posts. 
                        The find() method is used to locate a post in the postsData array whose ID matches the selectedPostId. 
                        Once found, the title property of the post is retrieved. 
                        The ?. (optional chaining) is used to safeguard against a null or undefined post object, preventing a potential error.
                    */}
                    <button onClick={() => {downloadCSV(postsData.find(post => post.id === selectedPostId)?.title || "participants")}}>
                        <DownloadIcon />
                        <span>Download List</span>
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