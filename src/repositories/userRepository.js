const User = require("../models/userModels");

/**
 * save a User into db
 * @param object
 * @return {Promise<>}
 */
const save = async (object) => {
  return User.create(object);
};

/**
 * delete a User in db
 * @param id
 * @return {Promise<>}
 */
const deleteUser = async (id) => {
  const user = await findOne({ _id: id });
  await User.deleteOne({ _id: id });
};

/**
 * update User in db
 * @param object
 * @return {Promise<>}
 */
const update = async (object) => {
  await object.save();
  return object;
};

/**
 * find User by id
 * @param id
 * @return {Promise<>}
 */
const findById = async (id) => {
  console.log(id);
  return User.findById(id).populate("favorite_coins");
  //   return findOne({ _id: id });
};

/**
 * find User
 * @param filter
 * @return {Promise<>}
 */
const findOne = async (filter) => {
  return User.findOne(filter).populate("favorite_coins");
};

/**
 * find all Users
 * @return {Promise<[]>}
 */
const findAll = async () => {
  return await User.find().select("-password");
};

module.exports = {
  save,
  update,
  findById,
  findAll,
  findOne,
  deleteUser,
};
