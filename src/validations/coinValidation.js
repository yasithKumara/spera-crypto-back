const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)

const createCoin = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    symbol: Joi.string().required(),
    price: Joi.string().required(),
  }),
};

const updateCoin = {
  params: Joi.object().keys({
    id: Joi.objectId().required(),
  }),
  body: Joi.object().keys({
    name: Joi.string().required(),
    symbol: Joi.string().required(),
    price: Joi.string(),
  }),
};

const deleteCoin = {
  params: Joi.object().keys({
    id: Joi.objectId().required(),
  }),
};

const getCoin = {
  params: Joi.object().keys({
    id: Joi.objectId().required(),
  }),
};

module.exports = {
  createCoin,
  updateCoin,
  deleteCoin,
  getCoin,
};
