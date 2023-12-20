const jwt = require("jsonwebtoken");
const User = require("../models/userModels");
const asyncHandler = require("express-async-handler");
const errors= require("../utils/error-messages");
const {ApiError} = require("../utils/ApiError");

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      //get tokenfrom header
      token = req.headers.authorization.split(" ")[1];

      let secret = process.env.JWT_SECRET

      //verify token
      const decoded = jwt.verify(token.trim(), secret.trim());

      //get user from token
      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      res.status(401)
      throw new ApiError(errors.Unauthorized);
    }
  }

  if (!token) {
    res.status(401);
    throw new ApiError(errors.Unauthorized);
  }
}); 

const isOwner = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      //get tokenfrom header
      token = req.headers.authorization.split(" ")[1];
      let secret = process.env.JWT_SECRET

      //verify token
      const decoded = jwt.verify(token.trim(), secret.trim());

      //get user from token
      const user = await User.findById(decoded.id).select("-password");

      if(!decoded.id === req.params.userId){
        res.status(401);
        throw new ApiError(errors.Unauthorized)
      }

      req.user = user

      next();
    } catch (error) {
      res.status(401);
      throw new ApiError(errors.Unauthorized)
    }
  }

  if (!token) {
    res.status(401);
    throw new ApiError(errors.Unauthorized)
  }
}); 

const isAdmin = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      //get tokenfrom header
      token = req.headers.authorization.split(" ")[1];

      //verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      //get user from token
      const user = await User.findById(decoded.id).select("-password");

      if(!user.isAdmin){
        res.status(401);
        throw new ApiError(errors.Unauthorized)
      }

      next();
    } catch (error) {
      res.status(401);
      res.statusCode(401);
      throw new ApiError(errors.Unauthorized)
    }
  }

  if (!token) {
    res.status(401);
    throw new ApiError(errors.Unauthorized)
  }
}); 

module.exports = { protect, isOwner, isAdmin };
