import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { prisma } from "./db";

// Import routes - Commented out as we're using tRPC for internal API
// import { inventoryRouter } from "./api/routers/inventory.js";
// import { rentalMaintenanceRouter } from "./api/routers/rentalMaintenance.js";
// import { operationsRouter } from "./api/routers/operations.js";

const app = express();

import { getCorsConfig } from "../env";

// Middleware
app.use(helmet()); // Security headers
app.use(cors(getCorsConfig()));
app.use(morgan("combined")); // Logging
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "NextGen ERP API is running",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "NextGen ERP API Server",
    endpoints: {
      health: "/health",
      websocket: "ws://localhost:3001",
      api: "/api/*"
    },
    timestamp: new Date().toISOString(),
  });
});

// Test endpoints for real-time features
app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "Test endpoint working",
    data: {
      inventory: {
        totalItems: 0,
        lowStock: 0,
        outOfStock: 0,
        value: 0
      },
      equipment: {
        total: 0,
        inUse: 0,
        maintenance: 0
      }
    }
  });
});

// API Routes - Commented out as we're using tRPC for internal API
// app.use("/api/inventory", inventoryRouter);
// app.use("/api/rental-maintenance", rentalMaintenanceRouter);
// app.use("/api/operations", operationsRouter);

// Error handling middleware
app.use((err: unknown, req: express.Request, res: express.Response, next: express.NextFunction) => {
  // console.error("Unhandled error:", err);
  
  res.status(500).json({
    success: false,
    error: "Internal server error",
    message: process.env.NODE_ENV === "development" ? (err instanceof Error ? err.message : "Unknown error") : "Something went wrong",
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    error: "Endpoint not found",
    path: req.originalUrl,
  });
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  // console.log("SIGTERM received, shutting down gracefully");
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGINT", async () => {
  // console.log("SIGINT received, shutting down gracefully");
  await prisma.$disconnect();
  process.exit(0);
});

export default app;
