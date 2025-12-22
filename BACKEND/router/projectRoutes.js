import express from "express";
import {
  addNewProject,
  deleteProject,
  updateProject,
  getAllProjects,
  getSingleProject,
} from "../controller/projectController.js";
import { isAuthenticated } from "../middlewares/auth.js";
const router = express.Router();
router.post("/addNewProject", isAuthenticated, addNewProject);
router.delete("/deleteProject/:id", isAuthenticated, deleteProject);
router.put("/updateProject/:id", isAuthenticated, updateProject);
router.get("/getSingleProject/:id", getSingleProject);
router.get("/getAllProjects", getAllProjects);
export default router;
