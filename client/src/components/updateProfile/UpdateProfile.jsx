import "./updateprofile.scss";
import { makeRequest } from "../../request";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";

import CloseIcon from '@mui/icons-material/CloseOutlined';


const UpdateProfile = ({ setOpenUpdateBox, user }) => {

    const { updateProfilePhotoData } = useContext(AuthContext);
    const [updatedCoverPhoto, setUpdatedCoverPhoto] = useState(null);
    const [updatedProfilePhoto, setUpdatedProfilePhoto] = useState(null);
    const [updateInputs, setUpdateInputs] = useState({
        name: user.name,
        bio: user.bio || "",
    });

    const uploadPhoto = async (newImageFile, currentImageFilename) => {
        try {
            // Create a new FormData object to construct the data to be sent
            const formData = new FormData();
            // Append the file to the FormData with the key "file"
            formData.append("file", newImageFile);
            // Append the current existing file name to the FormData with the key "filename"
            formData.append("currentImageFilename", currentImageFilename);
            // Send the file and its name to the server using a POST request
            const res = await makeRequest.post("/images/upload" , formData);
            // Return the response data from the server
            return res.data;
        } 
        catch(err) {
            // Handle any errors that may occur during the upload process
            console.log("Error upload image: " + err.message)
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdateInputs((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // access the client
    const queryClient = useQueryClient()
    // Mutations
    const updateProfileMutation = useMutation((updatedUserInfo) => {
        if (user.role.includes("club")) {
            return makeRequest.put("/users", updatedUserInfo);
        }
        else if (user.role.includes("participant")) {
            return makeRequest.put("/participants", updatedUserInfo);
        }
        else {
            return alert("Something went wrong. Please try again.");
        }
    }, 
    {
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: "user" })
        },
    });

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (updateInputs.bio.length > 300) {
            // Do not proceed with the update if the bio exceeds 300 characters
            return;
        }

        let coverPhotoUrl;
        let profilePhotoUrl;
        
        coverPhotoUrl = updatedCoverPhoto ? await uploadPhoto(updatedCoverPhoto, user.coverPhoto) : user.coverPhoto;
        profilePhotoUrl = updatedProfilePhoto ? await uploadPhoto(updatedProfilePhoto, user.profilePhoto) : user.profilePhoto;
        
        updateProfileMutation.mutate({ ...updateInputs, coverPhoto: coverPhotoUrl, profilePhoto: profilePhotoUrl });
        updateProfilePhotoData(profilePhotoUrl);
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
                    <div className="files">
                        {/* cover photo is only for club */}
                        {user.role === "club" ? (
                            <label htmlFor="coverPhoto">
                                <span>Cover Photo</span>
                                <div className="imageContainer">
                                    <img src={updatedCoverPhoto ? URL.createObjectURL(updatedCoverPhoto) : "/default/upload.png"} alt="cover photo" />
                                </div>
                                <input type="file" id="coverPhoto" style={{ display: "none" }} onChange={(e) => {setUpdatedCoverPhoto(e.target.files[0])}} />
                            </label>
                            ) : null
                        }
                        {/* profile photo */}
                        <label htmlFor="profilePhoto">
                            <span>Profile Photo</span>
                            <div className="imageContainer">
                                <img src={updatedProfilePhoto ? URL.createObjectURL(updatedProfilePhoto): "/default/upload.png"} alt="cover photo" />
                            </div>
                        </label>
                        <input type="file" id="profilePhoto" style={{ display: "none" }} onChange={(e) => {setUpdatedProfilePhoto(e.target.files[0])}} />
                    </div>
                    {/* name input whether club name or student name */}
                    <label>Name</label>
                    <input type="text" value={updateInputs.name} name="name" onChange={handleChange} />
                    {/* bio is only for club */}
                    {user.role === "club" ? 
                        (
                            <>
                                <label>Bio</label>
                                <textarea type="text" rows={3} 
                                placeholder="Write bio here..." 
                                name="bio" 
                                onChange={handleChange} 
                                value={updateInputs.bio} 
                                />
                                <div className="char-count">{updateInputs.bio.length} / 300</div>
                            </>
                        ) : null
                    }
                    {/* button that will be disabled when bio exceeds 300 characters */}
                    {user.role === "club" ?
                        (
                            <button 
                                className={updateInputs.bio.length > 300 ? "disabled-button" : ""} 
                                onClick={handleUpdate} 
                            > 
                                {updateInputs.bio.length > 300 ? "Bio exceeds 300 characters" : "Update"}
                            </button>
                        ) : (
                            <button onClick={handleUpdate}>Update</button>
                        )
                    }
                </form>
                <CloseIcon className="close" style={{cursor: "pointer", width: "30px", height: "30px"}} onClick={() => setOpenUpdateBox(false)} />
            </div>
        </div>
    )
};

export default UpdateProfile;