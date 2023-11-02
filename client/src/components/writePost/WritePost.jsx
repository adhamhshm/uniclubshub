import "./writepost.scss";
import { useContext, useRef, useState } from "react";
import InsertPhotoIcon from '@mui/icons-material/InsertPhotoOutlined';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../request";
import { AuthContext } from "../../context/authContext";
import Loading from "../loading/loading";

import CloseIcon from '@mui/icons-material/CloseOutlined';

const WritePost = () => {

    const MAX_DESCRIPTION_LENGTH = 5000;
    const inputRef = useRef();
    const { currentUser, authorizeToken } = useContext(AuthContext);
    const [imageFile, setImageFile] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [showInvalidMessage, setInvalidMessage] = useState(false);
    const [showErrorImgUpload, setShowErrorImgUpload] = useState(false);
    const [showWrongFileImgUpload, setShowWrongFileImgUpload] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Function to check if description exceeds the character limit
    const isDescriptionTooLong = description.length > MAX_DESCRIPTION_LENGTH;

    const uploadPhoto = async () => {
        try {
            if (!imageFile.type.includes("image")) {
                // Show the invalid message
                setShowWrongFileImgUpload(true);
                // Hide the message after 3 seconds
                setTimeout(() => {
                    setShowWrongFileImgUpload(false);
                }, 3000);
                // exit the function
                return;
            }
            const formData = new FormData();
            formData.append("file", imageFile);
            // send the file to the server
            return await makeRequest.post("/images/upload" , formData )
            .then((res) => res.data )
            .catch((error) => {
                setIsLoading(false)
                setShowErrorImgUpload(true);
                setTimeout(() => {
                    setShowErrorImgUpload(false);
                }, 10000); // 10 seconds
                throw error;
            });
        } 
        catch(err) {
            console.log("Error upload image: " + err.message)
        }
    };

    // access the client
    const queryClient = useQueryClient()
    // Mutations
    const addPostMutation = useMutation((newPost) => {
        return makeRequest.post("/posts", newPost);
    }, 
    {
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: "posts" })
        },
    });

    const handlePost = async (e) => {
        e.preventDefault();
        // If token expired, exit the function
        let isToken = await authorizeToken();
        if (isToken === false) {
            return;
        };

        if (isDescriptionTooLong) {
            return;
        }
        
        if (!description || !title) {
            // Show the invalid message
            setInvalidMessage(true);
            // Hide the message after 3 seconds
            setTimeout(() => {
                setInvalidMessage(false);
            }, 3000);
            // exit the function
            return;
        };

        let imageUrl = "";
        if (imageFile) {
            try {
                setIsLoading(true); // Set loading state
                imageUrl = await uploadPhoto();
                if (!imageUrl) {
                    return;
                } 
            }
            finally {
                setIsLoading(false);
            }
        };

        addPostMutation.mutate({ title: title, description: description, image: imageUrl });
        setTitle("");
        setDescription("");
        clearImageFile();
    };

    const clearImageFile = () => {
        setImageFile(null)
        // clear the image using useRef
        inputRef.current.value = null;
    }
    
    return (
        <div className="writepost">
            <div className="writepost-container">
                <div className="writepost-container-top">
                    <div className="top-left-part">
                        <img src={currentUser.profilePhoto ? currentUser.profilePhoto : "/default/default-club-image.png"} alt="user" />
                        <div className="input-box">
                            <input
                                className={showInvalidMessage ? "input-invalid" : ""}
                                type="text"
                                placeholder={showInvalidMessage ? "Please fill out this field." : "Event title here..."}
                                onChange={(e) => {setTitle(e.target.value)}}
                                value={title}
                            />
                            <textarea
                                className={showInvalidMessage ? "input-invalid" : ""}
                                type="text"
                                rows={6}
                                placeholder={showInvalidMessage ? "Please fill out this field." : "Event description here..."}
                                onChange={(e) => {setDescription(e.target.value)}} 
                                value={description}
                            />
                            {isDescriptionTooLong && <div className="post-error-message">
                                <span>Description too long {description.length}/5000</span>
                            </div>}
                            {showErrorImgUpload && <div className="post-error-message">
                                <span>Server returned unexpected error. Try again later.</span>
                            </div>}
                            {showWrongFileImgUpload && <div className="post-error-message">
                                <span>Please upload a valid image file.</span>
                            </div>}
                        </div>
                    </div>
                    <div className="top-right-part">
                        {imageFile && (
                            <div>
                                <img 
                                    className="imageFile"  
                                    key={URL.createObjectURL(imageFile)}
                                    src={URL.createObjectURL(imageFile)} 
                                    alt="" />
                                <CloseIcon className="close-icon" onClick={clearImageFile} />
                            </div>
                        )}
                    </div>
                </div>
                <hr />
                <div className="writepost-container-bottom">
                    <div className="bottom-left-part">
                        <input
                            type="file"
                            id="file"
                            name="file"
                            style={{ display: "none" }}
                            onChange={(e) => {setImageFile(e.target.files[0])}} 
                            ref={inputRef}
                        />
                        <label htmlFor="file">
                            <div className="item">
                                <InsertPhotoIcon />
                                <span>Add Image (preferably with a minimum scale of 400x400)</span>
                            </div>
                        </label>
                    </div>
                    <div className="bottom-right-part">
                        <button 
                            className={isDescriptionTooLong ? "disabled-button" : ""} 
                            onClick={handlePost}
                        >
                            Post
                        </button>
                    </div>
                </div>
            </div>
            {isLoading && <Loading />}
        </div>
    )
}

export default WritePost;