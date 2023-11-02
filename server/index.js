import cors from "cors";
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
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";

// Load environment variables from .env file
dotenv.config();

// Create an instance of the express application. 
const app = express();

// middlewares
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", true);
    next();
});
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors({
    origin: process.env.INTERNAL_CLIENT_URL
}));
app.use(cookieParser());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(fileUpload({
//     useTempFiles : true,
//     tempFileDir : '/tmp/'
// }));
// app.use(express.static("public"));
// app.use('/upload', express.static('upload'));

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

// This line starts the web server and makes it listen on port 8800 
// for incoming HTTP requests. When a request is received on this port, 
// the provided callback function is executed. In this case, the callback 
// function simply logs the message "Server working." to the console.
app.listen(8800, () => {
    console.log("Connected to the server.")
});

// to test the users route purposes
// import usersRoute from "./routes/users.js";
// go to http://localhost:8800/server/users/test
// app.use("/server/users", usersRoute);