import "./home.scss";
import Posts from "../../components/posts/Posts";
import Stories from "../../components/stories/Stories";
import WritePost from "../../components/writePost/WritePost";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../context/authContext";
import { useNavigate } from "react-router-dom";

const Home = () => {

    const { currentUser, authorizeToken } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        // Create a flag to prevent repeated checks
        let isMounted = true;

        // Define an async function to check the token, and then navigate if it's invalid
        const checkTokenAndNavigate = async () => {
            if (isMounted) {
                const isTokenValid = await authorizeToken();
                if (!currentUser || !isTokenValid) {
                    navigate("/login");
                }
            }
        };

        // Call the function to check the token
        checkTokenAndNavigate();

        // Cleanup function to set the flag to false when the component unmounts
        return () => {
            isMounted = false;
        };
    }, []);

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