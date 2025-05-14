import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import bcrypt from  "bcrypt";


const getCurrentUser = async(req, res) => {
    return res
    .status(200)
    .json(new ApiResponse(
        200,
        req.user,
        "User fetched successfully"
    ))
}

const registerUser = async (req, res) => {
  // step1: get details from frontend
  // step2: validate the data
  // step3: check if user already exits or not
  // step4: save the details in database
  // step5: send response to frontend

  const { name, email, password } = req.body;
  // console.log(name,email,password);
  // res.send("Successfully get the user details!");

  if (!name || !email || !password) {
   throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({ email });

  if (existedUser) {
    throw new ApiError(409, "User with email already exists");
  }

  //  const hashedPassword = await bcrypt.hash(password,10)

  //   const user = await User.create({
  //     name,
  //     email,
  //     password:hashedPassword
  // })

  const user = await User.create({
    name,
    email,
    password,
  });

   const createdUser = await User.findById(user._id).select("-password")


    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )

};



const loginUser = async (req,res) =>{
  const { email, password } = req.body;

if (!email || !password) {
   throw new ApiError(400, "All fields are required");
  }

  const user = await User.findOne({ email });

  if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if(!isPasswordCorrect){
      throw new ApiError(401, "Invalid user credentials");
    }

    const accessToken = user.generateAccessToken();

     const loggedInUser = await User.findById(user._id).select("-password")

    const options = {
        httpOnly: true,
        secure: true,
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser,
            },
            "User logged In Successfully"
        )
    )

    // const isPasswordCorrect = async function(password){
    // return await bcrypt.compare(password, this.password)

}



const logoutUser = async(req, res) => {

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
}

export { registerUser, loginUser, logoutUser , getCurrentUser};