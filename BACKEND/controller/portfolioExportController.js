import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import { Project } from "../models/projectSchema.js";
import { Skill } from "../models/skillSchema.js";
import { Timeline } from "../models/timelineSchema.js";
import { SoftwareApplication } from "../models/softwareApplicationSchema.js";
import { User } from "../models/userSchema.js";
import { v2 as cloudinary } from "cloudinary";

export const exportPortfolio = catchAsyncErrors(async (req, res, next) => {
  const [user, projects, skills, timelines, applications] = await Promise.all([
    User.findById(req.user._id),
    Project.find(),
    Skill.find(),
    Timeline.find(),
    SoftwareApplication.find(),
  ]);

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  const portfolioData = {
    profile: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      github: user.githubURL,
      linkedin: user.linkedinURL,
      headline: "Computer Science Engineering Student | Full Stack Developer",
      bio: user.aboutMe,
      location: "Hyderabad, India",
    },
    education: timelines.map((t) => ({
      institution: t.title,
      degree: t.description,
      field: "",
      startYear: t.timeline?.from ? new Date(t.timeline.from).getFullYear().toString() : "",
      endYear: t.timeline?.to ? new Date(t.timeline.to).getFullYear().toString() : "",
      cgpa: t.cgpa || "",
    })),
    projects: projects.map((p) => ({
      id: p._id,
      title: p.title,
      description: p.description,
      techStack: Array.isArray(p.technologies)
        ? p.technologies
        : p.technologies
          ? p.technologies.split(",").map((s) => s.trim())
          : [],
      features: [],
      category: p.stack || "Full Stack",
      status: p.deployed || "Completed",
      links: {
        github: p.gitRepoLink,
        live: p.projectLink,
      },
    })),
    skills: {
      languages: skills
        .filter((s) => s.proficiencyLevel > 80) // Example filter
        .map((s) => s.title),
      frameworks: [], // Can refine this mapping
      databasesAndTools: applications.map((a) => a.name),
    },
    achievements: [],
  };

  // Upload to Cloudinary as a raw file (JSON)
  const jsonString = JSON.stringify(portfolioData, null, 2);
  const buffer = Buffer.from(jsonString);
  
  const uploadResponse = await new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        resource_type: "raw",
        public_id: "portfolio_static/portfolio.json",
        overwrite: true,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    ).end(buffer);
  });

  res.status(200).json({
    success: true,
    message: "Portfolio data exported and uploaded successfully",
    url: uploadResponse.secure_url,
  });
});

export const triggerPortfolioExport = async (userId) => {
  try {
     // This would be called from other controllers
     console.log(`Triggered export for user ${userId}`);
  } catch (err) {
    console.error("Failed to trigger portfolio export:", err);
  }
};
