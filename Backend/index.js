import { app } from "./app.js";
import dotenv from "dotenv";
import { pool } from "./db/db.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

dotenv.config();

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get("/", (req, res) => {
  res.send("Hello World");
});


app.get("/profile" , (req, res) => {
    const token = req.cookies.token
    if(!token){
      console.log("token nehi hai");
      res.send("Not Authenticated!!")   
    }

    else{
      const data = jwt.verify(token , "secret")
      if(!data){
        res.send("Token is wrong")
      }
      else{
        res.send(data)
      }
    }
})

app.post("/logout" , (req , res) => {
    res.cookie("token" , "")
    res.send("Logout Successfully")
})

app.post("/signup", async (req, res) => {
  const client = await pool.connect();
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)";
    await client.query(sql, [name, email, hashedPassword]);
    const token = jwt.sign({email: email} , "secret");
    console.log(token);
    res
    .cookie("token", token)
    .status(201).json({ message: "User registered successfully" });
  } 
  catch (error) {
    if(error.code === "23505"){
        res.status(409).json({ message: "Email already exists" });
        return
    }
  } 
  finally {
    client.release();
  }
});

// pool.query('SELECT NOW()')
// .then(() => {
//     createDB();
//     console.log("DB connected");

//     app.listen(port, () => {
//         console.log(`Server is running on port ${port}`);

//     })
// })
// .catch((err) => {
//     console.log("Postgresql connection failed ", err);

// })

// app.get("/" , (res) =>{
//     res.send({
//         staus: 400,
//         messsage: "hello"
//     });
// })
