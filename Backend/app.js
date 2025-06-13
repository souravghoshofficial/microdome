import express from "express"
import cookieParser from "cookie-parser";
import cors from "cors"


const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}))

app.use(express.json({
    limit: "16kb"
}))

app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}))

app.use(express.static("public"))

app.use(cookieParser());

app.get("/" , (req,res) => {
    res.send("Server is running fine !!!");
})

//import routes
import userRouter from "./routes/user.routes.js";
import courseRouter from "./routes/course.routes.js"
import orderRouter from "./routes/order.routes.js";
import adminRouter from "./routes/admin.routes.js";
//route declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/courses",courseRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/admin",adminRouter);
export { app }


