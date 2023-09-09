import "./stories.scss";
import { AuthContext } from "../../context/authContext";
import { useContext } from "react";

const Stories = () => {

    const { currentUser } = useContext(AuthContext);

    // Dummy data
    const stories = [
        {
            id: 1,
            name: "User",
            img: "https://images.pexels.com/photos/4009626/pexels-photo-4009626.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
        },
        {
            id: 1,
            name: "User",
            img: "https://images.pexels.com/photos/4009626/pexels-photo-4009626.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
        },
        {
            id: 1,
            name: "User",
            img: "https://images.pexels.com/photos/4009626/pexels-photo-4009626.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
        },
        {
            id: 1,
            name: "User",
            img: "https://images.pexels.com/photos/4009626/pexels-photo-4009626.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
        },
    ];


    return (
        <div className="stories">
             <div className="story">
                        <img src={currentUser.profilePhoto} alt="user image" />
                        <span>{currentUser.name}</span>
                        <button>+</button>
                    </div>
            {stories.map((story) => {
                return (
                    <div className="story" key={story.id}>
                        <img src={story.img} alt="story image" />
                        <span>{story.name}</span>
                    </div>
                )
            })}
        </div>
    )
}

export default Stories;