import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    mobileNumber: {
      type: String,
    },
    profileImage: {
      type: String,
    },
    instituteName: {
      type: String,
    },
    presentCourseOfStudy: {
      type: String,
    },
    isPremiumMember: {
      type: Boolean,
      default: false,
    },

    hasAccessToQuizzes: { 
      type: Boolean, 
      default: false 
    },

    attemptedQuizzes: [
      { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Quiz" 
      }
    ],

    enrolledCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],              

    role: {
      type: String,
      lowercase: true,
      required: true,
      enum: ["user", "admin", "instructor"],
      default: "user",
    },
    
    otp: {
      type: String,
    },
    otpExpiry: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);
