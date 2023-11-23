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

// middlewares
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", process.env.INTERNAL_CLIENT_URL);
    res.header("Access-Control-Allow-Credentials", true);
    next();
});
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors({
    origin: process.env.INTERNAL_CLIENT_URL,
    credentials: true,
}));
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
const server = http.createServer(app);

// Initialize Socket.io by passing the HTTP server
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
    console.log("Add user: " + userId + " " + socketId) 
};

// This function is used to remove a user from the onlineUsers array when they disconnect. 
// It filters the onlineUsers array to exclude the user with the specified socketId.
const removeUser = (socketId) => {
    onlineUsers = onlineUsers.filter(user => user.socketId !== socketId);
};

// This function is used to retrieve user information from the onlineUsers array based on their userId
const getUser = (userId) => {
    console.log("Get user: " + userId) 
    return onlineUsers.find((user) => user.userId === userId)
};

// Define a Socket.io event handler for the "connection" event, which fires when a user connects to the Socket.io server
io.on("connection", (socket) => {
    console.log("A user is connected");
    
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
        console.log("Receiver User: " + receiverUserId);
        const receiver = getUser(receiverUserId);
        console.log("Receiver: " + receiver);

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
        console.log("A user is disconnected");
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