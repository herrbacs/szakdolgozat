import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";

const port = Number(process.env.SOCKET_PORT || 4000);
const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:3000";

const app = express();
app.use(cors({ origin: corsOrigin, credentials: true }));
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: corsOrigin,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log(`[socket] client connected id=${socket.id} ip=${socket.handshake.address}`);

  socket.on("join-room", (payload = {}) => {
    const roomId = payload.roomId;
    console.log(`[socket] join-room requested socketId=${socket.id} roomId=${String(roomId)}`);

    if (!roomId || typeof roomId !== "string") {
      console.warn(`[socket] join-room rejected socketId=${socket.id} reason=invalid-roomId`);
      socket.emit("join-room-error", { message: "Invalid roomId" });
      return;
    }

    socket.join(roomId);
    console.log(`[socket] join-room success socketId=${socket.id} roomId=${roomId}`);
    socket.emit("join-room-success", { roomId });
  });

  socket.on("disconnect", (reason) => {
    console.log(`[socket] client disconnected id=${socket.id} reason=${reason}`);
  });
});

app.get("/health", (_req, res) => {
  console.log("[http] GET /health");
  res.json({ status: "ok" });
});

app.post("/events/level-generation", (req, res) => {
  const { roomId, step, status, message, meta, timestamp } = req.body || {};
  console.log("[http] POST /events/level-generation", {
    roomId,
    step,
    status,
    hasMessage: typeof message === "string" && message.length > 0,
    timestamp,
  });

  if (!roomId || typeof roomId !== "string") {
    console.warn("[http] POST /events/level-generation rejected: invalid roomId");
    return res.status(400).json({ message: "roomId is required" });
  }

  const eventPayload = {
    roomId,
    step: typeof step === "string" ? step : "unknown",
    status: typeof status === "string" ? status : "in_progress",
    message: typeof message === "string" ? message : "",
    meta: meta && typeof meta === "object" ? meta : {},
    timestamp: typeof timestamp === "string" ? timestamp : new Date().toISOString(),
  };

  const roomSize = io.sockets.adapter.rooms.get(roomId)?.size ?? 0;
  console.log(`[socket] emit level-generation-update roomId=${roomId} listeners=${roomSize}`);
  io.to(roomId).emit("level-generation-update", eventPayload);
  return res.json({ delivered: true });
});

server.listen(port, () => {
  console.log(`Socket server listening on port ${port}`);
});
