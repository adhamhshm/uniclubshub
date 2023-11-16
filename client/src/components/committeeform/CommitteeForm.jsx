import "./committeeform.scss";
import { makeRequest } from "../../request";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import CloseIcon from '@mui/icons-material/CloseOutlined';

const positionType = [
    {position: "President", value: 1},
    {position: "Deputy President", value : 2},
    {position: "Vice President", value : 3},
    {position: "Treasurer", value : 4},
    {position: "Secretary", value : 5},
    {position: "Bureau Head", value : 6},
    {position: "Bureau Member", value : 7},
];

const CommitteeForm = ({ setOpenUpdateBox, writeMode, committeeInfo }) => {

    const queryClient = useQueryClient();
    const [committeeInputs, setCommitteeInputs] = useState({
        position: committeeInfo.position || "",
        name: committeeInfo.name || "",
        positionRank: committeeInfo.positionRank || 0,
    });

    // Adding a new committee mutation
    const addCommitteeMutation = useMutation((newCommittee) => {
        return makeRequest.post("/committees", newCommittee)
        .catch((error) => {
            alert(error.response.data);
            throw error;
        });
    }, 
    {
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries(["committeeList"]);
        },
    });

    const editCommitteeMutation = useMutation((editedCommittee) => {
        return makeRequest.put("/committees", editedCommittee)
        .catch((error) => {
            alert(error.response.data);
            throw error;
        })
    },
    {
        onSuccess: () => {
            queryClient.invalidateQueries(["committeeList"]);
        }
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCommitteeInputs((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleWriteCommitee = (e) => {
        e.preventDefault();

        if (committeeInputs.position === "" || committeeInputs.name === "") {
            return;
        };

        if (writeMode === "Add") {
            addCommitteeMutation.mutate({ position: committeeInputs.position, name: committeeInputs.name, positionRank: committeeInputs.positionRank });
        };

        if (writeMode === "Edit") {
            editCommitteeMutation.mutate({ 
                position: committeeInputs.position, 
                name: committeeInputs.name, 
                positionRank: committeeInputs.positionRank, 
                id: committeeInfo.id  
            })
        };
        setOpenUpdateBox(false);
    };

    return (
        <div className="committee-form">
            <div className="wrapper">
                <h1><span>{writeMode}</span> Commitee</h1>
                <form>
                    {/* position input */}
                    <span>Position Name</span>
                    <input type="text" value={committeeInputs.position} name="position" onChange={handleChange} autoComplete="off" />
                    {/* position input */}
                    <span>Position Type</span>
                    <select id="position-type" name="positionRank" onChange={handleChange} value={committeeInputs.positionRank}>
                        <option value="0">Select:</option>
                        {positionType.map((type) => (
                            <option key={type.value} value={type.value}>
                                {type.position}
                            </option>
                        ))}
                    </select>
                    {/* name input */}
                    <span>Commitee Name</span>
                    <input type="text" value={committeeInputs.name} name="name" onChange={handleChange} autoComplete="off" />
                    <button onClick={handleWriteCommitee}> 
                        {writeMode}
                    </button>
                </form>
                <CloseIcon className="close" style={{cursor: "pointer", width: "30px", height: "30px"}} onClick={() => setOpenUpdateBox(false)} />
            </div>
        </div>
    )
}

export default CommitteeForm;