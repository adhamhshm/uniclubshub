import "./register.scss";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { makeRequest } from "../../request";
import axios from "axios";

const Register = () => {

    const navigate = useNavigate();
    const [showEmptyInputMessage, setShowEmptyInputMessage] = useState(false);
    const [failedSignupMessage, setFailedSignupMessage] = useState("");

    const [signupInputs, setSignupInputs] = useState({
        id: "",
        email: "",
        password: "",
        confirmPassword: "",
        name: "",
        role: "",
    });

    const inputFields = [
        {
            name: "id",
            type: "text",
            placeholder: showEmptyInputMessage ? "ID cannot be blank." : "Student/Club ID",
            value: signupInputs.id,
            required: true
        },
        {
            name: "email",
            type: "email",
            placeholder: showEmptyInputMessage ? "Email cannot be blank." : "Email",
            value: signupInputs.email,
            required: true
        },
        {
            name: "password",
            type: "password",
            placeholder: showEmptyInputMessage ? "Password cannot be blank." : "Password",
            value: signupInputs.password,
            required: true
        },
        {
            name: "confirmPassword",
            type: "password",
            placeholder: showEmptyInputMessage ? "Password cannot be blank." : "Confirm Password",
            value: signupInputs.confirmPassword,
            required: true
        },
        {
            name: "name",
            type: "text",
            placeholder: showEmptyInputMessage ? "Name cannot be blank." : "Name",
            value: signupInputs.name,
            required: true
        },
    ];

    const handleChange = (e) => {
        // setSignupInputs((prev) => ({
        //     ...prev,
        //     [e.target.name]: e.target.value
        // }))
        
        // why "name" and "value"? (it may sounds confusing)
        // because that is the attribute used to identify each input field
        const { name, value } = e.target;
        if (name === "id") {
            // Capitalize the id
            setSignupInputs((prev) => ({
                ...prev,
                [name]: value.toUpperCase(),
            }));
        }
        else if (name === "name") {
            // Capitalize the first letter of each word in the name
            const capitalizedName = value
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    
            setSignupInputs((prev) => ({
                ...prev,
                [name]: capitalizedName,
            }));
        } 
        else {
            setSignupInputs((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    // Function to check if the form is filled out correctly.
    const validateForm = () => {
        for (const field of inputFields) {
            if (field.required && !signupInputs[field.name]) {
                // Show an empty input message if any required field is empty.
                setShowEmptyInputMessage(true);

                // Hide the message after 3 seconds.
                setTimeout(() => {
                    setShowEmptyInputMessage(false);
                }, 3000);

                return false; // Return false to indicate the form is not filled correctly.
            }
        }

        // Check if the password is at least 8 characters long
        if (signupInputs.password.length < 8) {
            setFailedSignupMessage("Password must be at least 8 characters long.");
            return false;
        }

        // If password and confirm password not match
        if (signupInputs.password !== signupInputs.confirmPassword) {
            setFailedSignupMessage("Password does not match.");
            return false;
        }

        // Check if the first letter of the id is "c" and the length is equal to 5 characters
        if (signupInputs.id.length === 6 && signupInputs.id[0].toUpperCase() === "C") {
            // Assign the "club" role
            signupInputs.role = "club";
        } else if (signupInputs.id.length === 10) {
            // Assign the "participant"
            signupInputs.role = "participant";
        } else {
            setFailedSignupMessage("Invalid Id.");
            return false;
        }

        // Regular expression for validating email format
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

        // Check if the email follows the standard email format
        if (!emailRegex.test(signupInputs.email)) {
            setFailedSignupMessage("Invalid email format.");
            return false;
        }

        return true; // Return true if the form is correctly filled out.
    };
    
    const handleSignup = async (e) => {
        e.preventDefault();

        // If form validation is false
        if (!validateForm()) {
            return;
        }

        // if there is no other error, send data to the server
        try {
            await makeRequest.post("/auth/signup", signupInputs);
            navigate("/login");
            alert("Successfully registered.");
        }
        catch (error) {
            setFailedSignupMessage(error.response.data);
            // Display the message for 10 seconds
            setTimeout(() => {
                setFailedSignupMessage("");
            }, 10000); // 10 seconds in milliseconds
        }
    }

    return (
        <div className="register">
            <div className="card">
                <div className="register-input">
                    <div className="logo-container">
                        <img className="font-logo" src="/default/font-logo.webp" alt="logo" />
                    </div>
                    <h2>Sign Up</h2>
                    <form>
                        {inputFields.map((input) => (
                            <input
                                key={input.name}
                                className={showEmptyInputMessage ? "input-invalid" : ""}
                                type={input.type}
                                placeholder={input.placeholder}
                                name={input.name}
                                onChange={handleChange}
                                value={input.value}
                                required={input.required}
                                onFocus={() => {setFailedSignupMessage("")}}
                            />
                        ))}
                        {failedSignupMessage && 
                            <div className="signup-error-message">
                                {failedSignupMessage}
                            </div>
                        }
                        <div className="button-div">
                            <button onClick={handleSignup}>Sign Up</button>
                        </div>
                        <p><span>Have an account?</span> <Link to="/login">Sign In</Link></p>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Register;