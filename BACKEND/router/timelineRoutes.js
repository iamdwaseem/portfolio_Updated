import express from "express";
import {
  postTimeLine,
  deleteTimeline,
  updateTimeline,
  getAllTimeLines,
} from "../controller/timelineController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/add", isAuthenticated, postTimeLine);
router.delete("/delete/:id", isAuthenticated, deleteTimeline);
router.put("/update/:id", isAuthenticated, updateTimeline);
router.get("/getall", getAllTimeLines);
export default router;
