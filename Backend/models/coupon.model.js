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
    itemId: {
        type: mongoose.Schema.ObjectId,
        required: true,
        refPath: "itemType" 
    },
    itemType: {
        type: String,
        enum: ['Course','MockTestBundle'],
        required: true
    }
})

export const Coupon = mongoose.model("Coupon", couponSchema)