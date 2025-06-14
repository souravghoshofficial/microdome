import { User } from "../models/user.model.js";
import { TempUser } from "../models/tempUser.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { generateOTP } from "../utils/generateOTP.js";
import { sendOtpEmail } from "../utils/sendEmail.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";
import bcrypt from "bcrypt";

const getCurrentUser = async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User fetched successfully"));
};

const registerUser = async (req, res) => {
  // step1: get details from frontend
  // step2: validate the data
  // step3: check if user already exits or not
  // step4: save the details in database
  // step5: send response to frontend

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  try {
    // Check if already a verified user
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP(6);
    const hashedOtp = await bcrypt.hash(otp, 10);
    const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Remove existing TempUser if any
    await TempUser.findOneAndDelete({ email });

    await TempUser.create({
      name,
      email,
      password: hashedPassword,
      otp: hashedOtp,
      otpExpiry: expiry,
    });

    await sendOtpEmail(email, otp);

    res.status(200).json({ message: "OTP sent to email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const tempUser = await TempUser.findOne({ email });
    if (!tempUser)
      return res.status(400).json({ message: "Invalid or expired OTP" });

    const isValid = await bcrypt.compare(otp, tempUser.otp);

    if (!isValid) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    const isExpired = tempUser.otpExpiry < new Date();

    if (isExpired) {
      return res.status(400).json({ message: "OTP has been expired" });
    }

    // Create permanent user
    const createdUser = await User.create({
      name: tempUser.name,
      email: tempUser.email,
      password: tempUser.password,
    });

    if (!createdUser) {
      return res
        .status(500)
        .json({ message: "Something went wrong while registering user" });
    }

    await TempUser.deleteOne({ email });

    const accessToken = createdUser.generateAccessToken();

    const loggedInUser = await User.findById(createdUser._id).select(
      "-password"
    );

    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 10 * 24 * 60 * 60 * 1000,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .json(
        new ApiResponse(
          200,
          {
            user: loggedInUser,
          },
          "User verified and created successfully"
        )
      );
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const resendOTP = async (req, res) => {
  const { email } = req.body;
  try {
    const tempUser = await TempUser.findOne({ email });
    if (!tempUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = generateOTP(6);
    const hashedOtp = await bcrypt.hash(otp, 10);
    const expiry = new Date(Date.now() + 5 * 60 * 1000);

    tempUser.otp = hashedOtp;
    tempUser.otpExpiry = expiry;
    await tempUser.save();

    await sendOtpEmail(email, otp);

    res.status(200).json({ message: "New OTP sent successfully" });
  } catch (error) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const accessToken = user.generateAccessToken();

  const loggedInUser = await User.findById(user._id).select("-password");

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 10 * 24 * 60 * 60 * 1000,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
        },
        "User logged In Successfully"
      )
    );

  // const isPasswordCorrect = async function(password){
  // return await bcrypt.compare(password, this.password)
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = generateOTP(6);
    const hashedOtp = await bcrypt.hash(otp, 10);
    const expiry = new Date(Date.now() + 5 * 60 * 1000);

    user.otp = hashedOtp;
    user.otpExpiry = expiry;
    await user.save();

    await sendOtpEmail(email, otp);

    res.status(200).json({ message: "OTP send successfully" });
  } catch (error) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const verifyForgotPasswordOTP = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    const isValid = await bcrypt.compare(otp, user.otp);
    if (!isValid) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const isExpired = user.otpExpiry < new Date();
    if (isExpired) {
      return res.status(400).json({ message: "OTP has been expired" });
    }

    user.otp = undefined;
    user.otpExpiry = undefined;

    await user.save();

    res.status(200).json({ message: "OTP verfied" });
  } catch (error) {
    console.log(err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const resendForgotPasswordOTP = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = generateOTP(6);
    const hashedOtp = await bcrypt.hash(otp, 10);
    const expiry = new Date(Date.now() + 5 * 60 * 1000);

    user.otp = hashedOtp;
    user.otpExpiry = expiry;
    await user.save();

    await sendOtpEmail(email, otp);

    res.status(200).json({ message: "New OTP sent successfully" });
  } catch (error) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const resetPassword = async (req, res) => {
  const { email, newpassword } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    const hashedPassword = await bcrypt.hash(newpassword, 10);

    user.password = hashedPassword;

    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const logoutUser = async (req, res) => {
  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
};

const updateUserAvatar = async (req, res) => {
  // const avatarLocalPath = req.file?.path;
  const avatarLocalPath = req.files?.profileImage[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Profile Image is missing");
  }

  // Get the current user to check for existing profile image
  const currentUser = await User.findById(req.user?._id);

  // Delete old image if it exists
  if (currentUser.profileImage) {
    try {
      await deleteFromCloudinary(currentUser.profileImage);
    } catch (error) {
      console.error("Error deleting old image:", error);
      // Continue with upload even if deletion fails
    }
  }

  const profileImage = await uploadOnCloudinary(avatarLocalPath);

  if (!profileImage.url) {
    throw new ApiError(400, "Error while uploading the profile image");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        profileImage: profileImage.url,
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Profile image uploaded successfully"));
};

const updateAccountsDetails = async (req, res) => {
  const { name, mobileNumber, instituteName, presentCourseOfStudy } = req.body;

  // if(!mobileNumber && !instituteName && !presentCourseOfStudy){
  //   throw new ApiError(400,"Any of these fields are required");
  // }

  if (!(name || mobileNumber || instituteName || presentCourseOfStudy)) {
    throw new ApiError(400, "Any of these fields are required");
  }

  // const user =await User.findByIdAndUpdate(
  //   req.user?._id,
  //   {
  //     if(mobileNumber){
  //       $set: {
  //       mobileNumber: mobileNumber
  //     }
  //     },
  //     if(instituteName){
  //       $set: {
  //       instituteName: instituteName
  //     }
  //     },
  //     if(presentCourseOfStudy){
  //       $set: {
  //       presentCourseOfStudy: presentCourseOfStudy
  //     }
  //     }
  //   },
  //   {new: true}
  // ).select("-password")

  const updateData = {};

  if (name) {
    updateData.name = name;
  }

  if (mobileNumber) {
    updateData.mobileNumber = mobileNumber;
  }
  if (instituteName) {
    updateData.instituteName = instituteName;
  }
  if (presentCourseOfStudy) {
    updateData.presentCourseOfStudy = presentCourseOfStudy;
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    { $set: updateData },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"));
};

export {
  registerUser,
  verifyOTP,
  resendOTP,
  loginUser,
  forgotPassword,
  verifyForgotPasswordOTP,
  resendForgotPasswordOTP,
  resetPassword,
  logoutUser,
  getCurrentUser,
  updateAccountsDetails,
  updateUserAvatar,
};
