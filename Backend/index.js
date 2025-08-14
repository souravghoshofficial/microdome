import { app } from "./app.js";
import dotenv from "dotenv"
import { connectDB } from "./db/index.js";
dotenv.config('.env')

const port = process.env.PORT || 3000;

connectDB()
.then(()=>{
  app.listen(port, () => {
    console.log(`Server is listening on port http://localhost:${port}`);
  })
})
.catch((error)=>{
  console.log("MongoDB connection failed ", error);
})