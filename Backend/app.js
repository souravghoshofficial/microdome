import express from "express"
import cookieParser from "cookie-parser";
import cors from "cors"

import { verifyJWT } from "./middlewares/auth.middleware.js";



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
verifyJWT,
app.get("/" , (req,res) => {
    res.send("Server is running fine !!!");
})

//import routes
import userRouter from "./routes/user.routes.js";
import courseRouter from "./routes/course.routes.js"
import orderRouter from "./routes/order.routes.js";
import adminRouter from "./routes/admin.routes.js";
import quizRouter from "./routes/quiz.routes.js";
import messageRouter from "./routes/message.routes.js";
import adminMockTestRouter from "./routes/admin.mockTest.routes.js";
import userMockTestRouter from "./routes/user.mockTest.route.js";

//route declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/courses",courseRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/admin", verifyJWT, adminRouter);
app.use("/api/v1/quiz", quizRouter);
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/admin/mock-tests", verifyJWT, adminMockTestRouter);
app.use("/api/v1/user/mock-tests", userMockTestRouter);


export { app }


