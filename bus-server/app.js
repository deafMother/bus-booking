const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const AppError = require("./utils/AppError");
const globalErrorHandler = require("./controller/errorConroller");
// import routes
const busRouter = require("./routes/busRoutes");
const bookingRouter = require("./routes/bookingRoute");
const userRouter = require("./routes/userRoutes");

const app = express();
app.use(cors());

// body parser
app.use(
  express.json({
    limit: "20kb"
  })
);
app.use(cookieParser());

// // CORS (Cross-Origin Resource Sharing) headers to support Cross-site HTTP requests
// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Credentials", true);
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//   );
//   next();
// });
// all routes entry points will be here
app.use("/", busRouter);
app.use("/bookBus", bookingRouter);
app.use("/user", userRouter);
// default undefined routes
app.all("*", (req, res, next) => {
  // throw error using AppError
  next(new AppError("This route is not defined", 404));
});
// this is the global error handler
app.use(globalErrorHandler);
module.exports = app;
