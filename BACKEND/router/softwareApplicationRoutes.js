import express from "express";
import {
  addNewApplication,
  deleteApplication,
  updateApplication,
  getAllApplications,
} from "../controller/softwareApplicationController.js";
import { isAuthenticated } from "../middlewares/auth.js";
const router = express.Router();

router.post("/add", isAuthenticated, addNewApplication);
router.delete("/delete/:id", isAuthenticated, deleteApplication);
router.put("/update/:id", isAuthenticated, updateApplication);
router.get("/getall", getAllApplications);

export default router;
