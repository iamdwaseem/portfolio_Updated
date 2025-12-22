import mongoose from "mongoose";
import { User } from "./models/userSchema.js";
import { Project } from "./models/projectSchema.js";
import dotenv from "dotenv";

dotenv.config({ path: "./config/config.env" });

// Connect to database
mongoose
  .connect(process.env.MONGO_URI, {
    dbName: "PORTFOLIO",
  })
  .then(() => {
    console.log("Connected to database");
    fixImages();
  })
  .catch((err) => {
    console.log("Error connecting to database:", err);
  });

async function fixImages() {
  try {
    // Find the user
    const user = await User.findOne({ email: "esh@gmail.com" });
    
    if (!user) {
      console.log("User not found!");
      process.exit(1);
    }

    console.log("Current user data:");
    console.log("Avatar URL:", user.avatar?.url);
    console.log("LinkedIn URL:", user.linkedinURL);
    
    // Fix avatar - use a placeholder image instead of PDF
    if (user.avatar?.url && user.avatar.url.endsWith('.pdf')) {
      console.log("\n⚠️  Avatar is a PDF file, updating to placeholder image...");
      user.avatar = {
        public_id: "avatar_placeholder",
        url: "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.fullName) + "&size=256&background=4A90E2&color=fff&bold=true"
      };
      console.log("✓ Updated avatar to:", user.avatar.url);
    }
    
    // Fix LinkedIn URL if needed
    if (user.linkedinURL && !user.linkedinURL.includes('/in/')) {
      const username = user.linkedinURL.split('linkedin.com/')[1];
      if (username) {
        user.linkedinURL = `https://linkedin.com/in/${username}`;
        console.log("✓ Fixed LinkedIn URL to:", user.linkedinURL);
      }
    }
    
    await user.save();
    console.log("\n✓ User data updated successfully!");
    
    // Fix project banners that are PDFs
    console.log("\n\nChecking projects for PDF banners...");
    const projects = await Project.find({});
    
    for (const project of projects) {
      if (project.bannerImage?.url && project.bannerImage.url.endsWith('.pdf')) {
        console.log(`\n⚠️  Project "${project.title}" has PDF banner`);
        project.bannerImage = {
          public_id: "project_banner_placeholder",
          url: "https://via.placeholder.com/800x400/4A90E2/FFFFFF?text=" + encodeURIComponent(project.title)
        };
        await project.save();
        console.log(`✓ Updated to placeholder: ${project.bannerImage.url}`);
      }
    }
    
    console.log("\n\n✅ All images fixed!");
    console.log("\n📝 Summary:");
    console.log("- Avatar: Updated to UI Avatars placeholder");
    console.log("- LinkedIn: Fixed URL format");
    console.log("- Projects: Updated PDF banners to placeholders");
    console.log("\n💡 Next steps:");
    console.log("1. Login to admin panel: http://localhost:3000/login");
    console.log("2. Upload your actual images to replace placeholders");
    console.log("3. Refresh homepage to see changes!");
    
    process.exit(0);
  } catch (error) {
    console.error("Error fixing images:", error);
    process.exit(1);
  }
}
