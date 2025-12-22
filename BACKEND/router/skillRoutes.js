import express from "express";
import {
  addSkill,
  deleteSkill,
  updateSkill,
  getAllSkills,
} from "../controller/skillController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();
router.post("/addSkill", isAuthenticated, addSkill);
router.delete("/deleteSkill/:id", isAuthenticated, deleteSkill);
router.put("/updateSkill/:id", isAuthenticated, updateSkill);
router.get("/getAllSkills", getAllSkills);

export default router;
