import "./profilemenu.scss";

import { useNavigate } from "react-router-dom";
import { makeRequest } from "../../request";
import { DarkModeContext } from "../../context/darkModeContext";
import { useContext, useRef } from "react";

// reference: https://mui.com/material-ui/material-icons/
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import LogoutIcon from '@mui/icons-material/Logout';

const ProfileMenu = ({ setOpenMenuModal }) => {

    const navigate = useNavigate();
    const { darkMode, toggle } = useContext(DarkModeContext);

    // Create a ref to hold a reference to the modal container
    const modalRef = useRef(null);

    // Function to handle clicks outside the modal
    const handleOutsideClick = (event) => {
        // Check if the modalRef exists and if the clicked element is outside the modal
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            // If the click is outside, close the modal
            setOpenMenuModal(false);
        }
    };

    const handleSignout = async () => {
        try {
            await makeRequest.post("/auth/signout", {});
            localStorage.clear();
            window.location.reload(false);
            navigate("/login");
        }
        catch (error) {
            alert(error.message);
        }
    }

    // Attach a 'mousedown' event listener to the document to call handleOutsideClick
    document.addEventListener('mousedown', handleOutsideClick);

    return (
        <div className="profile-menu">
            <div className="menu-list" ref={modalRef}>
                <div className="list theme-div" onClick={toggle} >
                    {/* render the icon based on the current theme */}
                    {darkMode ? (
                        <LightModeIcon style={{ cursor: "pointer" }} />
                    ) : (
                        <DarkModeIcon style={{ cursor: "pointer" }} />
                    )}
                    <span>Theme</span>
                </div>
                <div className="list sign-out-div" onClick={handleSignout}>
                    <LogoutIcon />
                    <span>Sign Out</span>
                </div>
            </div>
        </div>
    )
}

export default ProfileMenu;