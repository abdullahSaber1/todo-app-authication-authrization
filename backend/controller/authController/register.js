const sgMail = require("@sendgrid/mail");
const crypto = require("crypto");
const catchHandler = require("../../utils/catchHandler");
const ErrorResponse = require("../../utils/ErrorResponse");

const USER = require("../../models/user");

sgMail.setApiKey(
  "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"
);

const register = catchHandler(async (req, res, next) => {
  const user = await USER.create(req.body);

  const token = await user.createToken();

  const verficationToken = await user.generateVerificationToken();

  await user.save();

  const url = `http://${req.headers.host}/api/v1/users/verify-email?token=${verficationToken}`;

  const message = `Please verify your email by clicking the link: ${url}. If you did not request this, please ignore this email.`;

  const msg = {
    to: user.email,
    from: '"vertify your Email Address" <sadge@post.com>',
    subject: "myapp -vertify your Email Address",
    text: message,
    html: `<p>Please verify your email by clicking the link: <a href="${url}">${url}</a>. If you did not request this, please ignore this email.</p>`,
  };

  await sgMail.send(msg);

  res.json({
    success: true,
    data: user,
    token,
    message: "vertify email is sent to your account",
  });
});

const vertifyEmail = catchHandler(async (req, res, next) => {
  const verficationToken = req.query.token;

  const hashedToken = crypto
    .createHash("sha256")
    .update(verficationToken)
    .digest("hex");

  const user = await USER.findOne({
    accountVerificationToken: hashedToken,
    verificationTokenExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ErrorResponse(400, "Invalid token"));
  }
  user.isAccountVerified = true;
  user.accountVerificationToken = undefined;
  user.accountVerificationExpiry = undefined;
  await user.save();

  res.redirect(`http://${req.hostname}:3000/login`);
  // res.json({
  //   success: true,
  //   message: "your account is verified",
  // });
});

module.exports = { register, vertifyEmail };
