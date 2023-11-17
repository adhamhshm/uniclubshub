import "./committeelist.scss";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../request";
import CommitteeForm from "../committeeform/CommitteeForm";
import LoadingSpinner from "../loadingspinner/LoadingSpinner";

import AddIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/BorderColor';
import DeleteIcon from '@mui/icons-material/Delete';

const CommitteeList = ({ profileData, userId, currentUser }) => {

    const queryClient = useQueryClient();
    const [openUpdateBox, setOpenUpdateBox] = useState(false);
    const [writeMode, setWriteMode] = useState("");
    const [committeeInfo, setCommitteeInfo] = useState({});

    const { isLoading: committeeListLoading, error: committeeListError, data: committeeListData } = useQuery(["committeeList", profileData.id], () => {
        return makeRequest.get("/committees/" + profileData.id)
        .then((res) => res.data)
        .catch((error) => {
            alert(error.response.data)
            throw error; // Propagate the error for proper error handling
        })
    });

    // Delete committee mutation
    const deleteCommitteeMutation = useMutation((committeeId) => {
        if (committeeId) {
            return makeRequest.delete("/committees/" + committeeId);
        }
    }, 
    {
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries(["committeeList"]);
        },
    });

    const handleDelete = async (committeeIdToDelete) => {
        deleteCommitteeMutation.mutate(committeeIdToDelete);
    };

    return (
        <div className="committee-list">
            <div className="add-option-container">
                <div className="description">
                    Committee list for the club.
                </div>
                {
                    currentUser.id === userId && currentUser.role === "club" &&
                    <button 
                        onClick={() => {
                            setOpenUpdateBox(true); 
                            setWriteMode("Add");
                            setCommitteeInfo({});
                        }}
                    >
                        <AddIcon />
                        <span>Add Committee</span>
                    </button>
                }
            </div>
            <div className="committee-list-container">
                <table id="committees">
                    <tbody>
                        <tr>
                            <th style={{ width: "5%"}}>No.</th>
                            <th style={{ width: "20%"}}>Position</th>
                            <th style={{ width: "55%"}}>Name</th>
                            {
                                currentUser.role === "club" && 
                                <th id="operations-title" style={{ width: "20%"}}>
                                    Operation
                                </th>
                            }
                        </tr>
                        {
                            committeeListLoading ? 
                            <tr>
                                <td colSpan="5"><LoadingSpinner /></td>
                            </tr> 
                            : committeeListError ? 
                            <tr>
                                <td colSpan="5"><LoadingSpinner /></td>
                            </tr>
                            : committeeListData.length === 0 ?
                            <tr>
                                <td colSpan="5">No info at the moment.</td>
                            </tr>
                            : committeeListData &&
                            committeeListData.map((committee, index) => (
                                <tr key={committee.id}>
                                    <td>{index + 1}</td>
                                    <td>{committee.position}</td>
                                    <td>{committee.name}</td>
                                    {   
                                        currentUser.role === "club" &&
                                        <td id="operations">
                                            <EditIcon 
                                                className="icons" 
                                                onClick={() => {
                                                    setOpenUpdateBox(true); 
                                                    setWriteMode("Edit");
                                                    setCommitteeInfo(committee)
                                                }} 
                                                />
                                            <DeleteIcon className="icons" onClick={() => {handleDelete(committee.id)}} />
                                        </td>
                                    }
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
            {
                openUpdateBox && 
                <CommitteeForm 
                    setOpenUpdateBox={setOpenUpdateBox} 
                    writeMode={writeMode} 
                    committeeInfo={committeeInfo}
                />
            }
        </div>
    )
}

export default CommitteeList;