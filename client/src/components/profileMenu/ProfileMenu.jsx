import "./profilemenu.scss";

import { useNavigate } from "react-router-dom";
import { makeRequest } from "../../request";
import { DarkModeContext } from "../../context/darkModeContext";
import { useContext, useRef } from "react";

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

    const handleSignout = async (e) => {
        e.preventDefault();
        try {
            await makeRequest.post("/auth/signout", {});
            localStorage.removeItem("user");
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
                        <img id="icon" src="/default/light.svg" alt="light mode" width={24} height={24} />
                    ) : (
                        <img id="icon" src="/default/dark.svg" alt="dark mode" width={24} height={24} />
                    )}
                    <span>Theme</span>
                </div>
                <div className="list sign-out-div" onClick={handleSignout}>
                    <img id="icon" src="/default/logout.svg" alt="logout" />
                    <span>Sign Out</span>
                </div>
            </div>
        </div>
    )
}

export default ProfileMenu;