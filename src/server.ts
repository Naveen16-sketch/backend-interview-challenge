import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Database } from "./db/database";
import { createTaskRouter } from "./routes/tasks";
import { createSyncRouter } from "./routes/sync";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config();

const app = express();
const PORT: number = parseInt(process.env.PORT || "3000", 10); // ✅ force number

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
const db = new Database(process.env.DATABASE_URL || "./data/tasks.sqlite3");

// --- Health check route ---
app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Routes
app.use("/api/tasks", createTaskRouter(db));
app.use("/api", createSyncRouter(db));

// Error handling
app.use(errorHandler);

// Start server
async function start() {
  try {
    await db.initialize();
    console.log("Database initialized");

   app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

start();

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down gracefully");
  await db.close();
  process.exit(0);
});
