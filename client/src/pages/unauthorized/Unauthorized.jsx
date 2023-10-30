import "./unauthorized.scss";
import { useNavigate } from "react-router-dom";
import { makeRequest } from "../../request";

const Unauthorized = () => {

    const navigate = useNavigate();
    const handleSignout = async () => {
        try {
            await makeRequest.post("/auth/signout", {});
            localStorage.clear();
            navigate("/login");
        }
        catch (error) {
            alert(error.message);
        }
    }

    return (
        <div className="unauthorized">
            <div className="unauthorized-container">
                <div className="title">
                    <h2>
                        Not Found / Unauthorized
                    </h2>
                    <p>
                        You may have entered an incorrect URL.
                    </p>
                </div>
                <div className="button-container">
                    <button onClick={() => {navigate("/")}}>
                        Back to Home
                    </button>
                    <button className="sign-out-button" onClick={handleSignout}>
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Unauthorized;