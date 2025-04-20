import { pool } from "../db/db.js";

const createDB = async() => {
    const client = await pool.connect();
    client.query(`CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
        );`)

        client.release();
}

const createUser = async(name , email , password) => {
    
    const client = await pool.connect();
    await client.query(`BEGIN`);
    const result = await client.query(`INSERT INTO users (name , email , password) VALUES ($1, $2 , $3) RETURNING *`, [name, email, password])
    client.query(`COMMIT`)
    return result.rows[0];
}

export {createDB , createUser}