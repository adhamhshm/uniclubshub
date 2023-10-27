import "./profilemenu.scss";
import axios from "axios";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { makeRequest } from "../../request"

const ProfileMenu = ({ setOpenMenuModal }) => {

    const navigate = useNavigate();

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
            await makeRequest.post("http://localhost:8800/server/auth/signout", {});
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
        <div className="profileMenu" ref={modalRef}>
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