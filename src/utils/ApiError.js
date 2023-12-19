class ApiError extends Error {
    constructor(error, isOperational = true, stack = "") {
        super(error.message);
        this.statusCode = error.statusCode;
        this.errorCode = error.errorCode;
        this.isOperational = isOperational;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

module.exports = {
    ApiError,
  };