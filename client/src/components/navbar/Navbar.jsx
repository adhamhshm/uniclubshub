import "./navbar.scss";

// reference: https://mui.com/material-ui/material-icons/
import HomeIcon from '@mui/icons-material/HomeRounded';
import MoonIcon from '@mui/icons-material/Brightness4Rounded';
import SunIcon from '@mui/icons-material/Brightness5Rounded';
import SearchIcon from '@mui/icons-material/SearchRounded';
import NotificationIcon from '@mui/icons-material/NotificationsRounded';
import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { DarkModeContext } from "../../context/darkModeContext";
import { AuthContext } from "../../context/authContext";
import ProfileMenu from "../profileMenu/ProfileMenu";

const Navbar = () => {

    const { darkMode, toggle } = useContext(DarkModeContext);
    const { currentUser } = useContext(AuthContext);
    const [openMenuModal, setOpenMenuModal] = useState(false);

    return (
        <div className="navbar">
            <div className="left">
                <Link to="/" style={{ textDecoration: "none" }} onClick={() => window.scrollTo({top: 0, behavior: "smooth"})} >
                    <span>ConnectHub</span>
                </Link>
                {/* render the icon based on the current theme */}
                {darkMode ? (
                    <SunIcon style={{ cursor: "pointer" }} onClick={toggle} />
                ) : (
                    <MoonIcon style={{ cursor: "pointer" }} onClick={toggle} />
                )}
                {/* <div className="search">
                    <SearchIcon />
                    <input type="text" placeholder="Search here..." />
                </div> */}
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
                    {openMenuModal && <ProfileMenu />}
                    {/* <button>Sign Out</button> */}
                </div>
            </div>
        </div>
    )
}

export default Navbar;