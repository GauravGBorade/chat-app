import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import { Server } from "socket.io";
import userRoutes from "./Routes/userRoutes.js";
import chatRoutes from "./Routes/chatRoutes.js";
import messageRoutes from "./Routes/messageRoutes.js";
import path from "path";
import { fileURLToPath } from "url";

try {
  mongoose.connect(process.env.MONGODB_URL_STRING);
} catch (error) {
  console.log(error.message);
}

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.static(path.join(__dirname, "../../frontend/dist")));

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

//catch all routes - catch all requests which are not api request be handled by html file i.e. our frontend. it will use react router :)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
});

const port = 3000;
const chat = {
  key: "value",
};
const httpServer = app.listen(
  port,
  console.log(`Server started on port ${port}`)
);

// Event listener for new socket connections
const io = new Server(httpServer, {
  pingTimeout: 120000,
  cors: {
    origin: process.env.FRONTEND_URL,
  },
});

// Event listener for 'join chat' event sent by client to join a chat room
io.on("connection", (socket) => {
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
  });

  // Event listener for 'new message' event sent by client with a new message
  socket.on("new message", (newMessage) => {
    let chat = newMessage.chat;

    // Skip if the user is the sender of the message
    if (!chat.users) return;
    chat.users.forEach((user) => {
      if (user._id === newMessage.sender._id) return;
      socket.in(user._id).emit("message received", newMessage);
    });
  });

  // Clean up resources when socket disconnects
  socket.off("setup", () => {
    socket.leave(userData._id);
  });
});
