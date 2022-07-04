const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { isEmail } = require("validator");

const crypto = require("crypto");

const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      minlength: [3, "Name must be at least 3 characters long"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      validate: [isEmail, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isAccountVerified: {
      type: Boolean,
      default: false,
    },
    accountVerificationToken: {
      type: String,
    },
    accountVerificationExpiry: {
      type: Date,
    },
    passwordChangedAt: {
      type: Date,
    },
    passwordResetToken: {
      type: String,
      default: null,
    },
    passwordResetExpiry: {
      type: Date,
    },
    todos: [
      {
        type: Schema.Types.ObjectId,
        ref: "todo",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Hash password
// Hash password
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(this.password, salt);
  this.password = hash;
  next();
});

userSchema.methods.isPasswordMatched = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.createToken = async function () {
  const token = await jwt.sign(
    { id: this._id },
    process.env.JWT_SECRET || "JSONWEBTOKENSECRET",
    { expiresIn: process.env.JWT_EXPIRY || "1d" }
  );
  return token;
};

userSchema.methods.generateVerificationToken = function () {
  // create a token
  const verficationToken = crypto.randomBytes(32).toString("hex");
  // hash the token and set it to the user's account verification token
  this.accountVerificationToken = crypto
    .createHash("sha256")
    .update(verficationToken)
    .digest("hex");
  // set a expiration date for the token after 10 minutes
  this.accountVerificationExpiry = Date.now() + 10 * 60 * 1000;
  return verficationToken;
};

// forgot password
userSchema.methods.generatePasswordResetToken = function () {
  // create a token
  const resetToken = crypto.randomBytes(32).toString("hex");
  // hash the token and set it to the user's password reset token
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  // set a expiration date for the token after 10 minutes
  this.passwordResetExpiry = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const userModel = model("user", userSchema);

module.exports = userModel;
