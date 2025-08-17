import mongoose, { Schema } from "mongoose";

const couponSchema = new Schema({
    couponCode: {
        type: String,
        required: true,
        lowercase: true, 
        trim: true
    },
    discount: {
        type: Number,
        required: true
    },
    courseId: {
        type: mongoose.Schema.ObjectId,
        ref: "Course"
    }
})

export const Coupon = mongoose.model("Coupon", couponSchema)