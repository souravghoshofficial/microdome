import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
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
      type: Number,
      default: null
    },
    profileImage: {
      type: String,
      default: "https://i.pinimg.com/736x/37/57/5a/37575a213755cad83bd408908623ba22.jpg"
    },
    instituteName: {
      type: String,
      default: null
    },
    presentCourseOfStudy: {
      type: String,
      default: null
    },
    isPremiumMember: {
      type: Boolean,
      default: false
    },
    isAdmin: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}


export const User = mongoose.model("User", userSchema);
