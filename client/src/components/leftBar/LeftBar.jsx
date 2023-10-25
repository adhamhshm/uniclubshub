import "./leftbar.scss";
import { NavLink } from "react-router-dom";

import HomeIcon from '@mui/icons-material/HomeOutlined';
import SearchIcon from '@mui/icons-material/SearchOutlined';
import ActivityIcon from '@mui/icons-material/FormatListBulletedOutlined';
import ProfileIcon from '@mui/icons-material/PermIdentityOutlined';
import EventIcon from '@mui/icons-material/FolderOpenOutlined';

const LeftBar = ({ currentUser }) => {

    const clubUserLinks = [
        { to: "/", text: "Home", icon: <HomeIcon /> },
        { to: "/event", text: "Event", icon: <EventIcon /> },
        { to: "/activities", text: "Activities", icon: <ActivityIcon /> },
        { to: `/profile/${currentUser.id}`, text: "Profile", icon: <ProfileIcon /> },
    ];

    const participantUserLinks = [
        { to: "/", text: "Home", icon: <HomeIcon /> },
        { to: "/explore", text: "Explore", icon: <SearchIcon /> },
        { to: "/activities", text: "Activities", icon: <ActivityIcon /> },
        { to: `/profile/participant/${currentUser.id}`, text: "Profile", icon: <ProfileIcon /> },
    ];

    // Render different navigation links based on the user's role
    const renderUserNavigationLinks = () => {
        if (currentUser.role === "club") {
            return clubUserLinks;
        } 
        else {
            return participantUserLinks;
        }
    };

    return (
        <div className="leftbar">
            <div className="container">
                <div className="menu">
                    <div className="menu-list">
                        {/* links will be rendered based on the role */}
                        {renderUserNavigationLinks().map((link, index) => (
                            <NavLink
                                key={index}
                                to={link.to}
                                activeclassname ="active"
                                style={{ textDecoration: "none", color: "inherit" }}
                                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                            >
                                <span>{link.icon}</span>
                                <span>{link.text}</span>
                            </NavLink>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LeftBar;