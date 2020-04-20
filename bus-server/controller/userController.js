const CatchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const User = require("../model/userModel");
const jwt = require("jsonwebtoken");
const { promisify } = require("util"); // neede to promisify a function

// create a fucntion to create jwt token on login and register
const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

// generate the jwt token
const generateToken = (user, statusCode, res) => {
  let token = signToken(user.id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ), // the expire time hs to be in milliseconds
    secure: false, // send only on secire https connections if true
    httpOnly: false, //prevent the browser from updating the cookie in any way
    sameSite: false,
    signed: false
  };
  user.password = undefined; // remove the password from the response
  res.cookie("jwt-bus-token", token, cookieOptions);
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user
    }
  });
};

// this route has to be protected
exports.getAllUser = CatchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: "success",
    result: users.length,
    data: {
      users
    }
  });
});

// get single user info

exports.getMe = CatchAsync(async (req, res, next) => {
  res.status(200).json({
    status: "success",
    data: {
      user: req.user
    }
  });
});

exports.addUser = CatchAsync(async (req, res, next) => {
  // when a new user is added a jwt token is created and send via the cookie
  const user = await User.create(req.body);
  generateToken(user, 201, res);
  res.status(200).json({
    status: "success",
    data: {
      user
    }
  });
});

// this route has to be protected
exports.updateUser = CatchAsync(async (req, res, next) => {
  if (req.password) {
    return next(new AppError("Action Not Allowed", 401));
  }
  const { name } = req.name;
  const user = await User.findOneAndUpdate({ name }, req.body, {
    new: true,
    runValidators: true
  });
  res.status(200).json({
    status: "success",
    data: {
      user
    }
  });
});

exports.loginIn = CatchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.checkPassword(password, user.password))) {
    return next(new AppError(new AppError("Invalid Email or password", 404)));
  }
  generateToken(user, 200, res);
});

// middleware to protect routes

exports.protect = CatchAsync(async (req, res, next) => {
  let token;
  // 1) check if the token exists, i.e  has been send in the request
  // console.log(req.cookies);

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return next(
      new AppError("Authentication failed, Please login in to gain access", 401)
    );
  }
  // 2) validate the user of the token still exists in the database
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  //3) check if the user still exists
  const freshUser = await User.findById(decoded.id).populate(
    "myBookings.bookingNumer"
  );
  if (!freshUser) {
    return next(new AppError("The User of this token has been deleted", 401));
  }
  req.user = freshUser;
  //res.locals.user = freshUser;
  next();
});
// check if the user if loged in or not
exports.checkLoginStatus = CatchAsync(async (req, res, next) => {
  let token;
  // 1) check if the token exists, i.e  has been send in the request
  // console.log(req.cookies);

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  // } else if (req.cookies) {
  //   token = req.cookies.jwt;
  // }
  if (!token) {
    return next(
      new AppError("Authentication failed, Please login in to gain access", 401)
    );
  }
  // 2) validate the user of the token still exists in the database
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  //3) check if the user still exists
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(new AppError("The User of this token has been deleted", 401));
  }
  res.status(200).json({
    status: "success",
    data: {
      message: "User logged in",
      data: freshUser
    }
  });
});

// implement password change feature: pending
// implement a verify-token each time a user opens a page to automatically login the user: pending
