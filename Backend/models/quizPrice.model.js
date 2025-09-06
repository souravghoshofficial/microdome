import mongoose , {Schema} from "mongoose"

const quizPriceSchema = new Schema({
    actualPrice: {
        type: Number,
        required: true
    },
    discountedPrice: {
        type: Number,
        required: true
    }
})

export const QuizPrice = mongoose.model("QuizPrice", quizPriceSchema);