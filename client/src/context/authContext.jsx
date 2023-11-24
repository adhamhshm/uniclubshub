import { useEffect, useState } from "react";
import { createContext } from "react";
import { makeRequest } from "../request.js";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {

    const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem("user")) || null);

    const login = async (signinInputs) => {
        const res = await makeRequest.post("/auth/signin", signinInputs);
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
            const response = await makeRequest.get(`/auth/authorizeToken?currentUserId=${currentUser?.id}&role=${currentUser?.role}`, {});
            // Check if the response status is OK (200)
            if (response.status === 200) {
                return true;
            } 
            else {
                return false;
            }
        } 
        catch (error) {
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