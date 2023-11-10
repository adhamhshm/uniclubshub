import "./leftbar.scss";

import { NavLink } from "react-router-dom";
import { clubUserLinks, participantUserLinks } from "../../constants/navlinks";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

const LeftBar = ({ currentUser, socket }) => {

    const queryClient = useQueryClient();
    const [notifications, setNotifications] = useState([]);
    // Render different navigation links based on the user's role
    const userLinks = currentUser?.role === 'club' ? clubUserLinks : participantUserLinks;

    useEffect(() => {
        socket?.on("getNotifications", data => { 
            setNotifications((prevNotifications) => [...prevNotifications, data]) })
    }, [socket]);

    return (
        <div className="leftbar">
            <div className="menu">
                <div className="menu-list">
                    {/* links will be rendered based on the role */}
                    {userLinks.map((link, index) => (
                        <NavLink
                            className="navlinks"
                            key={index}
                            to={link.to.replace(':id', currentUser?.id)}
                            activeclassname ="active"
                            style={{ textDecoration: "none", color: "inherit" }}
                            onClick={() => {
                                window.scrollTo({ top: 0, behavior: "smooth" });
                                if (link.text === "Activities") {
                                    setNotifications([]);
                                    queryClient.invalidateQueries(["activities", currentUser?.id]);
                                }
                            }}
                        >
                            <span><img src={link.icon} alt={link.text} /></span>
                            <span>{link.text}</span>
                            {link.text === "Activities" && notifications.length > 0 && <div className="notification-dot" />}
                        </NavLink>
                    ))}
                </div>
            </div>    
        </div>
    )
};

export default LeftBar;