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
    fixUserData();
  })
  .catch((err) => {
    console.log("Error connecting to database:", err);
  });

async function fixUserData() {
  try {
    // Find the user
    const user = await User.findOne({ email: "esh@gmail.com" });
    
    if (!user) {
      console.log("User not found!");
      process.exit(1);
    }

    console.log("Current data:");
    console.log("LinkedIn URL:", user.linkedinURL);
    console.log("Avatar URL:", user.avatar?.url);
    
    // Fix LinkedIn URL - add proper format
    if (!user.linkedinURL || user.linkedinURL === "https://") {
      user.linkedinURL = "https://linkedin.com/in/iamdwaseem";
      console.log("\n✓ Fixed LinkedIn URL to:", user.linkedinURL);
    }
    
    // Note about avatar: The avatar is a PDF file which can't be displayed as an image
    // You'll need to upload a proper image file (JPG, PNG, WebP) through the admin panel
    console.log("\n⚠️  WARNING: Avatar is a PDF file!");
    console.log("   Please upload a proper image file through the admin panel:");
    console.log("   1. Login to http://localhost:3000/admin");
    console.log("   2. Go to Profile");
    console.log("   3. Upload a new avatar image (JPG, PNG, or WebP)");
    
    await user.save();
    
    console.log("\n✓ User data updated successfully!");
    console.log("\nUpdated LinkedIn URL:", user.linkedinURL);
    
    process.exit(0);
  } catch (error) {
    console.error("Error updating user data:", error);
    process.exit(1);
  }
}
