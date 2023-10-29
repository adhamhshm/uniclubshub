import ClubList from "../clublist/ClubList";
import "./rightbar.scss";

const RightBar = ({ currentUser }) => {

    return (
        <div className="rightbar">
            <div className="rightbar-container">
                <ClubList currentUser={currentUser} />
            </div>
        </div>
    )
}

export default RightBar;