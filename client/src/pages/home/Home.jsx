import "./home.scss";
import Posts from "../../components/posts/Posts";
import WritePost from "../../components/writePost/WritePost";

const Home = ({ socket, currentUser }) => {

    return (
        <div className="home">
            {/* Conditionally render the WritePost component for users with a 'club' role */}
            {currentUser?.role === "club" && <WritePost />}
            {/* Render the Posts component and pass socket and currentUser as props */}
            <Posts socket={socket} currentUser={currentUser} />
        </div>
    )
}

export default Home;