const Coin = require("../models/coinModel");

/**
 * save a Coin into db
 * @param object
 * @return {Promise<>}
 */
 const save = async (object) => {
  return Coin.create(object);
};

/**
 * delete a Coin in db
 * @param id
 * @return {Promise<>}
 */
 const deleteCoin = async (id) => {
  const coin = await findOne({ _id: id });
  await Coin.deleteOne({ _id: id });
};


/**
 * update Coin in db
 * @param object
 * @return {Promise<>}
 */
 const update = async (object) => {
  await object.save();
  return object;
};

/**
 * find Coin by id
 * @param id
 * @return {Promise<>}
 */
 const findById = async (id) => {
    return Coin.findById(id);
//   return findOne({ _id: id });
};

/**
 * find Coin
 * @param filter
 * @return {Promise<>}
 */
 const findOne = async (filter) => {
  return Coin.findOne(filter);
};

/**
 * find all Coins
 * @return {Promise<[]>}
 */
 const findAll = async () => {
  return await Coin.find();
};

module.exports = {
    save,
    update,
    findById,
    findAll,
    findOne,
    deleteCoin,
  };