import "./forgotpassword.scss";
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { makeRequest } from "../../request";

const ForgotPassword = () => {

    const navigate = useNavigate();
    const [showEmptyInputMessage, setShowEmptyInputMessage] = useState(false);
    const [email, setEmail] = useState("");
    const [failedSendMessage, setFailedSendMessage] = useState("");
    const [sendEmailMessage, setSendEmailMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    const validateInput = () => {
        if (!email) {
            // Show the invalid message
            setShowEmptyInputMessage(true);

            // Hide the message after 3 seconds
            setTimeout(() => {
                setShowEmptyInputMessage(false);
            }, 3000);

            // exit the function
            return false;
        }

        // Check if the email follows the standard email format
        if (!emailRegex.test(email)) {
            setFailedSendMessage("Invalid email format.");
            return false;
        }

        return true;
    }

    const handleSend = async (e) => {
        e.preventDefault();
        if (!validateInput()) {
            return;
        }

        try {
            setIsLoading(true);
            const response = await makeRequest.post("/auth/email", { email });
            if (response.status === 200) {
                // Show the invalid message
                setSendEmailMessage("A reset link has been sent to your email.");
                // setTimeout(() => {
                //     navigate("/login");
                // }, 10000);
            }
        }
        catch (error) {
            setFailedSendMessage(error.response.data);
        }
        finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="forgot-password">
            <div className="card">
                <div className="forgot-password-input">
                    <div className="logo-container">
                        <img className="font-logo" src="/default/font-logo.webp" alt="logo" />
                    </div>
                    <h2>Forgot Password</h2>
                    <form>
                        <input
                            className={showEmptyInputMessage ? "input-invalid" : ""}
                            type="text"
                            placeholder={showEmptyInputMessage ? "Please fill in this field." : "Enter you email"}
                            name="email"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            onFocus={() => {setFailedSendMessage(""); setSendEmailMessage("")}}
                            //autoComplete="off"
                        />
                        {failedSendMessage && 
                            <div className="send-error-message">
                                {failedSendMessage}
                            </div>
                        }
                        {sendEmailMessage && 
                            <div className="send-success-message">
                                {sendEmailMessage}
                            </div>
                        }
                        <div className="button-div">
                            <button 
                                className={isLoading ? "disabled-button" : ""}
                                onClick={handleSend}
                            >
                                {isLoading ? "Loading..." : "Send Reset Link"}
                            </button>
                        </div>
                        <p><span></span><Link to="/login">Sign In</Link></p>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword;