import "./home.scss";
import Posts from "../../components/posts/Posts";
import Stories from "../../components/stories/Stories";
import WritePost from "../../components/writePost/WritePost";
import { useCallback, useContext, useEffect } from "react";
import { AuthContext } from "../../context/authContext";
import { useNavigate } from "react-router-dom";

const Home = ({ socket, currentUser }) => {

    const { authorizeToken } = useContext(AuthContext);
    const navigate = useNavigate();

    const checkTokenAndNavigate = useCallback(async () => {
        const isTokenValid = await authorizeToken();
        if (!currentUser || !isTokenValid) {
            navigate("/login");
        }
    }, [authorizeToken]);

    useEffect(() => {
        checkTokenAndNavigate();
    }, [checkTokenAndNavigate]);

    return (
        <div className="home">
            {currentUser.role === "club" && <WritePost />}
            <Posts socket={socket} currentUser={currentUser} />
        </div>
    )
}

export default Home;