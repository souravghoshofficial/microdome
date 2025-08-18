export const authorizedRoles = (...roles) => {
  return (req, _, next) => {
    try {
      if (!req.user || !roles.includes(req.user.role)) {
        throw new ApiError(401, "Unauthorized request");
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};