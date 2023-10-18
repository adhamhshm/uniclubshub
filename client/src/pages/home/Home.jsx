import "./home.scss";
import Posts from "../../components/posts/Posts";
import Stories from "../../components/stories/Stories";
import WritePost from "../../components/writePost/WritePost";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../context/authContext";
import { useNavigate } from "react-router-dom";

const Home = () => {

    const { currentUser } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if(!currentUser) {
            navigate("/login");
        }
    }, [currentUser]);

    return (
        <div className="home">
            {currentUser.role === "club" ? 
                (
                    <WritePost />
                ) : (
                    null
                )
            }
            <Posts />
        </div>
    )
}

export default Home;