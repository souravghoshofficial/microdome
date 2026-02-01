import mongoose , {Schema} from "mongoose"

const sectionSchema = new Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true
  },

   title: {
    type: String,
    required: true
   },

   lectures: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lecture",
      required: true
    }
   ]
})

export const Section = mongoose.model("Section", sectionSchema);