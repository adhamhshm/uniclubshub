import "./profilemenu.scss";
import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";

const ProfileMenu = () => {


    const navigate = useNavigate();

    const handleSignout = async () => {
        try {
            await axios.post("http://localhost:8800/server/auth/signout", { }, { withCredentials: true });
            localStorage.clear();
            window.location.reload(false);
            navigate("/login");
        }
        catch (error) {
            alert(error.message);
        }
    }

    return (
        <div className="profileMenu">
            <div className="wrapper">
                <div className="button-div">
                    <button onClick={handleSignout}>
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ProfileMenu;