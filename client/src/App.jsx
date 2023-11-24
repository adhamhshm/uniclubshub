import "./globals.scss";

import { createBrowserRouter, RouterProvider, Outlet, useNavigate } from "react-router-dom";
import { useCallback, useContext, useEffect, useMemo } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DarkModeContext } from "./context/darkModeContext";
import { AuthContext } from "./context/authContext";
import { io } from "socket.io-client";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import TopBar from "./components/topbar/TopBar";
import BottomNavbar from "./components/bottomnavbar/BottomNavbar";
import LeftBar from "./components/leftbar/LeftBar";
import RightBar from "./components/rightBar/RightBar";
import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";
import Unauthorized from "./pages/unauthorized/Unauthorized";
import ParticipantProfile from "./pages/participantProfile/ParticipantProfile";
import Explore from "./pages/explore/Explore";
import Event from "./pages/event/Event";
import Activities from "./pages/activities/Activities";
import PostView from "./pages/postView/PostView";
import ForgotPassword from "./pages/forgotPassword/ForgotPassword";
import ResetPassword from "./pages/resetPassword/ResetPassword";

function App() {

    const { currentUser, authorizeToken } = useContext(AuthContext);
    const { darkMode } = useContext(DarkModeContext);
    const socket = io(import.meta.env.VITE_SOCKET_URL_DEV || import.meta.env.VITE_SOCKET_URL_PROD);

    /* 
    useMemo(() => ..., []): This hook takes a function as its first argument, 
    which contains the computation you want to memoize. The second argument is an array of dependencies. 
    If any of these dependencies change between renders, the memoized value will be recomputed.

    new QueryClient({ ... }): This part creates a new instance of the QueryClient. 
    The QueryClient is a part of the React Query library and is used to manage the 
    state of queries and mutations in your application.

    The object passed as an argument to QueryClient configures its default options. 
    In this case, it sets the default options for all queries with refetchOnWindowFocus: false. 
    This means that queries won't automatically refetch when the window regains focus.

    [] as the second argument to useMemo: Since there are no dependencies specified, 
    the memoized value (in this case, the QueryClient instance) will be created only once 
    during the initial render and won't be recreated on subsequent renders.
     */
    const queryClient = useMemo(() => new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false,
            },
        },
    }), []);

    useEffect(() => {
        socket?.emit("newUser", currentUser?.id);
    }, [socket, currentUser?.id]);

    const Layout = () => {
        return (
            <QueryClientProvider client={queryClient} >
                <div className={`theme-${darkMode ? "dark" : "light" }`}>
                    <TopBar />
                    <div style={{display: "flex"}}>
                        <LeftBar currentUser={currentUser} socket={socket} />
                        <div style={{ flex: 6 }}>
                            <Outlet />
                        </div>
                        <RightBar currentUser={currentUser} />
                    </div>
                    <BottomNavbar currentUser={currentUser} socket={socket} />
                </div>
            </QueryClientProvider>
        )
    };

    const ProtectedRoute = ({ children }) => {

        const navigate = useNavigate();
        
        const checkToken = useCallback(async () => {
            const isTokenValid = await authorizeToken();
            if (isTokenValid === false) {
                localStorage.removeItem("user");
                navigate("/login");
            }
        }, [authorizeToken, navigate]);
    
        useEffect(() => {
            checkToken();
        }, [checkToken, authorizeToken, navigate]);
        
        // children is the protected Layout
        return children;
    }

    const router = createBrowserRouter([
        {
            path: "/",
            element: (
                <ProtectedRoute requiredRole="club">
                    <Layout />
                </ProtectedRoute>
            ),
            children: [
                { path: "/", element: <Home socket={socket} currentUser={currentUser}/> },
                { path: "/profile/:id", element: <Profile socket={socket} /> },
                { path: "/event", element: <Event /> },
                { path: "/activities", element: <Activities /> },
                { path: "/postview/:id", element: <PostView socket={socket} /> }
            ]
        },
        {
            path: "/",
            element: (
                <ProtectedRoute requiredRole="participant">
                    <Layout />
                </ProtectedRoute>
            ),
            children: [
                { path: "/", element: <Home socket={socket} currentUser={currentUser} /> },
                { path: "/profile/participant/:id", element: <ParticipantProfile /> },
                { path: "/explore", element: <Explore socket={socket} /> },
                { path: "/activities", element: <Activities /> },
                { path: "/postview/:id", element: <PostView socket={socket} /> },
            ]
        },
        { path: "/login", element: <Login /> },
        { path: "/register", element: <Register /> },
        { path: "/forgot-password", element: <ForgotPassword /> },
        { path: "/reset-password", element: <ResetPassword /> },
        { path: "*", element: <Unauthorized /> }
    ]);

    return (
        <div>
            <RouterProvider router={router} />
        </div>
    )
};

export default App;
