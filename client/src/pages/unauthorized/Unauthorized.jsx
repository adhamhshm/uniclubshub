import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {

    const navigate = useNavigate();
    const handleSignout = async () => {
        try {
            await axios.post("http://localhost:8800/server/auth/signout", { }, { withCredentials: true });
            localStorage.clear();
            navigate("/login");
        }
        catch (error) {
            alert(error.message);
        }
    }

    return (
        <div>
            <button onClick={handleSignout}>
                Unauthorized Page
            </button>
        </div>
    )
}

export default Unauthorized;