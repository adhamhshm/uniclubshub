import "./updateprofile.scss";
import { makeRequest } from "../../request";
import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import Loading from "../loading/Loading";

const UpdateProfile = ({ setOpenUpdateBox, user }) => {

    const queryClient = useQueryClient();
    const { updateProfilePhotoData } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false); // Add loading state
    const [errorEmailMessage, setErrorEmailMessage] = useState(false);
    const [updatedProfilePhoto, setUpdatedProfilePhoto] = useState(null);
    const [updatedProfilePhotoUrl, setUpdatedProfilePhotoUrl] = useState(null);
    const [removePhoto, setRemovePhoto] = useState(true);
    const [updateInputs, setUpdateInputs] = useState({
        name: user.name,
        bio: user.bio || "",
        email: user.email,
        phoneNumber: user.phoneNumber || "",
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
            return await makeRequest.post("/images/upload" , formData )
            .then((res) => res.data )
            .catch((error) => {
                throw error; // Propagate the error for proper error handling
            });
        } 
        catch(err) {
            // Handle any errors that may occur during the upload process
            console.log("Error upload image: " + err.message)
        }
    };

    // Mutations
    const updateProfileMutation = useMutation((updatedUserInfo) => {
        if (user.role === "club") {
            return makeRequest.put("/users", updatedUserInfo)
            .catch((error) => {
                alert(error.response.data)
                throw error;
            });
        }
        else if (user.role === "participant") {
            return makeRequest.put("/participants", updatedUserInfo)
            .catch((error) => {
                alert(error.response.data)
                throw error;
            });
        }
        else {
            return alert("Something went wrong. Please try again.");
        }
    }, 
    {
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries(["user"]);
        },
    });

    const isEmailValid = (email) => {
        // Regular expression to check if the email follows a standard format
        const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailFormat.test(email);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdateInputs((prev) => ({
            ...prev,
            [name]: value
        }));

        if (name === "email" && !isEmailValid(value)) {
            setErrorEmailMessage(true);
        } 
        else {
            setErrorEmailMessage(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        if (updateInputs.bio.length > 300 || errorEmailMessage || !isEmailValid(updateInputs.email)) {
            // Do not proceed with the update if the bio exceeds 300 characters or the email format is incorrect
            return;
        }

        // First just give its value to the existing photo
        let profilePhotoUrl = user.profilePhoto;

        // If updatedProfilePhoto not null, it can be "" or there is a image
        // If null, user do not want to change the photo
        if (updatedProfilePhoto !== null) {
            try {
                setIsLoading(true);
                if (updatedProfilePhoto !== "") {
                    // If updatedProfilePhoto in not "", store the image
                    profilePhotoUrl = await uploadPhoto(updatedProfilePhotoUrl, user.profilePhoto)
                }
                else {
                    // Else, the photo is set to "", which means user just want to remove current photo
                    profilePhotoUrl = updatedProfilePhoto;
                    makeRequest.delete("/images/delete" , { data : { imageToBeDeleted: user.profilePhoto }});
                }
            }
            finally {
                setIsLoading(false);
            }
        }

        
        await updateProfileMutation.mutate({ ...updateInputs, profilePhoto: profilePhotoUrl });
        // This is use to update the local data
        updateProfilePhotoData(profilePhotoUrl);
        setUpdatedProfilePhoto(null);
        setOpenUpdateBox(false);
    };

    const handleImageChange = (file) => {
        setUpdatedProfilePhoto(file);
        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result;
            setUpdatedProfilePhotoUrl(result);
        };
        reader.readAsDataURL(file);
    };

    const handleRemovePhoto = () => {
        setRemovePhoto(false);
        setUpdatedProfilePhoto("");
    };

    return (
        <div className="update-profile">
            <div className="wrapper">
                <h1>Update Profile</h1>
                <form>
                    <div className="files">
                        {/* profile photo */}
                        <span>
                            Profile Photo 
                        </span>
                        <label htmlFor="profilePhoto">
                            <div className="imageContainer">
                                <img
                                src={updatedProfilePhoto ? URL.createObjectURL(updatedProfilePhoto) : 
                                    (user.profilePhoto && removePhoto) ? user.profilePhoto : 
                                    "/default/upload-gradient.webp"}
                                    alt="cover photo"
                                />
                            </div>
                        </label>
                        <input 
                            type="file" 
                            id="profilePhoto" 
                            style={{ display: "none" }} 
                            onChange={(e) => {handleImageChange(e.target.files[0])}} 
                        />
                        {((user.profilePhoto || updatedProfilePhoto) && removePhoto) && <span className="remove-image" onClick={handleRemovePhoto}> [Remove photo]</span>}
                    </div>
                    {/* name input whether club name or student name */}
                    <span>Name</span>
                    <input type="text" value={updateInputs.name} name="name" onChange={handleChange} />
                    {/* email input whether club email or student email */}
                    <span>
                        Email
                        {errorEmailMessage && <span className="error-message"> Invalid email format</span>}
                    </span>
                    <input type="text" value={updateInputs.email} name="email" onChange={handleChange} />
                    {user.role === "participant" && 
                        <>
                            <span>Phone</span>
                            <input type="text" value={updateInputs.phoneNumber} name="phoneNumber" onChange={handleChange} />
                        </>
                    }
                    {/* bio is only for club */}
                    {user.role === "club" && 
                        <>
                            <span>
                                Bio
                                {updateInputs.bio.length > 300 && <span className="error-message"> Bio exceeds 300 characters</span>}
                            </span>
                            <textarea type="text" rows={3} 
                            placeholder="Write bio here..." 
                            name="bio" 
                            onChange={handleChange} 
                            value={updateInputs.bio} 
                            />
                            <div className="char-count">{updateInputs.bio.length} / 300</div>
                        </>
                    }
                    {/* button that will be disabled when bio exceeds 300 characters */}
                    <button 
                        className={updateInputs.bio.length > 300 || errorEmailMessage ? "disabled-button" : ""} 
                        onClick={handleUpdate} 
                    > 
                        Update
                    </button>
                </form>
                <img id="close-icon" src="/default/cross.svg" alt="cross" onClick={() => setOpenUpdateBox(false)} />
            </div>
            {isLoading && <Loading />}
        </div>
    )
};

export default UpdateProfile;