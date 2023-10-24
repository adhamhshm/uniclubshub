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

    // this function is being called in the UpdateProfile component, when the user is updating their profile photo
    const updateProfilePhotoData = (updatedProfilePhotoUrl) => {

        // Update the user's data in the currentUser state
        setCurrentUser((prevUserData) => ({
            ...prevUserData,
            profilePhoto: updatedProfilePhotoUrl,
        }));

        // Also update the user's data in localStorage
        const objectJSON = JSON.parse(localStorage.getItem("user"));
        if (objectJSON) {
            objectJSON.profilePhoto = updatedProfilePhotoUrl;
            const updatedObjectJSON = JSON.stringify(objectJSON);
            localStorage.setItem("user", updatedObjectJSON);
        }
        else {
            console.log("The user item does not exist in localStorage.");
        }
    }

    // fetch the token authorization from the server
    const authorizeToken = async () => {
        try {
            const response = await axios.get("http://localhost:8800/server/auth/authorizeToken", { withCredentials: true });
            console.log(response.data); // Response will indicate if the token is valid
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    };

    useEffect(() => {
        // we cannot store object inside localStorage, but string can
        localStorage.setItem("user", JSON.stringify(currentUser));
    }, [currentUser]);

    return (
        <AuthContext.Provider value={{ currentUser, login, updateProfilePhotoData, authorizeToken }}>
            {children}
        </AuthContext.Provider>
    )
};