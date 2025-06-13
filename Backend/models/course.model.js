import mongoose, { Schema } from "mongoose";

const courseSchema = new Schema({
  cardTitle: {  
    type: String,
    required: true,
    // unique: true
  },
  subTitle: {
    type: String,
    required: true
  },
  courseTag: {
    type: String,
  },
  mode: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
  courseImage: {
    type: String,
    required: true,
  },
  actualPrice: {
    type: Number,
    required: true,
  },
  discountedPrice: {
    type: Number,
    required: true,
  },
  linkAddress: {
    type: String,
    required: true,
    // unique: true,
  },
  courseTitle: {
    type: String,
    required: true,
    // unique: true
  },
  courseDescription: {
    type: String,
    required: true
  },
  sections: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
    },
  ],
});

export const Course = mongoose.model("Course", courseSchema);
