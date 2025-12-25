import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/userSchema.js";
import { v2 as cloudinary } from "cloudinary";
import { generateToken } from "../utils/jwtToken.js";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto";
import { triggerPortfolioExport } from "./portfolioExportController.js";
export const register = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Avatar and Resume Are Required!", 400));
  }
  const { avatar, resume } = req.files;
  // console.log("req.files:", req.files);
  // console.log("req.body:", req.body);

  const clrForAvatar = await cloudinary.uploader.upload(avatar.tempFilePath, {
    folder: "AVATARS",
  });
  if (!clrForAvatar || clrForAvatar.error) {
    console.error(
      "Cloudinary Error",
      clrForAvatar.error || "Unknown cloudinary Error"
    );
  }
  const clrForResume = await cloudinary.uploader.upload(resume.tempFilePath, {
    folder: "Resume",
  });
  if (!clrForResume || clrForResume.error) {
    console.error(
      "Cloudinary Error",
      clrForResume.error || "Unknown cloudinary Error"
    );
  }
  const {
    fullName,
    email,
    phone,
    aboutMe,
    password,
    portfolioURL,
    githubURL,
    instagramURL,
    twitterURL,
    linkedinURL,
    resetPasswordToken,
    resetPasswordExpire,
  } = req.body;
  const user = await User.create({
    fullName,
    email,
    phone,
    aboutMe,
    password,
    avatar: {
      public_id: clrForAvatar.public_id,
      url: clrForAvatar.secure_url,
    },
    resume: {
      public_id: clrForResume.public_id,
      url: clrForResume.secure_url,
    },
    portfolioURL,
    githubURL,
    instagramURL,
    twitterURL,
    linkedinURL,
    resetPasswordToken,
    resetPasswordExpire,
  });
  triggerPortfolioExport(user._id);
  generateToken(user, "User Registered", 201, res);
});

export const logout = catchAsyncErrors(async (req, res, next) => {
  const token = req.cookies.Token;
  console.log(token);
  if (!token) {
    return res.status(400).json({
      success: false,
      message: "User Already logged out or not logged In",
    });
  }
  res
    .status(200)
    .cookie("Token", "", {
      expires: new Date(0),
      httpOnly: true,
    })
    .json({
      success: true,
      message: "Logged out successfully",
    });
  console.log(token);
});

export const getUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    user,
  });
});

export const updateProfile = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    fullName: req.body.fullName,
    email: req.body.email,
    phone: req.body.phone,
    aboutMe: req.body.aboutMe,
    // password: req.body.password,
    portfolioURL: req.body.portfolioURL,
    githubURL: req.body.githubURL,
    instagramURL: req.body.instagramURL,
    twitterURL: req.body.twitterURL,
    linkedinURL: req.body.linkedinURL,
  };
  if (req.files && req.files.avatar) {
    const avatar = req.files.avatar;
    const user = await User.findById(req.user.id);
    const profileImgId = user.avatar.public_id;
    await cloudinary.uploader.destroy(profileImgId);
    const cloudinaryResponseU = await cloudinary.uploader.upload(
      avatar.tempFilePath,
      {
        folder: "AVATARS",
      }
    );
    if (!cloudinaryResponseU || cloudinaryResponseU.error) {
      console.error(
        "Cloudinary Error",
        cloudinaryResponseU.error || "Unknown cloudinary Error"
      );
    }
    newUserData.avatar = {
      public_id: cloudinaryResponseU.public_id,
      url: cloudinaryResponseU.secure_url,
    };
  }

  //updating Resume if exists
  if (req.files && req.files.resume) {
    const resume = req.files.resume;
    const user = await User.findById(req.user.id);
    const resumeId = user.resume.public_id;
    await cloudinary.uploader.destroy(resumeId);
    const cloudinaryResumeRes = await cloudinary.uploader.upload(
      resume.tempFilePath,
      {
        folder: "Resume",
      }
    );
    if (!cloudinaryResumeRes || cloudinaryResumeRes.error) {
      console.error(
        "Cloudinary Error",
        cloudinaryResumeRes.error || "Unknown cloudinary Error"
      );
    }
    newUserData.resume = {
      public_id: cloudinaryResumeRes.public_id,
      url: cloudinaryResumeRes.secure_url,
    };
  }

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  triggerPortfolioExport(user._id);
  res.status(200).json({
    success: true,
    message: "Profile updated!",
    user,
  });
});

export const updatePassword = catchAsyncErrors(async (req, res, next) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  if (!currentPassword || !newPassword || !confirmPassword) {
    return next(new ErrorHandler("Please fil all fields", 400));
  }
  const user = await User.findById(req.user.id).select("+password");
  const isPasswordMatched = await user.comparePassword(currentPassword);
  if (!isPasswordMatched) {
    return next(
      new ErrorHandler(
        "incorrect current password,Please enter correct password",
        400
      )
    );
  }
  if (newPassword !== confirmPassword) {
    return next(
      new ErrorHandler(
        "New Password and new confirmed password Do Not Match ",
        400
      )
    );
  }
  user.password = newPassword;
  await user.save();
  res.status(200).json({
    success: true,
    message: "Password Updated",
  });
});

export const getUserForPortfolio = catchAsyncErrors(async (req, res, next) => {
  // Serve the most recently created user as the portfolio owner
  const user = await User.findOne().sort({ createdAt: -1 });
  if (!user) {
    return next(new ErrorHandler("No portfolio user found", 404));
  }
  res.status(200).json({
    success: true,
    user,
  });
});

export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorHandler("User not found!", 404));
  }

  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false }); // ✅ important!

  const resetPasswordUrl = `${process.env.DASHBOARD_URI}/password/reset/${resetToken}`;
  const message = `Your reset password Token is:- \n\n${resetPasswordUrl}\n\nIf you have not requested this, please ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Portfolio Dashboard Recovery Password",
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully!`,
    });
  } catch (error) {
    user.resetPasswordExpire = undefined;
    user.resetPasswordToken = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
});

export const resetPassword = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.params; // token from URL
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler(
        "Reset password token is invalid or has been expired!",
        400
      )
    );
  }
  if (req.body.password !== req.body.confirmPassword) {
    return next(
      new ErrorHandler("Password and Confirm Password Do Not Match. ")
    );
  }
  user.password = req.body.password;
  user.resetPasswordExpire = undefined;
  user.resetPasswordToken = undefined;
  await user.save();
  generateToken(user, "Reset password successfully", 200, res);
});
