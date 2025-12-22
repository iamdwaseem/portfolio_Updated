import mongoose from "mongoose";
import { User } from "./models/userSchema.js";
import dotenv from "dotenv";

dotenv.config({ path: "./config/config.env" });

// Connect to database
mongoose
  .connect(process.env.MONGO_URI, {
    dbName: "PORTFOLIO",
  })
  .then(() => {
    console.log("Connected to database");
    updateUserPassword();
  })
  .catch((err) => {
    console.log("Error connecting to database:", err);
  });

async function updateUserPassword() {
  try {
    // Find the user by email
    const user = await User.findOne({ email: "esh@gmail.com" });
    
    if (!user) {
      console.log("User not found!");
      process.exit(1);
    }

    console.log("Found user:", user.email);
    
    // Update password to "admin123"
    user.password = "admin123";
    await user.save();
    
    console.log("Password updated successfully to: admin123");
    console.log("You can now login with:");
    console.log("Email: esh@gmail.com");
    console.log("Password: admin123");
    
    process.exit(0);
  } catch (error) {
    console.error("Error updating password:", error);
    process.exit(1);
  }
}
