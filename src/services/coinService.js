const {ApiError} = require("../utils/ApiError");
const coinRepository = require("../repositories/coinRepository");
const errors= require("../utils/error-messages");

/**
 * create coin
 * @param coin
 */
 const createCoin = async (coin) => {
  const found = await coinRepository.findOne({ symbol: coin?.symbol });
  if (found) {
    throw new ApiError(errors.CoinExists);
  }
  return coinRepository.save(coin);
};

/**
 * get coins
 * @returns {Promise<QueryResult>}
 */
 const getCoins = async () => {
  return coinRepository.findAll();
};

/**
 * get coin by id
 * @param coinId
 */
 const getCoinById = async (coinId) => {
  const coin = await coinRepository.findById(coinId);
  if (!coin) {
    throw new ApiError(errors.CoinNotFound);
  }
  return coin;
};

/**
 * update coin
 * @param coinId
 * @param updateBody
 */
 const updateCoin = async (coinId, updateBody) => {
  const foundCoin = await getCoinById(coinId);
  //
  const duplicateFound = await coinRepository.findOne({
    symbol: updateBody.symbol,
    _id: { $ne: coinId },
  });

  if (duplicateFound) {
    throw new ApiError(errors.CoinExists);
  }

  Object.assign(foundCoin, updateBody);
  return coinRepository.update(foundCoin);
};

/**
 * delete coin
 * @param coinId
 */
 const deleteCoin = async (coinId) => {
  await getCoinById(coinId);
  return coinRepository.deleteCoin(coinId);
};

module.exports = {
    createCoin,
    getCoins,
    getCoinById,
    updateCoin,
    deleteCoin,
  };
  
