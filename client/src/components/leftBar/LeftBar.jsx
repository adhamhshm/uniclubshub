import "./leftbar.scss";

const sideLinks = ["Home", "Explore", "Activities", "Profile"]

const LeftBar = () => {
    return (
        <div className="leftbar">
            <div className="container">
                <div className="menu">
                    <div className="upper">
                        {sideLinks.map((link) => {
                            return (
                                <div key={link}>
                                    <span>{link}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LeftBar;