import mongoose , {Schema} from "mongoose"

const mockTestSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  mockTestType: {
    type: String,
    enum: ["IIT-JAM","CUET-PG","GAT-B","GATE"],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  durationMinutes: {
    type: Number,
    required: true
  },
  totalMarks: {
    type: Number,
    requied: true
  },
  accessType: {
    type: String,
    enum: ["FREE","PAID"],
    requied: true
  },
  instructions: {
    type: [String],
    required: true
  },
  status: {
    type: String,
    enum: ["DRAFT","PUBLISHED"]
  },
},
{timestamps: true}
)

export const MockTest = mongoose.model("MockTest", mockTestSchema);
