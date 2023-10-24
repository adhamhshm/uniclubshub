import "./writepost.scss";
import { useContext, useState } from "react";
import InsertPhotoIcon from '@mui/icons-material/InsertPhotoOutlined';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../request";
import { AuthContext } from "../../context/authContext";

const WritePost = () => {

    const { currentUser } = useContext(AuthContext);
    
    const [imageFile, setImageFile] = useState(null);
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
    const mutation = useMutation((newPost) => {
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
        
        if (!description) {
            return alert("Please write event description.")
        };

        mutation.mutate({ description, image: imageUrl });
        setDescription("");
        setImageFile(null);
    };
    
    return (
        <div className="writepost">
            <div className="writepost-container">
                <div className="writepost-container-top">
                    <div className="top-left-part">
                        <img src={currentUser.profilePhoto ? "/upload/" + currentUser.profilePhoto : "/default/default-club-image.png"} alt="user" />
                        <textarea
                            type="text"
                            rows={2}
                            placeholder="Post event here..."
                            onChange={(e) => {setDescription(e.target.value)}} 
                            value={description}
                        />
                    </div>
                    <div className="top-right-part">
                        {imageFile && (
                            <img className="imageFile" src={URL.createObjectURL(imageFile)} alt="" />
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