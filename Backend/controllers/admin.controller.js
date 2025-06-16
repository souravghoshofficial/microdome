import { User } from "../models/user.model.js";
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



export {getAllUsers};
