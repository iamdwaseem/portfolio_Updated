import { User } from "../models/userSchema.js";
import { catchAsyncErrors } from "./catchAsyncError.js";
import ErrorHandler from "./error.js";
import jwt from "jsonwebtoken";

export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  console.log("=== AUTH MIDDLEWARE HIT ===");
  const { Token } = req.cookies;
  console.log("Token from cookies:", Token ? "EXISTS" : "MISSING");
  if (!Token) {
    return next(new ErrorHandler("User not authenticated", 400));
  }
  const decoded = jwt.verify(Token, process.env.JWT_SECRET_KEY);
  req.user = await User.findById(decoded.id);
  console.log("User authenticated:", req.user?.email);
  next();
});
