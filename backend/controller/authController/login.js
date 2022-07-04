const catchHandler = require("../../utils/catchHandler");
const ErrorResponse = require("../../utils/ErrorResponse");

const USER = require("../../models/user");

const login = catchHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse(400, "missing email or password"));
  }

  const user = await USER.findOne({ email });

  if (user === null || (await user.isPasswordMatched(password))) {
    console.log(await user.isPasswordMatched(password), password);
    return next(new ErrorResponse(400, "email or password are not valid"));
  }

  const token = await user.createToken();

  res.json({
    success: true,
    data: user,
    token,
    message: "User is logged in successfully",
  });
});

module.exports = login;
