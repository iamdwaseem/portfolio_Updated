import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { SoftwareApplication } from "../models/softwareApplicationSchema.js";
import { v2 as cloudinary } from "cloudinary";
export const addNewApplication = catchAsyncErrors(async (req, res, next) => {
  const { svg: svgFile } = req.files || {};
  const { name, svg: svgUrl } = req.body;
  if (!name) {
    return next(new ErrorHandler("Name is required", 400));
  }

  let svgData = null;

  if (svgFile) {
    const cloudinaryResponseForSvg = await cloudinary.uploader.upload(
      svgFile.tempFilePath,
      {
        folder: "Portfolio_Software_Applications",
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
    return next(new ErrorHandler("Software Application Svg Are Required!", 400));
  }

  const softwareApplication = await SoftwareApplication.create({
    name,
    svg: svgData,
  });

  res.status(201).json({
    success: true,
    message: "Software Application Added Successfully",
    softwareApplication,
  });
});

export const deleteApplication = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const application = await SoftwareApplication.findById(id);
  if (!application) {
    return next(new ErrorHandler("Application Not Found", 404));
  }
  await cloudinary.uploader.destroy(application.svg.public_id);
  await application.deleteOne();
  res.status(200).json({
    success: true,
    message: "Application Deleted Successfully",
  });
});

export const updateApplication = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { name, svg: svgUrl } = req.body;
  
  const application = await SoftwareApplication.findById(id);
  if (!application) {
    return next(new ErrorHandler("Application Not Found", 404));
  }

  const updateData = {
    name: name || application.name,
  };

  // If new SVG is uploaded, update it
  if (req.files && req.files.svg) {
    const { svg } = req.files;
    // Delete old SVG from cloudinary
    if (application.svg && application.svg.public_id && application.svg.public_id !== "placeholder") {
      await cloudinary.uploader.destroy(application.svg.public_id);
    }
    
    // Upload new SVG
    const cloudinaryResponseForSvg = await cloudinary.uploader.upload(
      svg.tempFilePath,
      {
        folder: "Portfolio_Software_Applications",
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

  const updatedApplication = await SoftwareApplication.findByIdAndUpdate(
    id,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    success: true,
    message: "Application Updated Successfully",
    application: updatedApplication,
  });
});

export const getAllApplications = catchAsyncErrors(async (req, res, next) => {
  const applications = await SoftwareApplication.find().sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    applications,
  });
});
