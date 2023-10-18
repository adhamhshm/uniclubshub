import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";
import multer from "multer";
import usersRoute from "./routes/users.js";
import participantsRoute from "./routes/participants.js";
import postsRoute from "./routes/posts.js";
import authRoute from "./routes/auth.js";
import likesRoute from "./routes/likes.js";
import commentsRoute from "./routes/comments.js";
import followRelationsRoute from "./routes/followRelations.js";

// Create an instance of the express application. 
const app = express();

// middlewares
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", true);
    next();
});
app.use(express.json());
app.use(cors({
    origin:"http://localhost:5173"
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

// for storing image
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "../client/public/upload")
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname)
    }
})
  
const upload = multer({ storage: storage })
app.post("/server/upload", upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded." });
    }
    const file = req.file;
    console.log(req.file);
    res.status(200).json(file.filename);
})

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