import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { pool } from "./db/db.js"
import { createDB } from "./models/user.model.js"

dotenv.config()


const app = express()
const port = process.env.PORT || 3000

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}))

pool.query('SELECT NOW()')
.then(() => {
    createDB();
    console.log("DB connected");
    
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
        
    })
})
.catch((err) => {
    console.log("Postgresql connection failed ", err);
    
})

app.get("/" , (res) =>{
    res.send({
        staus: 400,
        messsage: "hello"
    });
})
