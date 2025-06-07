import mongoose , {Schema} from "mongoose";

const questionSchema = new Schema({
    question: {
        type: String,
        trim: true,
        required: true
    },
    correctAnswer: {
        type: String,
        trim: true,
        required: true
    },
    options:  [{
        type: String,
        trim: true,
        required: true
    }]
});

export const Question = mongoose.model("Question", questionSchema);