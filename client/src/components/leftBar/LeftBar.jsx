import "./leftbar.scss";
import { NavLink } from "react-router-dom";

const LeftBar = ({ currentUser }) => {

    const clubUserLinks = [
        { to: "/", text: "Home" },
        { to: "/events", text: "Events" },
        { to: "/activities", text: "Activities" },
        { to: `/profile/${currentUser.id}`, text: "Profile" },
    ];

    const participantUserLinks = [
        { to: "/", text: "Home" },
        { to: "/explore", text: "Explore" },
        { to: "/activities", text: "Activities" },
        { to: `/profile/participant/${currentUser.id}`, text: "Profile" },
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
                                activeClassName="active"
                                style={{ textDecoration: "none", color: "inherit" }}
                                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                            >
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