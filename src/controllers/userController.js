const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const User = require("../models/userModels");
const mongoose = require("mongoose");
const userService = require("../services/userService");
const httpStatus = require("http-status");

/**
 * Get a list of all users
 *
 * @function
 * @name getUsers
 * @async
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void}
 */
const getUsers = asyncHandler(async (req, res) => {
  const result = await userService.getUsers();
  res.status(httpStatus.OK).send(result);
});

/**
 * Get details of a specific user
 *
 * @function
 * @name getUser
 * @async
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @throws {Error} Throws an error if validation fails or user is not found
 * @returns {void}
 */
const getUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const user = await userService.getUserById(userId);

  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    favorite_coins: user.favorite_coins,
  });
});

/**
 * Update details of a specific user
 *
 * @function
 * @name updateUser
 * @async
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @throws {Error} Throws an error if validation fails or user is not found
 * @returns {void}
 */
const updateUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  const { name, email, password } = req.body;

  //hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await userService.updateUser(userId, {
    name,
    email,
    password: hashedPassword,
  });

  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    favorite_coins: user.favorite_coins,
  });
});

/**
 * Delete a user
 *
 * @function
 * @name deleteUser
 * @async
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @throws {Error} Throws an error if validation fails or user already exists
 * @returns {void}
 */
const deleteUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  await userService.deleteUser(userId);
  res.status(httpStatus.NO_CONTENT).send();
});

/**
 * Set favorite coins for user
 *
 * @function
 * @name setFavoriteCoins
 * @async
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @throws {Error} Throws an error if validation fails or user already exists
 * @returns {void}
 */
const setFavoriteCoins = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const { favorite_coins } = req.body;

  const user = await User.findByIdAndUpdate(
    userId,
    { favorite_coins: favorite_coins },
    { new: true }
  ).populate("favorite_coins");

  if (user) {
    res.status(httpStatus.OK).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      favorite_coins: user.favorite_coins,
    });
  } else {
    res.status(400);
    throw new Error("Invalid data");
  }
});

module.exports = {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  setFavoriteCoins,
};
