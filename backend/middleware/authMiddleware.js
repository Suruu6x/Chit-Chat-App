import JWT from "jsonwebtoken";
import userModel from "../Models/userModel.js";
import asyncHandler from "express-async-handler";

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // decodes token Id
      const decoded = JWT.verify(token, process.env.JWT_SECRET);

      req.user = await userModel.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      res.status(401).send({
        success: false,
        message: "Not Authorized, token failed ",
      });
    }

    if (!token) {
      res.status(401).send({
        success: false,
        message: "Not Authorized, token failed ",
      });
    }
  }
});
