const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const User = require("../models/userModels");
const jwt = require("jsonwebtoken");
const userService = require("../services/userService");
const httpStatus = require("http-status");
const errors= require("../utils/error-messages");
const {ApiError} = require("../utils/ApiError");

/**
 * Register a new user
 *
 * @function
 * @name registerUser
 * @async
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @throws {Error} Throws an error if validation fails or user already exists
 * @returns {void}
 */
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = {
    name,
    email,
    password: hashedPassword,
  };

  const result = await userService.createUser(user);
  res.status(httpStatus.CREATED).send({"_id": result._id, name: result.name, email:result.email});
});

/**
 * Log in an existing user
 *
 * @function
 * @name loginUser
 * @async
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @throws {Error} Throws an error if validation fails or authentication fails
 * @returns {void}
 */
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await userService.getUser({email: email})

  //check if user and passwords match
  if (user && (await bcrypt.compare(password, user.password))) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
  });
  } else {
    res.status(400);
    throw new ApiError(errors.AuthFailed)
  }
});

/**
 * Generate a JWT token for a user
 *
 * @function
 * @name generateToken
 * @param {string} id - User ID
 * @returns {string} JWT token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = {
    registerUser,
    loginUser,
  };