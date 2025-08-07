
import { ApiError } from "../utils/ApiError.js";

export const isAdmin = async (req, _, next) => {
    if(req.user.role === "admin"){
        next();
    }
    else {
        throw new ApiError(401, "Unauthorized request")
    }
}

