import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";

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
    return res.send("All fields are required");
  }

  const exitedUser = await User.findOne({ email });

  if (exitedUser) {
    return res.send("User already exits");
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

  const createdUser = await User.findById(user._id);

  if (!createdUser) {
    throw new Error("Something went wrong");
  }

  return res
    .status(201)
    .json({ message: "User registered successfully" })
    .send(user);
};

export { registerUser };
