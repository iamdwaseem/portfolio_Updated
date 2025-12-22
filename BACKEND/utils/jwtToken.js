import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/userSchema.js";

export const generateToken = (user, message, statusCode, res) => {
  const token = user.generateJsonWebToken();

  res
    .status(statusCode)
    .cookie("Token", token, {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure: true,
      sameSite: "none",
    })
    .json({
      success: true,
      message,
      token,
      user,
    });
};

export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Email and password are required"));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid email or password"));
  }
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password"));
  }
  generateToken(user, "Logged In", 200, res);
});
