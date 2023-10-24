import "./register.scss";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const Register = () => {

    const navigate = useNavigate();

    const [signupInputs, setSignupInputs] = useState({
        id: "",
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

    const validateForm = () => {
        let errors = "";
        if (!signupInputs.id) {
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
            return;
        }
    }
    
    const handleSignup = async (e) => {
        e.preventDefault();
        if (validateForm()) return;

        // Check if the first letter of the id is "c" and the length is equal to 5 characters
        if (signupInputs.id.length === 6 && signupInputs.id[0].toUpperCase() === "C") {
            // Assign the "club" role
            signupInputs.role = "club";
        } else if (signupInputs.id.length === 10) {
            // Assign the "participant"
            signupInputs.role = "participant";
        } else {
            alert("Invalid Id.");
            return true;
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
                        ConnectHub is a platform designed to foster a thriving club culture 
                        within the university to promotes clubs and enhance students' engagement.
                    </p>
                </div>
                <div className="left">
                    <h1>Register</h1>
                    <form>
                        <input type="text" placeholder="Student/Club Id" name="id" value={signupInputs.id} onChange={handleChange} />
                        <input type="email" placeholder="Email" name="email" value={signupInputs.email} onChange={handleChange} />
                        <input type="password" placeholder="Password" name="password" value={signupInputs.password} onChange={handleChange} />
                        <input type="text" placeholder="Name" name="name" value={signupInputs.name} onChange={handleChange} />
                        <div className="button-div">
                            <button onClick={handleSignup}>Sign Up</button>
                        </div>
                        <p><span>Have account?</span> <Link to="/login">Sign In Here</Link></p>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Register;