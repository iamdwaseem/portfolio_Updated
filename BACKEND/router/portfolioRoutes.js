import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { exportPortfolio } from "../controller/portfolioExportController.js";

const router = express.Router();

router.post("/export", isAuthenticated, exportPortfolio);

export default router;
