import { Server } from "socket.io";
import cors from "cors";
import http from "http";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import usersRoute from "./routes/users.js";
import participantsRoute from "./routes/participants.js";
import postsRoute from "./routes/posts.js";
import authRoute from "./routes/auth.js";
import likesRoute from "./routes/likes.js";
import commentsRoute from "./routes/comments.js";
import followRelationsRoute from "./routes/followRelations.js";
import eventsRoute from "./routes/events.js";
import imagesRoutes from "./routes/images.js";
import activitiesRoutes from "./routes/activities.js";
import committeesRoutes from "./routes/committees.js";

// Load environment variables from .env file
dotenv.config();

// Create an instance of the express application. 
const app = express();

// Middlewares for CORS, that is a security feature implemented by web browsers that controls how web pages
// in one domain can request and interact with resources from another domain.
app.use((req, res, next) => {
    // This sets the Access-Control-Allow-Origin header in the HTTP response. 
    // It specifies which origins are permitted to access the resources of the server. 
    // In this case, it's dynamically set based on the value of the INTERNAL_CLIENT_URL environment variable. 
    // This allows requests from the specified origin to access the server.
    res.header("Access-Control-Allow-Origin", process.env.INTERNAL_CLIENT_URL);
    // This header indicates whether the browser should include credentials (like cookies or HTTP authentication) with requests. 
    // By setting it to true, the server indicates that the requested domain can include credentials in the request.
    res.header("Access-Control-Allow-Credentials", true);
    // This header specifies the HTTP methods that are allowed when accessing the resource. 
    // In this case, the server allows GET, POST, PUT, and DELETE requests.
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    // This header specifies the HTTP headers that can be used when making the actual request. 
    // It lists the standard headers that can be used, such as Origin, X-Requested-With, Content-Type, and Accept.
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    // This is a call to the next function, indicating that the middleware has completed its work, and 
    // the request should be passed on to the next middleware in the stack.
    next();
});
// This line sets up middleware to parse incoming requests with application/x-www-form-urlencoded data. 
// It is commonly used to parse form data submitted by HTML forms.

// The express.urlencoded middleware is used to parse incoming requests with URL-encoded payloads. 
// The extended: false option indicates that the URL-encoded data should be parsed with the querystring library, and 
// not with the qs library. The parsed data is made available in the req.body object of the request.
app.use(express.urlencoded({ extended: false }));
// The express.json() middleware is used to parse JSON-encoded payloads in incoming requests. 
// It parses the JSON data and makes it available in the req.body object of the request.
app.use(express.json());
// The cors middleware is used to handle CORS headers. It sets the Access-Control-Allow-Origin header 
// to the specified origin (INTERNAL_CLIENT_URL), and it allows credentials to be included with the request by setting credentials: true. 
// This is crucial when the frontend, served from a different origin, needs to make requests to your server.
app.use(cors({
    origin: process.env.INTERNAL_CLIENT_URL,
    credentials: true,
}));
// The cookieParser middleware parses cookies attached to the incoming request and makes 
// them available in the req.cookies object. This is useful when handling HTTP requests that 
// include cookies, such as those for user authentication.
app.use(cookieParser());

// set up the endpoints
app.use("/server/users", usersRoute);
app.use("/server/participants", participantsRoute);
app.use("/server/posts", postsRoute);
app.use("/server/auth", authRoute);
app.use("/server/likes", likesRoute);
app.use("/server/comments", commentsRoute);
app.use("/server/follow_relations", followRelationsRoute);
app.use("/server/events", eventsRoute);
app.use("/server/images", imagesRoutes);
app.use("/server/activities", activitiesRoutes);
app.use("/server/committees", committeesRoutes);

// Create an HTTP server using the Express app
// The server is initialized with the previously configured Express app (app).
const server = http.createServer(app);

// Initialize Socket.io by passing the HTTP server
// This code initializes Socket.io by creating a new instance of the Server class and passing 
// the HTTP server (server) to it. The options object is provided as the second argument, where 
// the cors property is configured to specify the allowed origin (INTERNAL_CLIENT_URL) and allow credentials. 
// This is necessary for handling WebSocket connections from the specified origin.
const io = new Server(server, {
    cors: {
        origin: process.env.INTERNAL_CLIENT_URL,
        credentials: true,
    }
});

// store information about connected users
let onlineUsers = [];
// In-memory data store for storing notifications for users who are not currently connected.
const notifications = {};

// This function is used to add a user to the onlineUsers array if the user doesn't already exist in the array.
const addUser = (userId, socketId) => {
    !onlineUsers.some((user) => user.userId === userId) && onlineUsers.push({ userId, socketId })
    //console.log("Add user: " + userId + " " + socketId) 
};

// This function is used to remove a user from the onlineUsers array when they disconnect. 
// It filters the onlineUsers array to exclude the user with the specified socketId.
const removeUser = (socketId) => {
    onlineUsers = onlineUsers.filter(user => user.socketId !== socketId);
};

// This function is used to retrieve user information from the onlineUsers array based on their userId
const getUser = (userId) => {
    //console.log("Get user: " + userId) 
    return onlineUsers.find((user) => user.userId === userId)
};

// Define a Socket.io event handler for the "connection" event, which fires when a user connects to the Socket.io server
io.on("connection", (socket) => {
    //console.log("A user is connected");

    // Handle connection error
    socket.on("error", (err) => {
        console.log("Socket connection error:", err.message);
        // You can perform any necessary actions when the connection fails.
    });
    
    // This event is emitted when a user logs in.
    socket.on("newUser", (userId) => {
        // Check for stored notifications for this user
        if (notifications[userId] && notifications[userId].length > 0) {
            // Send stored notifications to the user
            socket.emit("getNotifications", notifications[userId]);
            // Clear stored notifications for the user
            notifications[userId] = [];
        }
        // Add the user to the onlineUsers array.
        addUser(userId, socket.id);
    });

    socket.on("sendNotification", ({ senderUserId, receiverUserId, activityType }) => {
        //console.log("Receiver User: " + receiverUserId);
        const receiver = getUser(receiverUserId);
        //console.log("Receiver: " + receiver);

        // When this event is received, it checks if the receiver of the notification is connected
        if (receiver) {
            // Send the notification to the connected user
            io.to(receiver.socketId).emit("getNotifications", [{ senderUserId, activityType }]);
        } else {
            // User is not connected, store the notification for later retrieval
            if (!notifications[receiverUserId]) {
                notifications[receiverUserId] = [];
            }
            notifications[receiverUserId].push({ senderUserId, activityType });
        }
    });

    // Called when a user disconnects. 
    socket.on("disconnect", () => {
        //console.log("A user is disconnected");
        removeUser(socket.id);
    })
});

// Listen on the same port for both Express and Socket.io
const port = process.env.INTERNAL_SERVER_PORT;
server.listen(port, () => {
    console.log(`Server and WebSocket are running on port ${port}`);
});

// This line starts the web server and makes it listen on port 8800 
// for incoming HTTP requests. When a request is received on this port, 
// the provided callback function is executed. In this case, the callback 
// function simply logs the message "Server working." to the console.
// app.listen(8800, () => {
//     console.log("Connected to the server.")
// });

// to test the users route purposes
// import usersRoute from "./routes/users.js";
// go to http://localhost:8800/server/users/test
// app.use("/server/users", usersRoute);