import { io } from "socket.io-client";

// DISABLED WEBSOCKET FOR DEVELOPMENT
// const ORIGIN =
//   process.env.NEXT_PUBLIC_WS_ORIGIN ??
//   (typeof window !== "undefined" ? window.location.origin : "");

// const PATH = process.env.NEXT_PUBLIC_WS_PATH ?? "/api/websocket";

// export const socket = io(ORIGIN, {
//   path: PATH,
//   transports: ["websocket", "polling"], // fallback polling biar tetap jalan
//   reconnection: true,
//   reconnectionAttempts: 10,
//   timeout: 20000,
//   forceNew: true,
//   autoConnect: true,
// });

// Mock socket object for development
const mockSocket = {
  id: 'mock-socket-id',
  connected: true,
  disconnected: false,
  on: (event: string, callback: Function) => {
    // Mock socket: listening to ${event}
    return mockSocket;
  },
  off: (event: string, callback?: Function) => {
    // Mock socket: stopped listening to ${event}
    return mockSocket;
  },
  emit: (event: string, data?: any) => {
    // Mock socket: emitted ${event}
    return mockSocket;
  },
  connect: () => {
    // Mock socket: connect called
    return mockSocket;
  },
  disconnect: () => {
    // Mock socket: disconnect called
    return mockSocket;
  },
};

export const socket = mockSocket;

// DISABLED ORIGINAL SOCKET EVENT HANDLERS
/*
socket.on("connect", () => {
  // console.log("WS connected", { ORIGIN, PATH, id: socket.id });
});

socket.on("connect_error", (err) => {
  console.error("WS connect_error", err?.message, { ORIGIN, PATH });
});

socket.on("disconnect", (reason) => {
  // console.log("WS disconnected", reason, { ORIGIN, PATH });
});

// ERP-specific event handlers
socket.on("dashboard-update", (data) => {
  // console.log("📊 Dashboard update received", data);
});

socket.on("alert", (data) => {
  // console.log("🚨 Alert received", data);
});

socket.on("equipment-status", (data) => {
  // console.log("🔧 Equipment status update", data);
});

socket.on("inventory-update", (data) => {
  // console.log("📦 Inventory update", data);
});
*/

export default socket;
