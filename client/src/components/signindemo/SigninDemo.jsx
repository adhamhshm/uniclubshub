import "./signindemo.scss";
import { useNavigate } from "react-router-dom";

const SigninDemo = ({ login }) => {

    const navigate = useNavigate();
    const signinInputsParticipant = { 
        id: import.meta.env.VITE_DEMO_PARTICIPANT_ID,
        password: import.meta.env.VITE_DEMO_PARTICIPANT_PASSWORD,
    };

    const signinInputsClub = { 
        id: import.meta.env.VITE_DEMO_CLUB_ID,
        password: import.meta.env.VITE_DEMO_CLUB_PASSWORD,
    };

    const handleSigninParticipant = async () => {
        try {
            await login(signinInputsParticipant);
            navigate("/");
        }
        catch (error) {
            alert("Something went wrong. Please try again.");
        }
    };

    const handleSigninClub = async () => {
        try {
            await login(signinInputsClub);
            navigate("/");
        }
        catch (error) {
            alert("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="signin-demo disable-select">
            <div>
                <span id="sign-in-demo-label" onClick={handleSigninParticipant}>
                    Sign In Participant Demo
                </span>
            </div>
            <div>
                <span onClick={handleSigninClub}>
                    Sign In Club User Demo
                </span>
            </div>
        </div>
    )
}

export default SigninDemo;