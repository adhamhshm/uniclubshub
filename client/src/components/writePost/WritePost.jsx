import "./writepost.scss";
import { useContext, useRef, useState } from "react";
import InsertPhotoIcon from '@mui/icons-material/InsertPhotoOutlined';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../request";
import { AuthContext } from "../../context/authContext";
import Loading from "../loading/loading";

import CloseIcon from '@mui/icons-material/CloseOutlined';

const WritePost = () => {

    // Declare and initialize constants, states, and references
    const MAX_DESCRIPTION_LENGTH = 5000;
    const MAX_TITLE_LENGTH = 100;
    const inputRef = useRef();
    const queryClient = useQueryClient();
    const { currentUser, authorizeToken } = useContext(AuthContext);
    const [imageFile, setImageFile] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [showInvalidMessage, setInvalidMessage] = useState(false);
    const [showErrorImgUpload, setShowErrorImgUpload] = useState(false);
    const [showWrongFileImgUpload, setShowWrongFileImgUpload] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Variable to check if description or title exceeds the character limit
    const isDescriptionTooLong = description.length > MAX_DESCRIPTION_LENGTH;
    const isTitleTooLong = title.length > MAX_TITLE_LENGTH;

    // Function to upload the selected photo to the server
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
        catch(error) {
            console.log("Error upload image: " + error.message)
        }
    };

    // Mutation for adding a new post
    const addPostMutation = useMutation((newPost) => {
        return makeRequest.post("/posts", newPost);
    }, 
    {
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: "posts" })
        },
    });

    // Function to handle the post submission
    const handlePost = async (e) => {
        e.preventDefault();
        // If token expired, exit the function
        let isToken = await authorizeToken();
        if (isToken === false) {
            return;
        };

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

        if (isDescriptionTooLong) {
            return;
        }

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

    // Function to clear the uploaded image file
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
                        <img src={currentUser?.profilePhoto ? currentUser?.profilePhoto : "/default/default-club-image.png"} alt="user" />
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
                            {isTitleTooLong && <div className="post-error-message">
                                <span>Title too long {title.length}/{MAX_TITLE_LENGTH}</span>
                            </div>}
                            {isDescriptionTooLong && <div className="post-error-message">
                                <span>Description too long {description.length}/{MAX_DESCRIPTION_LENGTH}</span>
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
                                <span>Add Image</span>
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