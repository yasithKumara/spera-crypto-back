const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)

const createUser = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    id: Joi.objectId().required(),
  }),
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string(),
  }),
};

const deleteUser = {
  params: Joi.object().keys({
    id: Joi.objectId().required(),
  }),
};

const getUser = {
  params: Joi.object().keys({
    id: Joi.objectId().required(),
  }),
};

const setFavoriteCoins = {
    params: Joi.object().keys({
      id: Joi.objectId().required(),
    }),
    body: Joi.object().keys({
        favorite_coins: Joi.array().items(Joi.objectId()).required(),
    }),
  };

module.exports = {
  createUser,
  updateUser,
  deleteUser,
  getUser,
  setFavoriteCoins
};