const asyncHandler = require("express-async-handler");
const Coin = require("../models/coinModel");
const mongoose = require("mongoose");

const httpStatus = require("http-status");
const coinService = require("../services/coinService");

/**
 * create coin application programing interface
 * @param {Express.Request} req - http request
 * @param {Express.Response} res - http response
 * @returns {Express.Response}
 */
const createCoin = asyncHandler(async (req, res) => {
  const payload = req.body;
  const result = await coinService.createCoin(payload);
  res.status(httpStatus.CREATED).send(result);
});

/**
 * get coins application programing interface
 * @param {Express.Request} req - http request
 * @param {Express.Response} res - http response
 * @returns {Express.Response}
 */
const getCoins = asyncHandler(async (req, res) => {
  const result = await coinService.getCoins();
  res.status(httpStatus.OK).send(result);
});

/**
 * get single coin application programing interface
 * @param {Express.Request} req - http request
 * @param {Express.Response} res - http response
 * @returns {Express.Response}
 */
const getCoin = asyncHandler(async (req, res) => {
  const coinId = req.params.id;
  const coin = await coinService.getCoinById(coinId);
  res.status(httpStatus.OK).send(coin);
});

/**
 * update coin application programing interface
 * @param {Express.Request} req - http request
 * @param {Express.Response} res - http response
 * @returns {Express.Response}
 */
const updateCoin = asyncHandler(async (req, res) => {
  const coinId = req.params.id;
  const payload = req.body;
  const coin = await coinService.updateCoin(coinId, payload);
  res.status(httpStatus.CREATED).send(coin);
});

/**
 * delete coin application programing interface
 * @param {Express.Request} req - http request
 * @param {Express.Response} res - http response
 * @returns {Express.Response}
 */
const deleteCoin = asyncHandler(async (req, res) => {
  const coinId = req.params.id;
  await coinService.deleteCoin(coinId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createCoin,
  getCoins,
  getCoin,
  updateCoin,
  deleteCoin,
};
