import "./topbar.scss";

// reference: https://mui.com/material-ui/material-icons/
import MoonIcon from '@mui/icons-material/Brightness4Rounded';
import SunIcon from '@mui/icons-material/Brightness5Rounded';

import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { DarkModeContext } from "../../context/darkModeContext";
import { AuthContext } from "../../context/authContext";
import ProfileMenu from "../profileMenu/ProfileMenu";

const TopBar = () => {

    const { darkMode, toggle } = useContext(DarkModeContext);
    const { currentUser } = useContext(AuthContext);
    const [openMenuModal, setOpenMenuModal] = useState(false);

    return (
        <div className="navbar">
            <div className="left">
                <Link to="/" style={{ textDecoration: "none" }} onClick={() => window.scrollTo({top: 0, behavior: "smooth"})} >
                    <span>UNICLUBSHUB</span>
                </Link>
                {/* render the icon based on the current theme */}
                {darkMode ? (
                    <SunIcon style={{ cursor: "pointer" }} onClick={toggle} />
                ) : (
                    <MoonIcon style={{ cursor: "pointer" }} onClick={toggle} />
                )}
            </div>
            <div className="right">
                {/* <NotificationIcon style={{ cursor: "pointer" }} /> */}
                <div className="user" onClick={() => setOpenMenuModal(!openMenuModal)}>
                    <img 
                        src={currentUser.profilePhoto ? 
                            "/upload/" + currentUser.profilePhoto : 
                            (currentUser.role === "club" ? "/default/default-club-image.png" : "/default/default-participant-image.png")} 
                        alt="profile photo" 
                    />
                    {/* <span>{currentUser.name}</span> */}
                    {openMenuModal && <ProfileMenu setOpenMenuModal={setOpenMenuModal} />}
                    {/* <button>Sign Out</button> */}
                </div>
            </div>
        </div>
    )
}

export default TopBar;