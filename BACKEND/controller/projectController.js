import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { Project } from "../models/projectSchema.js";
import { v2 as cloudinary } from "cloudinary";
import { triggerPortfolioExport } from "./portfolioExportController.js";

export const addNewProject = catchAsyncErrors(async (req, res, next) => {
  const { projectBanner: bannerFile } = req.files || {};
  const {
    title,
    description,
    githubRepoLink,
    projectLink,
    stack,
    technologies,
    deployed,
    projectBanner: bannerUrl,
  } = req.body;
  if (
    !title ||
    !description ||
    !projectLink ||
    !stack ||
    !technologies ||
    !deployed ||
    !githubRepoLink
  ) {
    return next(new ErrorHandler("Please Fill full form", 400));
  }

  let projectBannerData = null;

  if (bannerFile) {
    const cloudinaryResponse = await cloudinary.uploader.upload(
      bannerFile.tempFilePath,
      {
        folder: "portfolio_projects",
      }
    );
    if (!cloudinaryResponse || cloudinaryResponse.error) {
      console.error("Cloudinary upload error:", cloudinaryResponse.error);
      return next(new ErrorHandler("Failed to upload project banner image", 500));
    }
    projectBannerData = {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    };
  } else if (bannerUrl) {
    projectBannerData = {
      public_id: "placeholder",
      url: bannerUrl,
    };
  } else {
    return next(new ErrorHandler("Project banner image Required!", 400));
  }

  const project = await Project.create({
    title,
    description,
    gitRepoLink: githubRepoLink,
    projectLink,
    stack,
    technologies,
    deployed,
    projectBanner: projectBannerData,
  });
  triggerPortfolioExport(req.user._id);
  res.status(201).json({
    success: true,
    message: "New Project added successfully",
    project,
  });
});
export const deleteProject = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const project = await Project.findById(id);
  if (!project) {
    return next(new ErrorHandler("project Not Found", 404));
  }
  
  // Only delete from Cloudinary if it's not a placeholder
  if (project.projectBanner?.public_id && project.projectBanner.public_id !== "placeholder") {
    try {
      await cloudinary.uploader.destroy(project.projectBanner.public_id);
    } catch (error) {
      console.error("Cloudinary deletion error:", error);
      // Continue with project deletion even if Cloudinary fails
    }
  }
  
  await project.deleteOne();
  res.status(200).json({
    success: true,
    message: "Project Deleted Successfully",
  });
});
export const updateProject = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const project = await Project.findById(id);
  if (!project) {
    return next(new ErrorHandler("Project Not Found", 404));
  }
  const {
    title,
    description,
    githubRepoLink,
    projectLink,
    stack,
    technologies,
    deployed,
    projectBanner: bannerUrl,
  } = req.body;
  let updatedFields = {};
  if (title) updatedFields.title = title;
  if (description) updatedFields.description = description;
  if (githubRepoLink) updatedFields.gitRepoLink = githubRepoLink;
  if (projectLink) updatedFields.projectLink = projectLink;
  if (stack) updatedFields.stack = stack;
  if (technologies) updatedFields.technologies = technologies;
  if (deployed) updatedFields.deployed = deployed;
  if (req.files && req.files.projectBanner) {
    const { projectBanner } = req.files;

    // Optionally, delete the old banner from Cloudinary
    if (project.projectBanner?.public_id && project.projectBanner.public_id !== "placeholder") {
      await cloudinary.uploader.destroy(project.projectBanner.public_id);
    }

    // Upload new banner to Cloudinary
    const cloudinaryResponse = await cloudinary.uploader.upload(
      projectBanner.tempFilePath,
      {
        folder: "Portfolio_Project_Banners",
      }
    );

    updatedFields.projectBanner = {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    };
  } else if (bannerUrl) {
    updatedFields.projectBanner = {
      public_id: "placeholder",
      url: bannerUrl,
    };
  }
  await Project.findByIdAndUpdate(id, updatedFields, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    message: "Project Updated Successfully",
  });
  triggerPortfolioExport(req.user._id);
});
export const getSingleProject = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const project = await Project.findById(id);
  if (!project) {
    return next(new ErrorHandler("Project Not Found", 404));
  }
  res.status(200).json({
    success: true,
    project,
  });
});
export const getAllProjects = catchAsyncErrors(async (req, res, next) => {
  const projects = await Project.find().sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    projects,
  });
});
