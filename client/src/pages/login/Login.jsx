import "./login.scss";
import { AuthContext } from "../../context/authContext";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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
            placeholder: showEmptyInputMessage ? "Id cannot be blank." : "Student/Club Id",
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
    }

    return (
        <div className="login">
            <div className="card">
                <div className="left">
                    <h1>Let's Connect</h1>
                    <p>
                        Uniclubshub is a platform designed to foster a thriving club culture 
                        within the university to promotes clubs and enhance students' engagement.
                    </p>
                </div>
                <div className="right">
                    <h1>Login</h1>
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
                        {failedSigninMessage && 
                            <div className="signin-error-message">
                                {failedSigninMessage}
                            </div>
                        }
                        <div className="button-div">
                            <button onClick={handleSignin}>Sign In</button>
                        </div>
                        <p><span>No account?</span><Link to="/register"> Register Here</Link></p>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login;