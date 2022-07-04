const catchHandler = require("../utils/catchHandler");

const USER = require("../models/user");
const ErrorResponse = require("../utils/ErrorResponse");

const isEmailVertify = catchHandler(async (req, res, next) => {
  const user = await USER.findOne({
    email: req.body.email,
  });

  if (!user) {
    return next(new ErrorResponse(400, "Email not vaild"));
  }
  if (!user.isAccountVerified) {
    return next(
      new ErrorResponse(400, "Please check your email to verify your account")
    );
  }
  next();
});

module.exports = isEmailVertify;
