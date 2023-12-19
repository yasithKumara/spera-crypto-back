const {ApiError} = require("../utils/ApiError");
const userRepository = require("../repositories/userRepository");
const errors= require("../utils/error-messages");

/**
 * create user
 * @param user
 */
 const createUser = async (user) => {
  const found = await userRepository.findOne({ email: user?.email });
  if (found) {
    throw new ApiError(errors.UserExists);
  }
  return userRepository.save(user);
};

/**
 * get users
 * @returns {Promise<QueryResult>}
 */
 const getUsers = async () => {
  return userRepository.findAll();
};

/**
 * get user by id
 * @param userId
 */
 const getUserById = async (userId) => {
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new ApiError(errors.UserNotFound);
  }
  return user;
};

/**
 * get user by id
 * @param userId
 */
const getUser = async (filter) => {
    console.log(filter)
    const user = await userRepository.findOne(filter);
    if (!user) {
      throw new ApiError(errors.UserNotFound);
    }
    return user;
  };

/**
 * update user
 * @param userId
 * @param updateBody
 */
 const updateUser = async (userId, updateBody) => {
  const foundUser = await getUserById(userId);
  //
  const duplicateFound = await userRepository.findOne({
    email: updateBody.email,
    _id: { $ne: userId },
  });

  if (duplicateFound) {
    throw new ApiError(errors.UserExists);
  }

  Object.assign(foundUser, updateBody);
  return userRepository.update(foundUser);
};

/**
 * delete user
 * @param userId
 */
 const deleteUser = async (userId) => {
  await getUserById(userId);
  return userRepository.deleteUser(userId);
};

module.exports = {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    getUser
  };
  
