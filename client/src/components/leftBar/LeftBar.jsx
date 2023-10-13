import "./leftbar.scss";
import { NavLink  } from "react-router-dom";

const sideLinks = ["Home", "Explore", "Activities", "Profile"]

const LeftBar = (currentUser) => {
    return (
        <div className="leftbar">
            <div className="container">
                <div className="menu">
                    <div className="menu-list">
                        <NavLink to="/" activeClassName="active" onClick={() => window.scrollTo({top: 0, behavior: "smooth"})}>
                            <span>Home</span>
                        </NavLink>
                        <NavLink to="/explore" activeClassName="active" style={{ textDecoration: "none", color: "inherit" }} onClick={() => window.scrollTo({top: 0, behavior: "smooth"})}>
                            <span>Explore</span>
                        </NavLink>
                        <NavLink to="/activities" activeClassName="active" style={{ textDecoration: "none", color: "inherit" }} onClick={() => window.scrollTo({top: 0, behavior: "smooth"})}>
                            <span>Activities</span>
                        </NavLink>
                        <NavLink to={`/profile/${currentUser.currentUser.id}`} activeClassName="active" onClick={() => window.scrollTo({top: 0, behavior: "smooth"})} >
                                <span>Profile</span>
                        </NavLink>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LeftBar;