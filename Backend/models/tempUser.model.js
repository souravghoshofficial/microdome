import mongoose, { Schema } from "mongoose";

const tempUserSchema = new Schema(
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

    otp: {
      type: String
    },

    otpExpiry: {
      type: Date
    }
  }
);



export const TempUser = mongoose.model("TempUser", tempUserSchema);
