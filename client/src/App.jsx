import "./globals.scss";

import { createBrowserRouter, RouterProvider, Outlet, Navigate } from "react-router-dom";
import { useContext } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import TopBar from "./components/navbar/TopBar";
import LeftBar from "./components/leftBar/LeftBar";
import RightBar from "./components/rightBar/RightBar";
import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";
import Unauthorized from "./pages/unauthorized/Unauthorized";
import ParticipantProfile from "./pages/participantProfile/ParticipantProfile";
import Explore from "./pages/explore/Explore";
import Event from "./pages/event/Event";
import { DarkModeContext } from "./context/darkModeContext";
import { AuthContext } from "./context/authContext";
import Activities from "./pages/activities/Activities";


function App() {

    const { currentUser } = useContext(AuthContext);
    const { darkMode } = useContext(DarkModeContext);
    
    const queryClient = new QueryClient({
        defaultOptions: {
          queries: {
            refetchIntervalInBackground: false,
            cacheTime: 10_000,
            refetchOnWindowFocus: false,
          },
        },
    });

    const Layout = () => {
        return (
            <QueryClientProvider client={queryClient} >
                <div className={`theme-${darkMode ? "dark" : "light" }`}>
                    <TopBar />
                    <div style={{display: "flex"}}>
                        <LeftBar currentUser={currentUser} />
                        <div style={{ flex: 6}}>
                            <Outlet />
                        </div>
                        <RightBar />
                    </div>
                </div>
            </QueryClientProvider>
        )
    };

    const ProtectedRoute = ({ children, requiredRole }) => {
        if (!currentUser) {
            return <Navigate to="/login" />
        }

        // Check if the user has the required role to access the route
        if (!currentUser && requiredRole && currentUser.role !== requiredRole) {
            // Redirect to a different route or show an unauthorized message
            return <Navigate to="/unauthorized" />;
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
                    element: <Home />
                },
                {
                    path: "/profile/:id",
                    element: <Profile />
                },
                {
                    path: "/event",
                    element: <Event />
                },
                {
                    path: "/activities",
                    element: <Activities />
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
                    element: <Home />
                },
                {
                    path: "/profile/participant/:id",
                    element: <ParticipantProfile />
                },
                {
                    path: "/explore",
                    element: <Explore />
                },
                {
                    path: "/activities",
                    element: <Activities />
                }
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
            path: "/unauthorized",
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
