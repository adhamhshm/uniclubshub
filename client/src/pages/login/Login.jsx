import "./login.scss";
import { AuthContext } from "../../context/authContext";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {

    const { login } = useContext(AuthContext);

    const navigate = useNavigate();

    const [signinInputs, setSigninInputs] = useState({
        username: "",
        password: "",
    });

    const validateForm = () => {
        let errors = "";
        if (!signinInputs.username) {
            errors += "Username is empty.\n";
        }
        if (!signinInputs.password) {
            errors += "Password is empty.\n";
        }
        if (errors) {
            alert(errors);
            return true;
        }
    }

    const handleChange = (e) => {
        // Transform the input to uppercase as the user types
        const { name, value } = e.target;
        if (name === "username") {
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
        if (validateForm()) return;

        // Convert the entire username to uppercase
        signinInputs.username = signinInputs.username.toUpperCase();

        try {
            await login(signinInputs);
            navigate("/");
        }
        catch (error) {
            alert(error.response.data);
        }
    }

    return (
        <div className="login">
            <div className="card">
                <div className="left">
                    <h1>Let's Connect</h1>
                    <p>
                        ConnectHub is a dynamic and innovative platform designed to foster a 
                        thriving club culture within the university while streamlining club 
                        management processes. Serving as a central hub for students, it promotes 
                        clubs, enhances engagement, and simplifies administrative tasks.
                    </p>
                </div>
                <div className="right">
                    <h1>Login</h1>
                    <form>
                        <input type="text" placeholder="Student/Club Id" name="username" onChange={handleChange} value={signinInputs.username} />
                        <input type="password" placeholder="Password" name="password" onChange={handleChange} />
                        <div className="button-div">
                            <button onClick={handleSignin}>Sign In</button>
                        </div>
                        <p><span>No account?</span> <Link to="/register">Register Here</Link></p>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login;