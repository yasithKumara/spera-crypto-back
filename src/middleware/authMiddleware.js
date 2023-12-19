const jwt = require("jsonwebtoken");
const User = require("../models/userModels");
const asyncHandler = require("express-async-handler");
const errors= require("../utils/error-messages");

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

      console.log(decoded)

      //get user from token
      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      console.log(error);
      res.status(401)
      throw new ApiError(errors.Unauthorized);
    }
  }

  if (!token) {
    res.status(401);
    throw new Error(errors.Unauthorized);
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
        throw new Error("Not Authorized");
      }

      req.user = user

      next();
    } catch (error) {
      console.log(error);
      res.status(401);
      throw new Error("Not Authorized");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not Authorized");
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
        throw new Error("Not Authorized");
      }

      next();
    } catch (error) {
      console.log(error);
      res.status(401);
      res.statusCode(401);
      throw new Error("Not Authorized");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not Authorized");
  }
}); 

module.exports = { protect, isOwner, isAdmin };
