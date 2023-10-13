import "./register.scss";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const Register = () => {

    const navigate = useNavigate();

    const [signupInputs, setSignupInputs] = useState({
        username: "",
        email: "",
        password: "",
        name: "",
        role: "",
    });

    const handleChange = (e) => {
        // setSignupInputs((prev) => ({
        //     ...prev,
        //     [e.target.name]: e.target.value
        // }))
        const { name, value } = e.target;
        if (name === "username") {
            setSignupInputs((prev) => ({
                ...prev,
                [name]: value.toUpperCase(),
            }));
        } else {
            setSignupInputs((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const validateForm = () => {
        let errors = "";
        if (!signupInputs.username) {
            errors += "Id is empty.\n";
        }
        if (!signupInputs.email) {
            errors += "Email is empty.\n";
        }
        if (!signupInputs.password) {
            errors += "Password is empty.\n";
        }
        if (!signupInputs.name) {
            errors += "Name is empty.\n";
        }
        if (errors) {
            alert(errors);
            return true;
        }
    }
    
    const handleSignup = async (e) => {
        e.preventDefault();
        if (validateForm()) return;

        // Check if the first letter of the username is "c" and the length is equal to 5 characters
        if (signupInputs.username.length === 6 && signupInputs.username[0].toUpperCase() === "C") {
            // Assign the "club" role
            signupInputs.role = "club";
        } else if (signupInputs.username.length === 10) {
            // Assign the "participant"
            signupInputs.role = "participant";
        } else {
            alert("Invalid Id.");
            return;
        }

        try {
            await axios.post("http://localhost:8800/server/auth/signup", signupInputs);
            navigate("/login");
            alert("Successfully registered.");
        }
        catch (error) {
            alert(error.response.data);
        }
    }

    return (
        <div className="register">
            <div className="card">
                <div className="right">
                    <h1>Let's Connect</h1>
                    <p>
                        ConnectHub is a dynamic and innovative platform designed to foster a 
                        thriving club culture within the university while streamlining club 
                        management processes. Serving as a central hub for students, it promotes 
                        clubs, enhances engagement, and simplifies administrative tasks.
                    </p>
                </div>
                <div className="left">
                    <h1>Register</h1>
                    <form>
                        <input type="text" placeholder="Student/Club Id" name="username" value={signupInputs.username} onChange={handleChange} />
                        <input type="email" placeholder="Email" name="email" value={signupInputs.email} onChange={handleChange} />
                        <input type="password" placeholder="Password" name="password" value={signupInputs.password} onChange={handleChange} />
                        <input type="text" placeholder="Name" name="name" value={signupInputs.name} onChange={handleChange} />
                        <div className="button-div">
                            <button onClick={handleSignup}>Sign Up</button>
                        </div>
                        <p><span>Have acount?</span> <Link to="/login">Sign In Here</Link></p>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Register;