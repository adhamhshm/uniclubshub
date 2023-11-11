import "./globals.scss";

import { createBrowserRouter, RouterProvider, Outlet, Navigate, useNavigate } from "react-router-dom";
import { useCallback, useContext, useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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
import { DarkModeContext } from "./context/darkModeContext";
import { AuthContext } from "./context/authContext";
import { io } from "socket.io-client";
import PostView from "./pages/postView/PostView";

function App() {

    const { currentUser, authorizeToken } = useContext(AuthContext);
    const { darkMode } = useContext(DarkModeContext);
    const [socket, setSocket] = useState(null);
    
    const queryClient = new QueryClient({
        defaultOptions: {
          queries: {
            refetchIntervalInBackground: false,
            cacheTime: 10_000,
            refetchOnWindowFocus: false,
          },
        },
    });

    

    useEffect(() => {
        setSocket(io("http://localhost:8800"));
    }, []);

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
                console.log("hello")
                localStorage.clear();
                navigate("/login");
            }
        }, [authorizeToken]);
    
        useEffect(() => {
            checkToken();
        }, []);
        
        if (!currentUser) {
            return <Navigate to="/login" />;
        }
        
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
                {
                    path: "/",
                    element: <Home socket={socket} currentUser={currentUser}/>
                },
                {
                    path: "/profile/:id",
                    element: <Profile socket={socket} />
                },
                {
                    path: "/event",
                    element: <Event />
                },
                {
                    path: "/activities",
                    element: <Activities />
                },
                {
                    path: "/postview/:id",
                    element: <PostView socket={socket} />
                }
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
                {
                    path: "/",
                    element: <Home socket={socket} currentUser={currentUser} />
                },
                {
                    path: "/profile/participant/:id",
                    element: <ParticipantProfile />
                },
                {
                    path: "/explore",
                    element: <Explore socket={socket} />
                },
                {
                    path: "/activities",
                    element: <Activities />
                },
                {
                    path: "/postview/:id",
                    element: <PostView socket={socket} />
                },
            ]
        },
        {
            path: "/login",
            element: <Login />
        },
        {
            path: "/register",
            element: <Register />
        },
        {
            path: "*",
            element: <Unauthorized />
        }
    ]);

    return (
        <div>
            <RouterProvider router={router} />
        </div>
    )
};

export default App;
