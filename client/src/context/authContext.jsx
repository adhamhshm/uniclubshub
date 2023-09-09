import axios from "axios";
import { useEffect, useState } from "react";
import { createContext } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem("user")) || null);

    const login = async (signinInputs) => {
        const res = await axios.post("http://localhost:8800/server/auth/signin", signinInputs, { withCredentials: true });
        setCurrentUser(res.data);
    };

    useEffect(() => {
        // we cannot store object inside localStorage, but string can
        localStorage.setItem("user", JSON.stringify(currentUser));
    }, [currentUser]);

    return (
        <AuthContext.Provider value={{ currentUser, login }}>
            {children}
        </AuthContext.Provider>
    )
};