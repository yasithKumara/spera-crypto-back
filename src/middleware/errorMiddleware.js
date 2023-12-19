const errorHandler = (error, req, res, next) => {
  let statusCode;
  if(error.statusCode){
    statusCode = error.statusCode ? error.statusCode : 500;
  }else{
    statusCode = res.statusCode ? res.statusCode : 500;
  }
  //const statusCode = res.statusCode ? res.statusCode : 500;

  res.status(statusCode)
  res.json({
    error: error.message,
    stack: process.env.NODE_ENV === "production" ? NULL : error.stack,
  });
};

module.exports = { errorHandler };
