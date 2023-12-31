import "./topbar.scss";

import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import ProfileMenu from "../profileMenu/ProfileMenu";

const TopBar = () => {

    const { currentUser } = useContext(AuthContext);
    const [openMenuModal, setOpenMenuModal] = useState(false);

    return (
        <div className="topbar">
            <div className="topbar-container">
                <div className="left">
                    <Link to="/" style={{ textDecoration: "none" }} onClick={() => window.scrollTo({top: 0, behavior: "smooth"})} >
                        <img className="font-logo" src="/default/font-logo.webp" alt="logo" />
                    </Link>
                </div>
                <div className="right">
                    <div className="user" onClick={() => setOpenMenuModal(!openMenuModal)}>
                        <img 
                            id="user-image"
                            src={currentUser?.profilePhoto ? 
                                currentUser?.profilePhoto : 
                                (currentUser?.role === "club" ? "/default/default-club-image.webp" : "/default/default-participant-image.webp")} 
                            alt="profile photo" 
                        />
                        {openMenuModal && <ProfileMenu setOpenMenuModal={setOpenMenuModal} />}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TopBar;