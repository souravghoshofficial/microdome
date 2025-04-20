import dotenv from "dotenv"
dotenv.config()
import pg from 'pg'
const { Pool } = pg
const connectionString = process.env.DB_URI
 
const pool = new Pool({
  connectionString,
})
 

export {pool}