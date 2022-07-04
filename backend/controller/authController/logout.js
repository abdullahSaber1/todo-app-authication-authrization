const catchHandler = require("../../utils/catchHandler");

const logout = catchHandler(async (req, res, next) => {
  res.clearCookie("token_uid");
  res.json({
    success: true,
    message: "User logged out successfully",
  });
});

module.exports = logout;
