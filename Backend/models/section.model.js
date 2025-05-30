import mongoose , {Schema} from "mongoose"

const sectionSchema = new Schema({
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