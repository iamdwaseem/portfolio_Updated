import express from "express";
import {
  forgotPassword,
  getUser,
  getUserForPortfolio,
  logout,
  register,
  resetPassword,
  updatePassword,
  updateProfile,
} from "../controller/userController.js";
import { login } from "../utils/jwtToken.js";
import { isAuthenticated } from "../middlewares/auth.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", isAuthenticated, logout);
router.get("/me", isAuthenticated, getUser);
router.put("/me/update", isAuthenticated, updateProfile);
router.put("/me/update/password", isAuthenticated, updatePassword);
router.get("/me/portfolio", getUserForPortfolio);
router.post("/password/forgot", forgotPassword);
router.put("/password/reset/:token", resetPassword);
export default router;
