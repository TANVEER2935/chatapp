import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const port = 3000;
const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Basic route
app.get("/", (req, res) => {
  res.send("Hello world");
});

// Socket.IO events
io.on("connection", (socket) => {
  console.log(`🔌 User connected: ${socket.id}`);

  socket.on("message", (data) => {
    console.log(`📩 Message received in room ${data.RoomID}: ${data.message}`);
    socket.to(data.RoomID).emit("receive-message", data);
  });

  socket.on("disconnect", () => {
    console.log(`❌ User disconnected: ${socket.id}`);
  });
});

// Start the server
server.listen(port, () => {
  console.log(`🚀 Server listening on http://localhost:${port}`);
});
