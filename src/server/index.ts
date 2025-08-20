import app from "./app";
import { createServer } from "http";
import { initializeWebSocket } from "./websocket";
import { getPorts } from "../env";

const { backend: PORT } = getPorts();

// Create HTTP server
const httpServer = createServer(app);

// Initialize WebSocket
const _io = initializeWebSocket(httpServer);

// Start server
httpServer.listen(PORT, () => {
  console.log(`🚀 NextGen ERP API Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`📦 Inventory API: http://localhost:${PORT}/api/inventory`);
  console.log(`🔌 WebSocket Server: ws://localhost:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
});
