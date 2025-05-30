import mongoose , {Schema} from "mongoose"

const courseSchema = new Schema({
   name: {
     type: String,
     required: true
   },
   price: {
    type: Number,
    required: true
   },
   section: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section"
    }
   ],
})

export const Course = mongoose.model("Course", courseSchema);