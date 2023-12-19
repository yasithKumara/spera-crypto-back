const httpStatus = require("http-status");
const Joi = require("joi");
const {ApiError} = require("../utils/ApiError");
const { pick } = require("lodash");

/**
 * validate request payload against defined schemas
 * @param {Joi.AnySchema} schema - request validation schema
 * @returns
 */
const validate = (schema) => (req, res, next) => {
  const validSchema = pick(schema, ["params", "query", "body"]);
  const object = pick(req, Object.keys(validSchema));
  const { value, error } = Joi.compile(validSchema)
    .prefs({ errors: { label: "key" }, abortEarly: false })
    .validate(object);

    console.log(value, error)

  if (error) {
    const errorMessage = error.details
      .map((details) => details.message)
      .join(", ");
    return next(new ApiError({ errorCode: 'S400', message: errorMessage, statusCode: httpStatus.BAD_REQUEST }));
  }

  Object.assign(req, value);

  return next();
};

module.exports = validate;
