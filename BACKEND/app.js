import dotenv from "dotenv";
dotenv.config({ path: "./config/config.env" });

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import dbConnection from "./database/dbConnection.js";
import { errorMiddleware } from "./middlewares/error.js";
import messageRouter from "./router/messageRoutes.js";
import userRouter from "./router/userRouter.js";
import timelineRouter from "./router/timelineRoutes.js";
import softwareApplicationRouter from "./router/softwareApplicationRoutes.js";
import skillRouter from "./router/skillRoutes.js";
import projectRouter from "./router/projectRoutes.js";
const app = express();

// Database connection
dbConnection();

// Simple health endpoint for connectivity checks
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Middleware
const allowedOrigins = [process.env.PORTFOLIO_URI, process.env.DASHBOARD_URI].filter(
  Boolean
);
app.use(
  cors({
    origin: (origin, callback) => {
      // allow same-origin or explicit allowlist
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
// Request logging middleware
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    console.log("Headers:", req.headers);
    console.log("Body:", req.body);
    next();
  });
}

// File upload middleware
app.use(
  fileUpload({
    useTempFiles: true, // required for tempFilePath
    tempFileDir: "/tmp/", // temporary folder for uploads
    createParentPath: true, // auto-create folder if missing
  })
);

// Routes
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/timeline", timelineRouter);
app.use("/api/v1/softwareapplication", softwareApplicationRouter);
app.use("/api/v1/skill", skillRouter);
app.use("/api/v1/projects", projectRouter);

// Error handling middleware (must come last)
app.use(errorMiddleware);

export default app;
