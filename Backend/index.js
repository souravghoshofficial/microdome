import express from "express"
import cors from "cors"
import dotenv from "dotenv"

dotenv.config()


const app = express()
const port = process.env.PORT || 3000

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}))

app.get('/', (req, res) => {
  res.send('Hello World!')
})


app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})