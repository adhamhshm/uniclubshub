import "./rightbar.scss";
import CloseIcon from '@mui/icons-material/CloseOutlined';

const RightBar = () => {
    return (
        <div className="rightbar">
            <div className="container">
                <div className="item">
                    <span>Suggestion Users</span>
                    <div className="user">
                        <div className="userInfo">
                            <span>User</span>
                        </div>
                        <div className="buttons">
                            <button>Follow</button>
                            <CloseIcon className="icon" style={{cursor: "pointer"}} />
                        </div>
                    </div>
                </div>
                {/* Second item div */}
                <div className="item">
                    <span>Activities</span>
                    <div className="user">
                        <div className="userInfo">
                            <span>User is using user's account</span>
                        </div>
                        <span>1 min ago</span>
                    </div>
                </div>
                {/* Third item div */}
                <div className="item">
                    <span>Online Friends</span>
                    <div className="user">
                        <div className="userInfo">
                            <img src="https://images.pexels.com/photos/4009626/pexels-photo-4009626.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="user photo" />
                            <div className="online" />
                            <span>User</span>
                        </div>
                    </div>
                    <div className="user">
                        <div className="userInfo">
                            <img src="https://images.pexels.com/photos/4009626/pexels-photo-4009626.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="user photo" />
                            <div className="online" />
                            <span>User</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RightBar;