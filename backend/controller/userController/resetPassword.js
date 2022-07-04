const sgMail = require("@sendgrid/mail");
const crypto = require("crypto");
const catchHandler = require("../../utils/catchHandler");
const ErrorResponse = require("../../utils/ErrorResponse");

const USER = require("../../models/user");

sgMail.setApiKey(
  "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"
);

const forgotPasswordToken = catchHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await USER.findOne({ email });
  if (!user) {
    return next(new ErrorResponse(400, "user not found"));
  }

  const token = user.generatePasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const url = `http://${req.headers.host}/api/v1/users/reset-password?token=${token}`;

  const message = `You are receiving this email because you (or someone else) have requested the reset of a password. Please make a PUT request to: ${url}`;

  const msg = {
    to: email,
    from: "sadge@post.com",
    subject: "Password reset",
    text: message,
    html: `<p>You are receiving this email because you (or someone else) have requested the reset of a password. Please make a PUT request to: <a href="${url}">${url}</a></p>`,
  };
  await sgMail.send(msg);
  res.status(200).json({
    success: true,
    message: "Email sent",
    data: msg,
  });
});

const resetPassword = catchHandler(async (req, res, next) => {
  const verficationToken = req.query.token;

  const hashedToken = crypto
    .createHash("sha256")
    .update(verficationToken)
    .digest("hex");

  const { password } = req.body;
  const user = await USER.findOne({
    passwordResetToken: hashedToken,
    passwordResetTokenExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ErrorResponse(400, "user not found"));
  }
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpiry = undefined;
  await user.save({ validateBeforeSave: false });
  res.json({
    success: true,
    message: "Your password has been reset",
  });
});

module.exports = {
  forgotPasswordToken,
  resetPassword,
};
