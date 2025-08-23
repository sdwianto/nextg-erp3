import { io } from "socket.io-client";

// SOLUSI B: Hardcode origin & path dari ENV publik (hindari konstruksi URL otomatis)
const ORIGIN =
  process.env.NEXT_PUBLIC_WS_ORIGIN ??
  (typeof window !== "undefined" ? window.location.origin : "");

const PATH = process.env.NEXT_PUBLIC_WS_PATH ?? "/api/websocket";

export const socket = io(ORIGIN, {
  path: PATH,
  transports: ["websocket", "polling"], // fallback polling biar tetap jalan
  reconnection: true,
  reconnectionAttempts: 10,
  timeout: 20000,
  forceNew: true,
  autoConnect: true,
});

socket.on("connect", () => {
  // eslint-disable-next-line no-console
  // console.log("WS connected", { ORIGIN, PATH, id: socket.id });
});

socket.on("connect_error", (err) => {
  // eslint-disable-next-line no-console
  console.error("WS connect_error", err?.message, { ORIGIN, PATH });
});

socket.on("disconnect", (reason) => {
  // eslint-disable-next-line no-console
  // console.log("WS disconnected", reason, { ORIGIN, PATH });
});

// ERP-specific event handlers
socket.on("dashboard-update", (data) => {
  // eslint-disable-next-line no-console
  // console.log("📊 Dashboard update received", data);
});

socket.on("alert", (data) => {
  // eslint-disable-next-line no-console
  // console.log("🚨 Alert received", data);
});

socket.on("equipment-status", (data) => {
  // eslint-disable-next-line no-console
  // console.log("🔧 Equipment status update", data);
});

socket.on("inventory-update", (data) => {
  // eslint-disable-next-line no-console
  // console.log("📦 Inventory update", data);
});

export default socket;
