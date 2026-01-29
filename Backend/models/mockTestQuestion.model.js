import mongoose , {Schema} from "mongoose"


const optionSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true, 
      enum: ["A", "B", "C", "D"]
    },
    text: {
      type: String,
      required: true
    },
    imageUrl: {
      type: String,
      default: null
    }
  },
  { _id: false } 
);





const mockTestQuestionSchema = new Schema({
  mockTestSectionId: {
    type: mongoose.Schema.ObjectId,
    ref: "MockTestSection",
    required: true
  },
  questionType: {
    type: String,
    enum: ["MCQ","MSQ","NAT"],
    required: true
  },
  questionText: {
    type: String,
    required: true
  },
  questionImageUrl: {
    type: String
  },
  options: {
    type: [optionSchema],
    validate: {
      validator: function (v) {
        if (this.questionType === "NAT") return v.length === 0;
        return v.length >= 2;
      },
      message: "Options are required for MCQ/MSQ and not allowed for NAT"
    },
    default: []
  },
    correctAnswer: {
    type: [String],
    default: [],
    validate: {
      validator: function (v) {
        if (this.questionType === "NAT") return v.length === 0;
        return v.length >= 1;
      },
      message: "Correct answer required for MCQ/MSQ"
    }
  },
  numericAnswer: {
      type: Number,
      default: null
    },

    tolerance: {
      type: Number,
      default: null
    },

    marks: {
      type: Number,
      required: true
    },

    negativeMarks: {
      type: Number,
      default: 0
    },

    questionOrder: {
      type: Number,
      required: true
    },

    answerExplanation: {
      type: String
    }
},
{timestamps: true}
)

export const MockTestQuestion = mongoose.model("MockTestQuestion", mockTestQuestionSchema);