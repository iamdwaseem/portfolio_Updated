import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { Skill } from "../models/skillSchema.js";
import { v2 as cloudinary } from "cloudinary";

export const addSkill = catchAsyncErrors(async (req, res, next) => {
  const { svg: svgFile } = req.files || {};
  const { title, proficiencyLevel, svg: svgUrl } = req.body;
  if (!title || !proficiencyLevel) {
    return next(new ErrorHandler("Please Fill full form", 400));
  }

  let svgData = null;

  if (svgFile) {
    const cloudinaryResponseForSvg = await cloudinary.uploader.upload(
      svgFile.tempFilePath,
      {
        folder: "Portfolio_Skill_SVGS",
      }
    );
    if (!cloudinaryResponseForSvg || cloudinaryResponseForSvg.error) {
      console.error(
        "Cloudinary Error",
        cloudinaryResponseForSvg.error || "Unknown cloudinary Error"
      );
    }
    svgData = {
      public_id: cloudinaryResponseForSvg.public_id,
      url: cloudinaryResponseForSvg.secure_url,
    };
  } else if (svgUrl) {
    svgData = {
      public_id: "placeholder",
      url: svgUrl,
    };
  } else {
    return next(new ErrorHandler("Skills svg Required!", 400));
  }

  const skill = await Skill.create({
    title,
    proficiencyLevel,
    svg: svgData,
  });

  res.status(201).json({
    success: true,
    message: "Skill Added Successfully",
    skill,
  });
});
export const deleteSkill = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const skills = await Skill.findById(id);
  if (!skills) {
    return next(new ErrorHandler("skills Not Found", 404));
  }
  await cloudinary.uploader.destroy(skills.svg.public_id);
  await skills.deleteOne();
  res.status(200).json({
    success: true,
    message: "skills Deleted Successfully",
  });
});
export const updateSkill = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  let skill = await Skill.findById(id);
  if (!skill) {
    return next(new ErrorHandler("Skill Not Found", 404));
  }
  const { proficiencyLevel, title, svg: svgUrl } = req.body;
  
  const updateData = {
    proficiencyLevel: proficiencyLevel || skill.proficiencyLevel,
    title: title || skill.title,
  };

  if (req.files && req.files.svg) {
    const { svg } = req.files;
    // Delete old SVG from cloudinary
    if (skill.svg && skill.svg.public_id && skill.svg.public_id !== "placeholder") {
      await cloudinary.uploader.destroy(skill.svg.public_id);
    }
    
    // Upload new SVG
    const cloudinaryResponseForSvg = await cloudinary.uploader.upload(
      svg.tempFilePath,
      {
        folder: "Portfolio_Skill_SVGS",
      }
    );
    
    if (!cloudinaryResponseForSvg || cloudinaryResponseForSvg.error) {
      console.error(
        "Cloudinary Error",
        cloudinaryResponseForSvg.error || "Unknown cloudinary Error"
      );
    }
    
    updateData.svg = {
      public_id: cloudinaryResponseForSvg.public_id,
      url: cloudinaryResponseForSvg.secure_url,
    };
  } else if (svgUrl) {
    updateData.svg = {
      public_id: "placeholder",
      url: svgUrl,
    };
  }

  skill = await Skill.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: "Skill Updated Successfully",
    skill,
  });
});
export const getAllSkills = catchAsyncErrors(async (req, res, next) => {
  const skills = await Skill.find().sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    skills,
  });
});
