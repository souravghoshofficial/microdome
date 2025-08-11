import mongoose , {Schema} from "mongoose";

const questionSchema = new Schema({
    questionText: {
        type: String,
        trim: true,
        required: true
    },
    options:  [{
        type: String,
        trim: true,
        required: true
    }],
    correctOption: {
        type: Number,
        required: true
    }
});

export const Question = mongoose.model("Question", questionSchema);