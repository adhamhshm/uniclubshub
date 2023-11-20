import "./resetpassword.scss";
import { useState } from "react";
import { useLocation , useNavigate } from "react-router-dom";
import { makeRequest } from "../../request";

const ResetPassword = () => {

    const navigate = useNavigate();
    const [showEmptyInputMessage, setShowEmptyInputMessage] = useState(false);
    const [failedResetPasswordMessage, setFailedResetPasswordMessage] = useState("");
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const email = searchParams.get("email");
    const id = searchParams.get("id");

    console.log(email);

    const [passwordInputs, setPasswordInputs] = useState({ 
        newPassword: "",
        newConfirmPassword: "",
    });

    const formInputs = [
        {
            name: "newPassword",
            type: "password",
            placeholder: showEmptyInputMessage ? "Password cannot be blank." : "Password",
            value: passwordInputs.newPassword,
            required: true
        },
        {
            name: "newConfirmPassword",
            type: "password",
            placeholder: showEmptyInputMessage ? "Password cannot be blank." : "Confirm Password",
            value: passwordInputs.newConfirmPassword,
            required: true
        },
    ];

    const validateInput = () => {
        if (!passwordInputs.newPassword || !passwordInputs.newConfirmPassword) {
            // Show the invalid message
            setShowEmptyInputMessage(true);

            // Hide the message after 3 seconds
            setTimeout(() => {
                setShowEmptyInputMessage(false);
            }, 3000);

            // exit the function
            return false;
        }

        // Check if the password is at least 8 characters long
        if (passwordInputs.newPassword.length < 8) {
            setFailedResetPasswordMessage("Password must be at least 8 characters long.");
            return false;
        }

        // If password and confirm password not match
        if (passwordInputs.newPassword  !== passwordInputs.newConfirmPassword) {
            setFailedResetPasswordMessage("Password does not match.");
            return false;
        }

        return true;
    };

    const handleChange = (e) => {
        // Transform the input to uppercase as the user types
        const { name, value } = e.target;
        setPasswordInputs((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmitPassword = async (e) => {
        e.preventDefault();
        if (!validateInput()) {
            return;
        } 

        try {
            // This spreads all the properties of the passwordInputs object into a new object. 
            // It's a concise way to clone an object. 
            // If passwordInputs is an object with properties like { prop1: value1, prop2: value2, ... }, 
            // then { ...passwordInputs } creates a new object with the same properties and values.
            // The spread syntax is essential here to ensure that the properties of passwordInputs 
            // are directly included in the new object, not nested within another property.
            await makeRequest.put("/auth/reset-password", { ...passwordInputs, email: email, id: id })
            alert("Password has been reset.")
            navigate("/login");
        }
        catch (error) {
            setFailedResetPasswordMessage(error.response.data);
        }
        setPasswordInputs({});

    };

    return (
        <div className="reset-password">
            <div className="card">
                <div className="reset-password-input">
                    <div className="logo-container">
                        <img className="font-logo" src="/default/font-logo.webp" alt="logo" />
                    </div>
                    <h2>Reset Password</h2>
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
                                onFocus={() => {setFailedResetPasswordMessage("")}}
                            />
                        ))}
                        {failedResetPasswordMessage && 
                            <div className="reset-error-message">
                                {failedResetPasswordMessage}
                            </div>
                        }
                        <div className="button-div">
                            <button onClick={handleSubmitPassword}>Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ResetPassword;