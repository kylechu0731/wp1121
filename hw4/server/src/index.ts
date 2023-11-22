import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

import { Message } from "@/package/types/message";

dotenv.config();

const app = express();
app.use(cors());
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  // New user has connected
  console.log("A user connected");
  // User has disconnected
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
  // User has sent a message
  socket.on("send_message", (newMessage: Message) => {
    io.emit("receive_message", newMessage);
  });
  socket.on("create_room", (senderId: string, receiverId: string) => {
    io.emit("create_room", senderId, receiverId);
  });
  socket.on("delete_room", (viewerId: string, counterId: string) => {
    io.emit("delete_room", viewerId, counterId);
  });
  socket.on("unsend_message", (id: number) => {
    io.emit("unsend_message", id);
  });
  socket.on("set_announce", (viewerId: string, counterId: string, announceId: string) => {
    io.emit("set_announce", viewerId, counterId, announceId);
  })
  socket.on("read_message", (viewerId: string, counterId: string) => {
    io.emit("read_message", viewerId, counterId);
  })
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const port = process.env.PORT || 3001;
server.listen(port, () => {
  console.log("Server running on http://localhost:" + port);
});
