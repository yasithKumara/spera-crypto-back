var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger.js");
const asyncConnectToDatabase = require("./db/conn.js");
const asyncFetchPrices = require("./services/fetchPrices.js");
const asyncSubscribeToCoinbaseTicker = require("./socket/socket.js");


var indexRouter = require("./routes/index");
var usersRouter = require("./routes/userRoutes");
var coinsRouter = require("./routes/coinRoutes");
var authRouter = require("./routes/authRoutes");
const { errorHandler } = require("./middleware/errorMiddleware.js");

var app = express();

// Connect to the database before fetching prices
asyncConnectToDatabase()
  .then(() => {
    // Fetch prices initially
    return asyncFetchPrices();
  })
  .then(() => {
    // Fetch prices every 5 minutes
    setInterval(() => asyncFetchPrices(), 5 * 60 * 1000);
  }).then(() => {
    // connect to realtime feed to get price using websockets
    asyncSubscribeToCoinbaseTicker()
  })
  .catch(error => {
    console.error(`Unable to start server due to database connection error: ${error.message}`);
  });



// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/coins", coinsRouter);
app.use("/auth", authRouter);

// Serve Swagger UI at /api-docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
// app.use(function (err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get("env") === "development" ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   console.log(err)
//   res.json({success: "false", data: {message: err.message, err: err}});
// });

app.use(errorHandler)

module.exports = app;
