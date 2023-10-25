import "./writepost.scss";
import { useContext, useState } from "react";
import InsertPhotoIcon from '@mui/icons-material/InsertPhotoOutlined';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../request";
import { AuthContext } from "../../context/authContext";

import CloseIcon from '@mui/icons-material/CloseOutlined';

const WritePost = () => {

    const { currentUser } = useContext(AuthContext);
    
    const [imageFile, setImageFile] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const uploadPhoto = async () => {
        try {
            const formData = new FormData();
            formData.append("file", imageFile);
            // send the file to the server
            const res = await makeRequest.post("/upload" , formData);
            return res.data;
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
        let imageUrl = "";
        if (imageFile) {
            imageUrl = await uploadPhoto();
        };
        
        if (!description || !title) {
            return alert("Please write event title and description.")
        };

        addPostMutation.mutate({ title: title, description: description, image: imageUrl });
        setTitle("");
        setDescription("");
        setImageFile(null);
    };
    
    return (
        <div className="writepost">
            <div className="writepost-container">
                <div className="writepost-container-top">
                    <div className="top-left-part">
                        <img src={currentUser.profilePhoto ? "/upload/" + currentUser.profilePhoto : "/default/default-club-image.png"} alt="user" />
                        <div className="input-box">
                            <input
                                type="text"
                                placeholder="Event title here..."
                                onChange={(e) => {setTitle(e.target.value)}}
                                value={title}
                            />
                            <textarea
                                type="text"
                                rows={3}
                                placeholder="Event description here..."
                                onChange={(e) => {setDescription(e.target.value)}} 
                                value={description}
                            />
                        </div>
                    </div>
                    <div className="top-right-part">
                        {imageFile && (
                            <div>
                                <img className="imageFile" src={URL.createObjectURL(imageFile)} alt="" />
                                <CloseIcon />
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
                        />
                        <label htmlFor="file">
                            <div className="item">
                                <InsertPhotoIcon />
                                <span>Add Image</span>
                            </div>
                        </label>
                    </div>
                    <div className="bottom-right-part">
                        <button onClick={handlePost}>Post</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WritePost;