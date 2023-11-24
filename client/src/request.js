import axios from "axios";

// This is used to standardized the API endpoint request to the server
// The instance is exported, making it available for use in other parts of your application. 
export const makeRequest = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL_DEV || import.meta.env.VITE_BASE_URL_PROD,
    withCredentials: true,
});

// baseURL: This is the base URL for all requests made with this instance.
// withCredentials: This is set to true, which means that Axios will send 
// credentials (like cookies) with cross-origin requests. 
// This is often necessary when dealing with authentication.
