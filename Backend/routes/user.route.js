// import { Router } from "express";
// import { createUser } from "../models/user.model";

// const router = Router()

// router.post('/signup', async(req, res) => {
//     const {name , email , password} =  req.body;
//     if(!name && !email && !password){
//         res.status(400).json({
//             message: "Invalid values"
//         })
//         return
//     }
//     try {
//         const hashpassword = await bcrypt.hash(password , 10);
//         const result = await createUser(name , email , hashpassword);
//         console.log(result);
//         if(!result.id) {
//             res.status(400).json({
//                 message: "Server Error"
//             })
//             return
//         }

//         const token = jwt.sign({id: result.id , email : result.email}, process.env.JWT_SECRET || 'hddjjhgsa');
//         res.status(201).json({
//             data: {
//                 authToken: token,
//             }
//         })
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({
//             message : "Server error"
//         })
//     }
// })

// export {router}