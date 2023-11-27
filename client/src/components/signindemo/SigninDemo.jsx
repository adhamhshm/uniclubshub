import "./signindemo.scss";
import { useNavigate } from "react-router-dom";

const SigninDemo = ({ login }) => {

    const navigate = useNavigate();
    const signinInputs = { 
        id: import.meta.env.VITE_DEMO_ID,
        password: import.meta.env.VITE_DEMO_PASSWORD,
    };

    const handleSignin = async (e) => {
        
        try {
            await login(signinInputs);
            navigate("/");
        }
        catch (error) {
            alert("Something went wrong.");
        }
    };

    return (
        <>
            <span onClick={handleSignin}>
                Sign In Participant Demo
            </span>
        </>
    )
}

export default SigninDemo;