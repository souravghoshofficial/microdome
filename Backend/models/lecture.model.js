import mongoose , {Schema} from "mongoose"

const lectureSchema = new Schema({
   title: {
    type: String,
    required: true
   },

   videoURL: {
    type: String,
    required: true
   },

   noteTitle: {
    type: String
   },

   noteURL: {
    type: String
   }
})

export const Lecture = mongoose.model("Lecture", lectureSchema);