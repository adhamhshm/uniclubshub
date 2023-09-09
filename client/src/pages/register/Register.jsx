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
    });

    const handleChange = (e) => {
        setSignupInputs((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    };

    const validateForm = () => {
        let errors = "";
        if (!signupInputs.username) {
            errors += "Username is empty.\n";
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
                        <input type="text" placeholder="Username" name="username" value={signupInputs.username} onChange={handleChange} />
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