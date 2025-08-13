import { User } from "../models/user.model.js";
import { Quiz } from "../models/quiz.model.js";
import { Question } from "../models/question.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const getAllUsers = async (req,res)=>{
  try {
    const users = await User.find({}).select("-password");
    res.status(200).json({
      message: "All users are fetched successfully",
      users
    })
  } catch (error) {
    console.log("Error for fetching users: ", error);
    throw new ApiError(500,"Failed to fetch the users");
  }
}



// ------ quiz controllers ------- //

// Create Quiz
export const createQuiz = async (req, res) => {
  try {
    const { title, description, category, timeLimit, questions } = req.body;

    
    if (!title || !description ||!category || !questions || questions.length === 0) {
      return res.status(400).json({ message: "All fields are required" });
    }

   
    for (let q of questions) {
      if (
        !q.questionText ||
        !q.options ||
        q.correctOption === undefined
      ) {
        return res.status(400).json({ message: "Invalid question format" });
      }
    }

    // Step 1: Create all questions
    const createdQuestions = await Question.insertMany(questions);

    // Step 2: Create quiz with references to created questions
    const quiz = await Quiz.create({
      title,
      description,
      timeLimit,
      category,
      questions: createdQuestions.map((q) => q._id),
    });

    res.status(201).json({
      message: "Quiz created successfully",
      quiz,
    });
  } catch (error) {
    console.error("Error creating quiz:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export {getAllUsers};


// const isPremium = async (req,res)=>{
// try {
//     const { userId } = req.body;

//     // const user = await User.findById(req.user?._id);

//     if(!userId){
//       throw new ApiError(400,"User id is required");
//     }

//     const user = await User.findById(userId);

//     if(!user){
//       throw new ApiError(400,"User doesn't exist");
//     }
  
//     if(user.isPremiumMember){
//       return res.status(200).json({ 
//         message: "User is a premium member",
//         isPremiumMember: true,
//         user
//       });
//     }
//     else{
//       return res.status(200).json({
//         message: "User is not a premium member",
//         isPremiumMember: false
//       })
//     }
// } catch (error) {
//   console("Error occurred in checking isPremium or not: ",error);
//   throw new ApiError(400,"Something went wrong");
// }
// }

// const removeUser = async (req,res) => {
//   try {
//     const { userId } = req.body;
//     // const { email } = req.body;
  
//       if(!userId){
//         throw new ApiError(400,"User id is required");
//       }
  
//       // const user = await User.findById(userId);

//       // const user = await User.findByIdAndUpdate(req.user?._id);

//       const user = await User.findById(userId);

//       if (!user) {
//       throw new ApiError(404,"User not found");
//       }

//       if (!user.isPremiumMember) {
//       return res.status(200).json({ message: "User is already removed" });
//     }

//     const updatedUser = await User.findByIdAndUpdate(
//     userId, 
//     { $set: { isPremiumMember: false } },
//     { new: true }
//   ).select("-password");
  
//   return res.status(200).json(new ApiResponse(200,updatedUser,"User is removed successfully"));

//   } catch (error) {
//     console.log("Error occurred to delete a user: ", error);
//     throw new ApiError(500,"Internal server error");
//   }
// }

// const upgradeToPremium = async (req, res) => {
//   try {
//     const { userId } = req.body;

//     if (!userId) {
//       throw new ApiError(400,"User id is required");
//     }

//     const user = await User.findById(userId);

//     if (!user) {
//       throw new ApiError(404,"User not found");
//     }

//     if (user.isPremiumMember) {
//       res.status(200).json({ message: "User is already a premium member" });
//     }

//     const updatedUser = await User.findByIdAndUpdate(
//       userId,
//       { $set: { isPremiumMember: true } },
//       { new: true }
//     ).select("-password");

//     res.status(200).json({
//       message: "User upgraded to premium successfully",
//       updatedUser
//     });
//   } catch (error) {
//     console.error("Error upgrading user to premium:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };



// export {checkUsers,isPremium,removeUser,upgradeToPremium,getAllUsers};