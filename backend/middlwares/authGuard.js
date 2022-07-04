const jwt = require("jsonwebtoken");
const ErrorResponse = require("../utils/ErrorResponse");
const USER = require("../models/user");

const authGaurd = async (req, res, next) => {
  if (
    !req.headers.authorization &&
    !req.headers.authorization.startsWith("Bearer ")
  ) {
    return next(new ErrorResponse(401, "No authorization header"));
  }

  const token = req.headers.authorization.split(" ")[1];

  if (!token) {
    return next(new ErrorResponse(401, "Unauthorized access"));
  }

  try {
    const { id } = jwt.verify(
      token,
      process.env.JWT_KEY || "JSONWEBTOKENSECRET"
    );

    if (id === null) {
      return next(new ErrorResponse(401, "Unauthorized access"));
    }

    const user = await USER.findById(id);

    if (user === null) {
      return next(new ErrorResponse(401, "Unauthorized access"));
    }
    req.user = user;
    next();
  } catch (err) {
    return next(new ErrorResponse(401, "invalid token"));
  }
};

const authorize =
  (...roles) =>
  (req, res, next) => {
    if (roles.includes(req.user.role)) return next();
    next(new ErrorResponse(401, "Unauthorized access"));
  };

module.exports = { authGaurd, authorize };
