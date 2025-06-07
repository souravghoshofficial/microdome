import mongoose , {Schema} from "mongoose";

const quizSchema = new Schema({
    title: {
        type: String,
        trim: true,
        required: true
    },
    description: {
        type: String,
        trim: true,
        required: true
    },
    questions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "question",
        required: true
    }],
    quizType: {
        type: String,
        enum: ["MCQ"],
        required: true
    }
});

export const Quiz = mongoose.model("Quiz", quizSchema);