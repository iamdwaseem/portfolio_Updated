import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { Timeline } from "../models/timelineSchema.js";
import { triggerPortfolioExport } from "./portfolioExportController.js";

export const postTimeLine = catchAsyncErrors(async (req, res, next) => {
  const { title, description, fromDate, toDate, educationYear, cgpa } = req.body;
  
  if (!title || !description || !fromDate || !toDate) {
    return next(new ErrorHandler("All required fields must be provided!", 400));
  }
  
  // Convert YYYY-MM to Date (add -01 for first day of month)
  const fromDateObj = new Date(fromDate + "-01");
  const toDateObj = new Date(toDate + "-01");
  
  const newTimeline = await Timeline.create({
    title,
    description,
    educationYear: educationYear || "",
    cgpa: cgpa || "",
    timeline: { from: fromDateObj, to: toDateObj },
  });
  
  triggerPortfolioExport(req.user._id);
  res.status(200).json({
    success: true,
    message: "Timeline added",
    timeline: newTimeline,
  });
});
export const deleteTimeline = catchAsyncErrors(async (req, res, next) => {
  console.log("hiii");
  const { id } = req.params;
  const timeline = await Timeline.findById(id);
  if (!timeline) {
    return next(new ErrorHandler("Timeline not found!", 404));
  }
  await timeline.deleteOne();
  triggerPortfolioExport(req.user._id);
  res.status(200).json({
    success: true,
    message: "Timeline Deleted",
  });
});

export const updateTimeline = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { title, description, fromDate, toDate, educationYear, cgpa } = req.body;

  const timeline = await Timeline.findById(id);
  if (!timeline) {
    return next(new ErrorHandler("Timeline not found!", 404));
  }

  // Convert YYYY-MM format to Date objects if provided
  const fromDateObj = fromDate ? new Date(fromDate + "-01") : timeline.timeline.from;
  const toDateObj = toDate ? new Date(toDate + "-01") : timeline.timeline.to;

  const updateData = {
    title: title || timeline.title,
    description: description || timeline.description,
    educationYear: educationYear ?? timeline.educationYear,
    cgpa: cgpa ?? timeline.cgpa,
    timeline: {
      from: fromDateObj,
      to: toDateObj,
    },
  };

  const updatedTimeline = await Timeline.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  triggerPortfolioExport(req.user._id);
  res.status(200).json({
    success: true,
    message: "Timeline Updated",
    timeline: updatedTimeline,
  });
});

export const getAllTimeLines = catchAsyncErrors(async (req, res, next) => {
  const timelines = await Timeline.find();
  res.status(200).json({
    success: "true",
    timelines,
  });
});
