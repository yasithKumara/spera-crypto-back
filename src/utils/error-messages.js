const httpStatus = require("http-status");

 const CoinNotFound = { errorCode: 'SC404', message: "Coin not found", statusCode: httpStatus.NOT_FOUND }
 const CoinExists = { errorCode: 'SC400', message: "Coin already exists", statusCode: httpStatus.BAD_REQUEST }

 const UserNotFound = { errorCode: 'SU404', message: "User not found", statusCode: httpStatus.NOT_FOUND }
 const UserExists = { errorCode: 'SU400', message: "User already exists", statusCode: httpStatus.BAD_REQUEST }

 const AuthFailed = { errorCode: 'SU400', message: "The username or password you entered is incorrect", statusCode: httpStatus.BAD_REQUEST }
 const Unauthorized = { errorCode: 'SU401', message: "Unauthorized", statusCode: httpStatus.UNAUTHORIZED }

 module.exports = {
    CoinExists,
    CoinNotFound,
    UserNotFound,
    UserExists,
    AuthFailed,
    Unauthorized
 }