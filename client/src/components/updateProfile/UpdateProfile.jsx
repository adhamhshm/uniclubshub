import "./updateprofile.scss";
import { makeRequest } from "../../request";
import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import CloseIcon from '@mui/icons-material/CloseOutlined';


const UpdateProfile = ({ setOpenUpdateBox, user }) => {

    const [updatedCoverPhoto, setUpdatedCoverPhoto] = useState(null);
    const [updatedProfilePhoto, setUpdatedProfilePhoto] = useState(null);
    const [updateInputs, setUpdateInputs] = useState({
        name: "",
    });

    const uploadPhoto = async (file) => {
        try {
            const formData = new FormData();
            formData.append("file", file);
            // send the file to the server
            const res = await makeRequest.post("/upload" , formData);
            return res.data;
        } 
        catch(err) {
            console.log("Error upload image: " + err.message)
        }
    };

    const handleChange = (e) => {
        setUpdateInputs((prev) => ({
            ...prev,
            [e.target.name]: e.target.value //need update []
        }))
    };

    // access the client
    const queryClient = useQueryClient()
    // Mutations
    const mutation = useMutation((updatedUserInfo) => {
        return makeRequest.put("/users", updatedUserInfo);
    }, 
    {
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: "user" })
        },
    });

    const setLocalProfileData = (profilePhotoUrl) => {
        const objectJSON = JSON.parse(localStorage.getItem("user"));
        if (objectJSON) {
            objectJSON.profilePhoto = profilePhotoUrl
            const updatedObjectJSON = JSON.stringify(objectJSON);
            localStorage.setItem("user", updatedObjectJSON);
        }
        else {
            console.log("The user item does not exist in localStorage.");
        }
    };

    const handleUpdate = async (e) => {
        // e.preventDefault();
        let coverPhotoUrl;
        let profilePhotoUrl;
        
        coverPhotoUrl = updatedCoverPhoto ? await uploadPhoto(updatedCoverPhoto) : user.coverPhoto;
        profilePhotoUrl = updatedProfilePhoto ? await uploadPhoto(updatedProfilePhoto) : user.profilePhoto;
        
        mutation.mutate({ ...updateInputs, coverPhoto: coverPhotoUrl, profilePhoto: profilePhotoUrl });
        setLocalProfileData(profilePhotoUrl);
        setUpdateInputs("");
        setUpdatedCoverPhoto(null);
        setUpdatedProfilePhoto(null);
        setOpenUpdateBox(false);
    };

    return (
        <div className="updateProfile">
            <div className="wrapper">
                <h1>Update Profile</h1>
                <form>
                    {/* <input type="file" onChange={(e) => {setUpdatedCoverPhoto(e.target.files[0])}} />
                    <input type="file" onChange={(e) => {setUpdatedProfilePhoto(e.target.files[0])}} />
                    <input type="text" name="name" onChange={handleChange} />
                    <button onClick={handleUpdate}>Update</button> */}
                    <div className="files">
                        <label htmlFor="coverPhoto">
                            <span>Cover Photo</span>
                            <div className="imageContainer">
                                <img src={updatedCoverPhoto ? URL.createObjectURL(updatedCoverPhoto): "/upload/" + user.coverPhoto} alt="cover photo" />
                            </div>
                        </label>
                        <input type="file" id="coverPhoto" style={{ display: "none" }} onChange={(e) => {setUpdatedCoverPhoto(e.target.files[0])}} />
                        <label htmlFor="profilePhoto">
                            <span>Profile Photo</span>
                            <div className="imageContainer">
                                <img src={updatedProfilePhoto ? URL.createObjectURL(updatedProfilePhoto): "/upload/" + user.profilePhoto} alt="cover photo" />
                            </div>
                        </label>
                        <input type="file" id="profilePhoto" style={{ display: "none" }} onChange={(e) => {setUpdatedProfilePhoto(e.target.files[0])}} />
                    </div>
                    <label>Name</label>
                    <input type="text" value={updateInputs.name} name="name" onChange={handleChange} />
                    <button onClick={handleUpdate}>Update</button>
                </form>
                <CloseIcon className="close" style={{cursor: "pointer", width: "30px", height: "30px"}} onClick={() => setOpenUpdateBox(false)} />
            </div>
        </div>
    )
};

export default UpdateProfile;