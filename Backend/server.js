import { config } from "dotenv";
import app from "./src/app.js";
import http from "http";
import connectDB from "./src/config/database.js";
import {initSocket}  from "./src/sockets/server.socket.js";

const PORT = process.env.PORT ?? 3000;
const httpServer = http.createServer(app);
initSocket(httpServer);
connectDB().catch((err) => {
  console.error("Failed to connect to the database:", err);
  process.exit(1);
});

httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
