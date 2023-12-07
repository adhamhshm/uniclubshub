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

    // Defines a protected route component that checks if the user is authenticated and has the required role.
    const ProtectedRoute = ({ children, requiredRole }) => {

        const navigate = useNavigate();

        if (currentUser?.role !== requiredRole) {
            // Redirect to unauthorized page if the user's role doesn't match the required role
            navigate("/unauthorized");
        }

        const checkToken = useCallback(async () => {
            const isTokenValid = await authorizeToken();
            if (!currentUser || isTokenValid === false) {
                localStorage.removeItem("user");
                navigate("/login");
            };

        }, [authorizeToken]);
    
        useEffect(() => {
            checkToken();
        }, [checkToken, authorizeToken, navigate]);
        
        // children is the protected Layout
        // The children prop represents the content enclosed within the opening and 
        // closing tags of the ProtectedRoute component. In the case --> <Layout />
        // The children prop refers to the <Layout /> component that is passed as a child to the ProtectedRoute. 
        // This means that when the route is accessed and the user is authenticated and has the required role, 
        // the <Layout /> component will be rendered as part of the protected content.
        return children;
    }

    const generateRoleRoutes = (role, socket, currentUser) => [
        {
            path: "/",
            element: (
                <ProtectedRoute requiredRole={role}>
                    <Layout />
                </ProtectedRoute>
            ),
            // The children array defines child routes that are nested within the protected route. 
            // These routes are specific to the user's role.
            children: [
                { 
                    path: "/", 
                    element: <Home socket={socket} currentUser={currentUser} /> 
                },
                { 
                    path: role === "club" ? "/event" : "/unauthorized", 
                    element: role === "club" ? <Event /> : <Unauthorized /> 
                },
                { 
                    path: role === "participant" ? "/explore" : "/unauthorized", 
                    element: role === "participant" ? <Explore socket={socket} /> : <Unauthorized /> 
                },
                { 
                    path: role === "club" ? "/profile/:id" : "/profile/participant/:id", 
                    element: role === "club" ? <Profile socket={socket} /> : <ParticipantProfile /> },
                { 
                    path: "/activities", 
                    element: <Activities /> },
                { 
                    path: "/postview/:id", 
                    element: <PostView socket={socket} /> 
                },
            ],
        },
    ];
      
    // The spread operator (...) is used to spread the elements of an array or object. In the code you provided, 
    // the spread operator is used to include the generated role-specific routes from the generateRoleRoutes function 
    // in the array of routes for the application.
    const router = createBrowserRouter([
        ...generateRoleRoutes(currentUser?.role, socket, currentUser),
        { 
            path: "/login", 
            element: <Login /> 
        },
        { 
            path: "/register", 
            element: <Register /> 
        },
        { 
            path: "/forgot-password", 
            element: <ForgotPassword /> 
        },
        { 
            path: "/reset-password", 
            element: <ResetPassword /> 
        },
        { 
            path: "*", 
            element: <Unauthorized /> 
        },
    ]);

    // The RouterProvider is being used to provide the routing configuration (router) to the component tree.
    // The 'router' prop is being passed to the RouterProvider component, and it likely contains the routing 
    // configuration for the application. This configuration determines how different URLs or paths in the 
    // application map to different components.
    return (
        <div>
            <RouterProvider router={router} />
        </div>
    )
};

export default App;
