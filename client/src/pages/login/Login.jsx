import "./login.scss";
import { AuthContext } from "../../context/authContext";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SigninDemo from "../../components/signindemo/SigninDemo";

const Login = () => {

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [showEmptyInputMessage, setShowEmptyInputMessage] = useState(false);
    const [failedSigninMessage, setFailedSigninMessage] = useState("");

    const [signinInputs, setSigninInputs] = useState({ 
        id: "",
        password: "",
    });

    const formInputs = [
        {
            name: "id",
            type: "text",
            placeholder: showEmptyInputMessage ? "ID cannot be blank." : "Student/Club ID",
            value: signinInputs.id,
            required: true
        },
        {
            name: "password",
            type: "password",
            placeholder: showEmptyInputMessage ? "Password cannot be blank." : "Password",
            value: signinInputs.password,
            required: true
        },
    ];

    const validateForm = () => {
        if (!signinInputs.id || !signinInputs.password) {
            // Show the invalid message
            setShowEmptyInputMessage(true);

            // Hide the message after 3 seconds
            setTimeout(() => {
                setShowEmptyInputMessage(false);
            }, 3000);

            // exit the function
            return false;
        }

        // Check if the first letter of the id is not "c" or if the length is not equal to 6 or 10 characters
        if (!/^[C|c]\w{5}$|^\w{10}$/.test(signinInputs.id)) {
            setFailedSigninMessage("Invalid Id.");
            return false;
        }

        return true;
    };

    const handleChange = (e) => {
        // Transform the input to uppercase as the user types
        const { name, value } = e.target;
        if (name === "id") {
            setSigninInputs((prev) => ({
                ...prev,
                [name]: value.toUpperCase(),
            }));
        } else {
            setSigninInputs((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSignin = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        } 

        try {
            await login(signinInputs);
            navigate("/");
        }
        catch (error) {
            setFailedSigninMessage(error.response.data);
            // Display the message for 10 seconds
            setTimeout(() => {
                setFailedSigninMessage("");
            }, 10000); // 10 seconds in milliseconds
        }
    };

    return (
        <div className="login">
            <div className="card">
                <div className="login-input">
                    <div className="logo-container">
                        <img className="font-logo" src="/default/font-logo.webp" alt="logo" />
                    </div>
                    <h2>Sign In</h2>
                    <form>
                        {formInputs.map((input) => (
                            <input
                                key={input.name}
                                className={showEmptyInputMessage ? "input-invalid" : ""}
                                type={input.type}
                                placeholder={input.placeholder}
                                name={input.name}
                                onChange={handleChange}
                                value={input.value}
                                required={input.required}
                                onFocus={() => {setFailedSigninMessage("")}}
                            />
                        ))}
                        <div className="forgot-password-container">
                            <span onClick={() => {navigate("/forgot-password")}}>Forgot password?</span>
                        </div>
                        {failedSigninMessage && 
                            <div className="signin-error-message">
                                {failedSigninMessage}
                            </div>
                        }
                        <div className="button-div">
                            <button onClick={handleSignin}>Sign In</button>
                        </div>
                        <div className="auth-options">
                            <span>No account? <Link to="/register">Sign Up</Link></span>
                            <SigninDemo login={login} />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login;